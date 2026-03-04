import BigNumber from "bignumber.js";
import { describe, expect, it } from "vitest";
import { Asset } from "../../../src/asset.js";
import { Operation } from "../../../src/operation.js";
import xdr from "../../../src/xdr.js";

describe("Operation.createPassiveSellOffer()", () => {
  const selling = new Asset(
    "USD",
    "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7",
  );
  const buying = new Asset(
    "USD",
    "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7",
  );

  it("creates a createPassiveSellOfferOp (string price)", () => {
    const opts = { selling, buying, amount: "11.2782700", price: "3.07" };
    const op = Operation.createPassiveSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("createPassiveSellOffer");
    expect(obj.selling.equals(selling)).toBe(true);
    expect(obj.buying.equals(buying)).toBe(true);
    expect(operation.body().value().amount().toString()).toBe("112782700");
    expect(obj.amount).toBe("11.2782700");
    expect(obj.price).toBe("3.07");
  });

  it("creates a createPassiveSellOfferOp (number price)", () => {
    const opts = { selling, buying, amount: "11.2782700", price: 3.07 };
    const op = Operation.createPassiveSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("createPassiveSellOffer");
    expect(obj.selling.equals(selling)).toBe(true);
    expect(obj.buying.equals(buying)).toBe(true);
    expect(operation.body().value().amount().toString()).toBe("112782700");
    expect(obj.amount).toBe("11.2782700");
    expect(obj.price).toBe("3.07");
  });

  it("creates a createPassiveSellOfferOp (BigNumber price)", () => {
    const opts = {
      selling,
      buying,
      amount: "11.2782700",
      price: new BigNumber(5).dividedBy(4),
    };
    const op = Operation.createPassiveSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("createPassiveSellOffer");
    expect(obj.selling.equals(selling)).toBe(true);
    expect(obj.buying.equals(buying)).toBe(true);
    expect(operation.body().value().amount().toString()).toBe("112782700");
    expect(obj.amount).toBe("11.2782700");
    expect(obj.price).toBe("1.25");
  });

  it("creates a createPassiveSellOfferOp (price fraction)", () => {
    const opts = {
      selling,
      buying,
      amount: "11.2782700",
      price: { n: 11, d: 10 },
    };
    const op = Operation.createPassiveSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.price).toBe(new BigNumber(11).div(10).toString());
  });

  it("creates a createPassiveSellOfferOp with source account", () => {
    const source = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
    const opts = {
      selling,
      buying,
      amount: "11.2782700",
      price: "3.07",
      source,
    };
    const op = Operation.createPassiveSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("createPassiveSellOffer");
    expect(obj.source).toBe(source);
  });

  describe("fails to create createPassiveSellOffer operation", () => {
    it("throws with an invalid amount", () => {
      expect(() =>
        Operation.createPassiveSellOffer({
          amount: 20 as unknown as string,
          price: "10",
          selling,
          buying,
        }),
      ).toThrow(/amount argument must be of type String/);
    });

    it("throws with missing price", () => {
      expect(() =>
        Operation.createPassiveSellOffer({
          amount: "20",
          price: undefined as unknown as string,
          selling,
          buying,
        }),
      ).toThrow(/price argument is required/);
    });

    it("throws with negative price", () => {
      expect(() =>
        Operation.createPassiveSellOffer({
          amount: "20",
          price: "-2",
          selling,
          buying,
        }),
      ).toThrow(/price must be positive/);
    });

    it("throws with invalid price fraction", () => {
      expect(() =>
        Operation.createPassiveSellOffer({
          amount: "20",
          price: { n: 11, d: -1 },
          selling,
          buying,
        }),
      ).toThrow(/price must be positive/);
    });
  });

  it("fails to create operation with an invalid source address", () => {
    expect(() =>
      Operation.createPassiveSellOffer({
        amount: "20",
        price: "10",
        selling,
        buying,
        source: "GCEZ",
      }),
    ).toThrow(/Source address is invalid/);
  });

  it("roundtrips through XDR hex encoding", () => {
    const op = Operation.createPassiveSellOffer({
      selling,
      buying,
      amount: "5.0000000",
      price: "1.5",
    });
    const hex = op.toXDR("hex");
    const roundtripped = xdr.Operation.fromXDR(hex, "hex");
    expect(roundtripped.body().switch().name).toBe("createPassiveSellOffer");
  });
});
