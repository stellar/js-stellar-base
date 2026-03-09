import { describe, it, expect } from "vitest";
import { Operation } from "../../../src/operation.js";
import xdr from "../../../src/xdr.js";

const balanceId =
  "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be";

describe("Operation.clawbackClaimableBalance()", () => {
  it("creates a clawbackClaimableBalanceOp", () => {
    const op = Operation.clawbackClaimableBalance({ balanceId });
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(xdrHex, "hex");
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("clawbackClaimableBalance");
    if (obj.type !== "clawbackClaimableBalance")
      throw new Error("unexpected type");
    expect(obj.balanceId).toBe(balanceId);
  });

  it("throws when balanceId is not present", () => {
    expect(() =>
      // @ts-expect-error: intentionally omitting required field to test runtime validation
      Operation.clawbackClaimableBalance({}),
    ).toThrow(/must provide a valid claimable balance id/);
  });

  it("throws for an invalid balanceId", () => {
    expect(() =>
      Operation.clawbackClaimableBalance({ balanceId: "badc0ffee" }),
    ).toThrow(/must provide a valid claimable balance id/);
  });

  it("preserves an optional source account", () => {
    const source =
      "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
    const op = Operation.clawbackClaimableBalance({ balanceId, source });
    const obj = Operation.fromXDRObject(
      xdr.Operation.fromXDR(op.toXDR("hex"), "hex"),
    );
    if (obj.type !== "clawbackClaimableBalance")
      throw new Error("unexpected type");
    expect(obj.source).toBe(source);
  });
});
