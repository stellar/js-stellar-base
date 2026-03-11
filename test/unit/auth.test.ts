import { describe, it, expect, afterEach, vi } from "vitest";
import {
  authorizeEntry,
  authorizeInvocation,
  SigningCallback,
} from "../../src/auth.js";
import { Keypair } from "../../src/keypair.js";
import { Address } from "../../src/address.js";
import { StrKey } from "../../src/strkey.js";
import { hash } from "../../src/hashing.js";
import { scValToNative } from "../../src/scval.js";
import xdr from "../../src/xdr.js";

describe("building authorization entries", () => {
  const kp = Keypair.random();
  const contractId = "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE";

  const authEntry = new xdr.SorobanAuthorizationEntry({
    rootInvocation: new xdr.SorobanAuthorizedInvocation({
      function:
        xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
          new xdr.InvokeContractArgs({
            contractAddress: new Address(contractId).toScAddress(),
            functionName: "hello",
            args: [xdr.ScVal.scvU64(new xdr.Uint64(1234n))],
          }),
        ),
      subInvocations: [],
    }),
    credentials: xdr.SorobanCredentials.sorobanCredentialsAddress(
      new xdr.SorobanAddressCredentials({
        address: new Address(kp.publicKey()).toScAddress(),
        nonce: new xdr.Int64(123456789101112n),
        signatureExpirationLedger: 0,
        signature: xdr.ScVal.scvVec([]),
      }),
    ),
  });

  it("builds a mock entry correctly", () => {
    expect(() => authEntry.toXDR()).not.toThrow();
  });

  describe("authorizeEntry", () => {
    it("signs the entry correctly with a Keypair", async () => {
      const signedEntry = await authorizeEntry(authEntry, kp, 10);

      expect(signedEntry.rootInvocation().toXDR()).toEqual(
        authEntry.rootInvocation().toXDR(),
      );

      const signedAddr = signedEntry.credentials().address();
      const entryAddr = authEntry.credentials().address();
      expect(signedAddr.signatureExpirationLedger()).toBe(10);
      expect(signedAddr.address().toXDR()).toEqual(entryAddr.address().toXDR());
      expect(signedAddr.nonce().toBigInt()).toBe(entryAddr.nonce().toBigInt());

      const sigArgs = signedAddr
        .signature()
        .vec()!
        .map((v) => scValToNative(v));
      expect(sigArgs).toHaveLength(1);

      const sig = sigArgs[0] as { public_key: Buffer; signature: Buffer };
      expect(sig).toHaveProperty("public_key");
      expect(sig).toHaveProperty("signature");
      expect(StrKey.encodeEd25519PublicKey(sig.public_key)).toBe(
        kp.publicKey(),
      );
    });

    it("signs the entry correctly with a callback", async () => {
      const callback: SigningCallback = async (preimage) =>
        kp.sign(hash(preimage.toXDR()));

      const signedEntry = await authorizeEntry(authEntry, callback, 10);

      const signedAddr = signedEntry.credentials().address();
      expect(signedAddr.signatureExpirationLedger()).toBe(10);

      const sigArgs = signedAddr
        .signature()
        .vec()!
        .map((v) => scValToNative(v));
      expect(sigArgs).toHaveLength(1);

      const sig = sigArgs[0] as { public_key: Buffer; signature: Buffer };
      expect(StrKey.encodeEd25519PublicKey(sig.public_key)).toBe(
        kp.publicKey(),
      );
    });

    it("signs the entry correctly with a callback returning an object", async () => {
      const callback: SigningCallback = async (preimage) => ({
        signature: kp.sign(hash(preimage.toXDR())),
        publicKey: kp.publicKey(),
      });

      const signedEntry = await authorizeEntry(authEntry, callback, 10);

      const signedAddr = signedEntry.credentials().address();
      expect(signedAddr.signatureExpirationLedger()).toBe(10);

      const sigArgs = signedAddr
        .signature()
        .vec()!
        .map((v) => scValToNative(v));
      expect(sigArgs).toHaveLength(1);

      const sig = sigArgs[0] as { public_key: Buffer; signature: Buffer };
      expect(StrKey.encodeEd25519PublicKey(sig.public_key)).toBe(
        kp.publicKey(),
      );
    });

    it("returns entry unchanged for source account credentials (no-op)", async () => {
      const sourceAccountEntry = new xdr.SorobanAuthorizationEntry({
        rootInvocation: authEntry.rootInvocation(),
        credentials: xdr.SorobanCredentials.sorobanCredentialsSourceAccount(),
      });

      const result = await authorizeEntry(sourceAccountEntry, kp, 10);
      expect(result.toXDR()).toEqual(sourceAccountEntry.toXDR());
    });

    it("succeeds with a different signer (signs with the given keypair)", async () => {
      // When a random keypair is passed, it signs with its own key and the
      // verification still passes because Keypair.verify uses the signer's
      // own publicKey — the function does NOT enforce that the signer matches
      // the entry's credential address.
      const randomKp = Keypair.random();

      // Build an entry whose credential address matches randomKp
      const entryForRandom = new xdr.SorobanAuthorizationEntry({
        rootInvocation: authEntry.rootInvocation(),
        credentials: xdr.SorobanCredentials.sorobanCredentialsAddress(
          new xdr.SorobanAddressCredentials({
            address: new Address(randomKp.publicKey()).toScAddress(),
            nonce: new xdr.Int64(123456789101112n),
            signatureExpirationLedger: 0,
            signature: xdr.ScVal.scvVec([]),
          }),
        ),
      });

      const signed = await authorizeEntry(entryForRandom, randomKp, 10);
      expect(signed.credentials().address().signatureExpirationLedger()).toBe(
        10,
      );
    });

    it("throws when signature verification fails", async () => {
      // Use a callback that returns a valid-looking signature from a
      // different key, paired with the entry's publicKey — verification
      // will fail because the signature doesn't match.
      const wrongKp = Keypair.random();
      const badCallback: SigningCallback = async (preimage) => ({
        signature: wrongKp.sign(hash(preimage.toXDR())),
        publicKey: kp.publicKey(), // claims to be kp but signed with wrongKp
      });

      await expect(authorizeEntry(authEntry, badCallback, 10)).rejects.toThrow(
        /signature doesn't match payload/,
      );
    });

    it("throws with a bad signature from a callback", async () => {
      const badCallback: SigningCallback = async (_preimage) => ({
        signature: Buffer.from("bad-signature-data"),
        publicKey: kp.publicKey(),
      });

      await expect(authorizeEntry(authEntry, badCallback, 10)).rejects.toThrow(
        /signature doesn't match payload/,
      );
    });
  });

  describe("authorizeInvocation", () => {
    it("can build from scratch with a Keypair", async () => {
      const signedEntry = await authorizeInvocation(
        kp,
        10,
        authEntry.rootInvocation(),
      );

      expect(signedEntry.rootInvocation().toXDR()).toEqual(
        authEntry.rootInvocation().toXDR(),
      );

      const signedAddr = signedEntry.credentials().address();
      expect(signedAddr.signatureExpirationLedger()).toBe(10);

      const addrStr = Address.fromScAddress(signedAddr.address()).toString();
      expect(addrStr).toBe(kp.publicKey());
    });

    it("can build from scratch with explicit publicKey", async () => {
      const callback: SigningCallback = async (preimage) => ({
        signature: kp.sign(hash(preimage.toXDR())),
        publicKey: kp.publicKey(),
      });

      const signedEntry = await authorizeInvocation(
        callback,
        10,
        authEntry.rootInvocation(),
        kp.publicKey(),
      );

      const signedAddr = signedEntry.credentials().address();
      expect(signedAddr.signatureExpirationLedger()).toBe(10);

      const addrStr = Address.fromScAddress(signedAddr.address()).toString();
      expect(addrStr).toBe(kp.publicKey());
    });

    it("throws when signer has no publicKey method and none provided", () => {
      const callback: SigningCallback = async (preimage) =>
        kp.sign(hash(preimage.toXDR()));

      // When called with a non-Keypair signer and no explicit publicKey, the
      // implementation throws Error("authorizeInvocation requires publicKey parameter").
      expect(() =>
        authorizeInvocation(callback, 10, authEntry.rootInvocation()),
      ).toThrow("authorizeInvocation requires publicKey parameter");
    });
  });

  describe("nonce generation uses all 8 bytes", () => {
    function stubRawBytes(first8: number[]): void {
      const raw = new Uint8Array(first8.length);
      raw.set(first8);
      vi.spyOn(Keypair, "random").mockReturnValue({
        rawPublicKey: () => raw,
      } as unknown as Keypair);
    }

    afterEach(() => {
      vi.restoreAllMocks();
    });

    // Regression: the old `<<` (Int32 shift) implementation discarded the upper 4
    // bytes. bytes [0,0,0,1, 0,0,0,0] — after consuming bytes 0-3 the accumulator
    // reaches 1, then four more left-shifts overflow Int32 back to 0. The nonce was
    // 0 instead of the correct 2^32.
    it("upper 4 bytes contribute to the nonce", async () => {
      stubRawBytes([0, 0, 0, 1, 0, 0, 0, 0]);
      const entry = await authorizeInvocation(
        kp,
        10,
        authEntry.rootInvocation(),
      );
      expect(entry.credentials().address().nonce().toBigInt()).toBe(
        4294967296n,
      ); // 2^32
    });

    it("all-0xFF bytes produce nonce -1 (signed Int64 all-bits-set)", async () => {
      stubRawBytes([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
      const entry = await authorizeInvocation(
        kp,
        10,
        authEntry.rootInvocation(),
      );
      expect(entry.credentials().address().nonce().toBigInt()).toBe(-1n);
    });

    it("high bit set produces Int64 minimum value", async () => {
      stubRawBytes([0x80, 0, 0, 0, 0, 0, 0, 0]);
      const entry = await authorizeInvocation(
        kp,
        10,
        authEntry.rootInvocation(),
      );
      expect(entry.credentials().address().nonce().toBigInt()).toBe(
        -9223372036854775808n,
      ); // -(2^63), Int64 minimum
    });

    it("all-zero bytes produce nonce 0", async () => {
      stubRawBytes([0, 0, 0, 0, 0, 0, 0, 0]);
      const entry = await authorizeInvocation(
        kp,
        10,
        authEntry.rootInvocation(),
      );
      expect(entry.credentials().address().nonce().toBigInt()).toBe(0n);
    });

    it("throws if fewer than 8 bytes are available", async () => {
      stubRawBytes([0, 0, 0]); // only 3 bytes

      expect(() =>
        authorizeInvocation(kp, 10, authEntry.rootInvocation()),
      ).toThrow(/need at least 8 bytes to convert to Int64, got 3/);
    });
  });
});
