import { describe, it, expect } from "vitest";
import { Operation } from "../../../src/operation.js";
import { Asset } from "../../../src/asset.js";
import { Claimant } from "../../../src/claimant.js";
import xdr from "../../../src/xdr.js";

const asset = new Asset(
  "USD",
  "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7",
);
const amount = "100.0000000";
const claimants = [
  new Claimant("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ"),
];

describe("Operation.createClaimableBalance()", () => {
  it("creates a createClaimableBalanceOp", () => {
    const op = Operation.createClaimableBalance({ asset, amount, claimants });
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(xdrHex, "hex");
    const obj = Operation.fromXDRObject(operation);

    expect(obj.type).toBe("createClaimableBalance");

    if (obj.type !== "createClaimableBalance")
      throw new Error("unexpected type");

    expect(obj.asset.toString()).toBe(asset.toString());
    expect(obj.amount).toBe(amount);
    expect(obj.claimants).toHaveLength(1);

    const firstClaimant = obj.claimants[0];
    if (firstClaimant === undefined) throw new Error("missing claimant");

    const expectedClaimant = claimants[0];
    if (expectedClaimant === undefined)
      throw new Error("missing fixture claimant");

    expect(firstClaimant.toXDRObject().toXDR("hex")).toBe(
      expectedClaimant.toXDRObject().toXDR("hex"),
    );
  });

  it("throws when asset is not provided", () => {
    expect(() =>
      // @ts-expect-error: intentionally omitting required field to test runtime validation
      Operation.createClaimableBalance({ amount, claimants }),
    ).toThrow(/must provide an asset for create claimable balance operation/);
  });

  it("throws when amount is not provided", () => {
    expect(() =>
      // @ts-expect-error: intentionally omitting required field to test runtime validation
      Operation.createClaimableBalance({ asset, claimants }),
    ).toThrow(
      /amount argument must be of type String, represent a positive number and have at most 7 digits after the decimal/,
    );
  });

  it("throws when claimants is not provided", () => {
    expect(() =>
      // @ts-expect-error: intentionally omitting required field to test runtime validation
      Operation.createClaimableBalance({ asset, amount }),
    ).toThrow(/must provide at least one claimant/);
  });

  it("throws when claimants is an empty array", () => {
    expect(() =>
      Operation.createClaimableBalance({ asset, amount, claimants: [] }),
    ).toThrow(/must provide at least one claimant/);
  });

  it("preserves an optional source account", () => {
    const source = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
    const op = Operation.createClaimableBalance({
      asset,
      amount,
      claimants,
      source,
    });

    const obj = Operation.fromXDRObject(
      xdr.Operation.fromXDR(op.toXDR("hex"), "hex"),
    );

    if (obj.type !== "createClaimableBalance")
      throw new Error("unexpected type");

    expect(obj.source).toBe(source);
  });
});
