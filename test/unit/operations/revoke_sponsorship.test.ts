import { describe, it, expect } from "vitest";
import { Operation } from "../../../src/operation.js";
import { Asset } from "../../../src/asset.js";
import { LiquidityPoolId } from "../../../src/liquidity_pool_id.js";
import { hash } from "../../../src/hashing.js";
import xdr from "../../../src/xdr.js";

const account = "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
const source = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";

describe("Operation.revokeAccountSponsorship()", () => {
  it("creates a revokeAccountSponsorshipOp", () => {
    const op = Operation.revokeAccountSponsorship({ account });
    const operation = xdr.Operation.fromXDR(op.toXDR("hex"), "hex");
    const obj = Operation.fromXDRObject(operation);

    expect(operation.body().switch().name).toBe("revokeSponsorship");
    expect(obj.type).toBe("revokeAccountSponsorship");

    if (obj.type !== "revokeAccountSponsorship")
      throw new Error("unexpected type");
    expect(obj.account).toBe(account);
  });

  it("fails with an invalid account", () => {
    expect(() =>
      // @ts-expect-error: intentionally passing empty opts to test runtime validation
      Operation.revokeAccountSponsorship({}),
    ).toThrow(/account is invalid/);

    expect(() =>
      Operation.revokeAccountSponsorship({ account: "GBAD" }),
    ).toThrow(/account is invalid/);
  });
});

describe("Operation.revokeTrustlineSponsorship()", () => {
  it("creates a revokeTrustlineSponsorshipOp with an Asset", () => {
    const asset = new Asset(
      "USDUSD",
      "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7",
    );
    const op = Operation.revokeTrustlineSponsorship({ account, asset });
    const operation = xdr.Operation.fromXDR(op.toXDR("hex"), "hex");
    const obj = Operation.fromXDRObject(operation);

    expect(operation.body().switch().name).toBe("revokeSponsorship");
    expect(obj.type).toBe("revokeTrustlineSponsorship");
  });

  it("creates a revokeTrustlineSponsorshipOp with a LiquidityPoolId", () => {
    const asset = new LiquidityPoolId(
      "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7",
    );
    const op = Operation.revokeTrustlineSponsorship({ account, asset });
    const operation = xdr.Operation.fromXDR(op.toXDR("hex"), "hex");
    const obj = Operation.fromXDRObject(operation);

    expect(operation.body().switch().name).toBe("revokeSponsorship");
    expect(obj.type).toBe("revokeTrustlineSponsorship");
  });

  it("fails with an invalid account", () => {
    expect(() =>
      // @ts-expect-error: intentionally passing empty opts to test runtime validation
      Operation.revokeTrustlineSponsorship({}),
    ).toThrow(/account is invalid/);

    expect(() =>
      // @ts-expect-error: intentionally passing invalid account to test runtime validation
      Operation.revokeTrustlineSponsorship({ account: "GBAD" }),
    ).toThrow(/account is invalid/);
  });

  it("fails with an invalid asset", () => {
    expect(() =>
      // @ts-expect-error: intentionally omitting required field to test runtime validation
      Operation.revokeTrustlineSponsorship({ account }),
    ).toThrow(/asset must be an Asset or LiquidityPoolId/);
  });
});

describe("Operation.revokeOfferSponsorship()", () => {
  it("creates a revokeOfferSponsorshipOp", () => {
    const seller = account;
    const offerId = "1234";
    const op = Operation.revokeOfferSponsorship({ seller, offerId });
    const operation = xdr.Operation.fromXDR(op.toXDR("hex"), "hex");
    const obj = Operation.fromXDRObject(operation);

    expect(operation.body().switch().name).toBe("revokeSponsorship");
    expect(obj.type).toBe("revokeOfferSponsorship");

    if (obj.type !== "revokeOfferSponsorship")
      throw new Error("unexpected type");
    expect(obj.seller).toBe(seller);
    expect(obj.offerId).toBe(offerId);
  });

  it("fails with an invalid seller", () => {
    expect(() =>
      // @ts-expect-error: intentionally passing empty opts to test runtime validation
      Operation.revokeOfferSponsorship({}),
    ).toThrow(/seller is invalid/);

    expect(() =>
      Operation.revokeOfferSponsorship({ seller: "GBAD", offerId: "1" }),
    ).toThrow(/seller is invalid/);
  });

  it("fails with a missing offerId", () => {
    expect(() =>
      // @ts-expect-error: intentionally omitting required field to test runtime validation
      Operation.revokeOfferSponsorship({ seller: account }),
    ).toThrow(/offerId is invalid/);
  });
});

describe("Operation.revokeDataSponsorship()", () => {
  it("creates a revokeDataSponsorshipOp", () => {
    const name = "foo";
    const op = Operation.revokeDataSponsorship({ account, name });
    const operation = xdr.Operation.fromXDR(op.toXDR("hex"), "hex");
    const obj = Operation.fromXDRObject(operation);

    expect(operation.body().switch().name).toBe("revokeSponsorship");
    expect(obj.type).toBe("revokeDataSponsorship");

    if (obj.type !== "revokeDataSponsorship")
      throw new Error("unexpected type");
    expect(obj.account).toBe(account);
    expect(obj.name).toBe(name);
  });

  it("fails with an invalid account", () => {
    expect(() =>
      // @ts-expect-error: intentionally passing empty opts to test runtime validation
      Operation.revokeDataSponsorship({}),
    ).toThrow(/account is invalid/);

    expect(() =>
      Operation.revokeDataSponsorship({ account: "GBAD", name: "foo" }),
    ).toThrow(/account is invalid/);
  });

  it("fails with a missing name", () => {
    expect(() =>
      // @ts-expect-error: intentionally omitting required field to test runtime validation
      Operation.revokeDataSponsorship({ account }),
    ).toThrow(/name must be a string, up to 64 characters/);
  });

  it("fails with a name longer than 64 characters", () => {
    expect(() =>
      Operation.revokeDataSponsorship({ account, name: "a".repeat(65) }),
    ).toThrow(/name must be a string, up to 64 characters/);
  });
});

describe("Operation.revokeClaimableBalanceSponsorship()", () => {
  it("creates a revokeClaimableBalanceSponsorshipOp", () => {
    const balanceId =
      "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be";
    const op = Operation.revokeClaimableBalanceSponsorship({ balanceId });
    const operation = xdr.Operation.fromXDR(op.toXDR("hex"), "hex");
    const obj = Operation.fromXDRObject(operation);

    expect(operation.body().switch().name).toBe("revokeSponsorship");
    expect(obj.type).toBe("revokeClaimableBalanceSponsorship");

    if (obj.type !== "revokeClaimableBalanceSponsorship")
      throw new Error("unexpected type");
    expect(obj.balanceId).toBe(balanceId);
  });

  it("fails with an invalid balanceId", () => {
    expect(() =>
      // @ts-expect-error: intentionally passing empty opts to test runtime validation
      Operation.revokeClaimableBalanceSponsorship({}),
    ).toThrow(/balanceId is invalid/);
  });
});

describe("Operation.revokeLiquidityPoolSponsorship()", () => {
  it("creates a revokeLiquidityPoolSponsorshipOp", () => {
    const liquidityPoolId =
      "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7";
    const op = Operation.revokeLiquidityPoolSponsorship({ liquidityPoolId });
    const operation = xdr.Operation.fromXDR(op.toXDR("hex"), "hex");
    const obj = Operation.fromXDRObject(operation);

    expect(operation.body().switch().name).toBe("revokeSponsorship");
    expect(obj.type).toBe("revokeLiquidityPoolSponsorship");

    if (obj.type !== "revokeLiquidityPoolSponsorship")
      throw new Error("unexpected type");
    expect(obj.liquidityPoolId).toBe(liquidityPoolId);
  });

  it("fails with an invalid liquidityPoolId", () => {
    expect(() =>
      // @ts-expect-error: intentionally passing empty opts to test runtime validation
      Operation.revokeLiquidityPoolSponsorship({}),
    ).toThrow(/liquidityPoolId is invalid/);
  });
});

describe("Operation.revokeSignerSponsorship()", () => {
  it("creates a revokeSignerSponsorshipOp with an ed25519PublicKey signer", () => {
    const signer = { ed25519PublicKey: account };
    const op = Operation.revokeSignerSponsorship({ account, signer });
    const operation = xdr.Operation.fromXDR(op.toXDR("hex"), "hex");
    const obj = Operation.fromXDRObject(operation);

    expect(operation.body().switch().name).toBe("revokeSponsorship");
    expect(obj.type).toBe("revokeSignerSponsorship");

    if (obj.type !== "revokeSignerSponsorship")
      throw new Error("unexpected type");
    expect(obj.account).toBe(account);
    expect(obj.signer.ed25519PublicKey).toBe(signer.ed25519PublicKey);
  });

  it("creates a revokeSignerSponsorshipOp with a preAuthTx signer", () => {
    const signer = { preAuthTx: hash(Buffer.from("Tx hash")).toString("hex") };
    const op = Operation.revokeSignerSponsorship({ account, signer });
    const obj = Operation.fromXDRObject(
      xdr.Operation.fromXDR(op.toXDR("hex"), "hex"),
    );

    expect(obj.type).toBe("revokeSignerSponsorship");

    if (obj.type !== "revokeSignerSponsorship")
      throw new Error("unexpected type");
    expect(obj.account).toBe(account);
    expect(obj.signer.preAuthTx).toBe(signer.preAuthTx);
  });

  it("creates a revokeSignerSponsorshipOp with a sha256Hash signer", () => {
    const signer = {
      sha256Hash: hash(Buffer.from("Hash Preimage")).toString("hex"),
    };
    const op = Operation.revokeSignerSponsorship({ account, signer });
    const obj = Operation.fromXDRObject(
      xdr.Operation.fromXDR(op.toXDR("hex"), "hex"),
    );

    expect(obj.type).toBe("revokeSignerSponsorship");

    if (obj.type !== "revokeSignerSponsorship")
      throw new Error("unexpected type");
    expect(obj.account).toBe(account);
    expect(obj.signer.sha256Hash).toBe(signer.sha256Hash);
  });

  it("fails with an invalid account", () => {
    const signer = { ed25519PublicKey: source };
    expect(() =>
      // @ts-expect-error: intentionally omitting required field to test runtime validation
      Operation.revokeSignerSponsorship({ signer }),
    ).toThrow(/account is invalid/);
  });

  it("fails with an invalid ed25519PublicKey signer", () => {
    expect(() =>
      Operation.revokeSignerSponsorship({
        account,
        signer: { ed25519PublicKey: "GBAD" },
      }),
    ).toThrow(/signer\.ed25519PublicKey is invalid/);
  });

  it("fails with an unrecognized signer type", () => {
    expect(() =>
      Operation.revokeSignerSponsorship({
        account,
        signer: {},
      }),
    ).toThrow(/signer is invalid/);
  });
});
