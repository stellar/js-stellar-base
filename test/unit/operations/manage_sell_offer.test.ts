import BigNumber from "bignumber.js";
import { describe, expect, it } from "vitest";
import { Asset } from "../../../src/asset.js";
import { Operation } from "../../../src/operation.js";
import xdr from "../../../src/xdr.js";

describe("Operation.manageSellOffer()", () => {
  const selling = new Asset(
    "USD",
    "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7",
  );
  const buying = new Asset(
    "USD",
    "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7",
  );

  it("creates a manageSellOfferOp (string price)", () => {
    const opts = {
      selling,
      buying,
      amount: "3.1234560",
      price: "8.141592",
      offerId: "1",
    };
    const op = Operation.manageSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("manageSellOffer");
    expect(obj.selling.equals(selling)).toBe(true);
    expect(obj.buying.equals(buying)).toBe(true);
    expect(operation.body().value().amount().toString()).toBe("31234560");
    expect(obj.amount).toBe("3.1234560");
    expect(obj.price).toBe("8.141592");
    expect(obj.offerId).toBe("1");
  });

  it("creates a manageSellOfferOp (price fraction)", () => {
    const opts = {
      selling,
      buying,
      amount: "3.123456",
      price: { n: 11, d: 10 },
      offerId: "1",
    };
    const op = Operation.manageSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.price).toBe(new BigNumber(11).div(10).toString());
  });

  it("throws with an invalid price fraction (negative d)", () => {
    expect(() =>
      Operation.manageSellOffer({
        selling,
        buying,
        amount: "3.123456",
        price: { n: 11, d: -1 },
        offerId: "1",
      }),
    ).toThrow(/price must be positive/);
  });

  it("creates a manageSellOfferOp (number price)", () => {
    const opts = {
      selling,
      buying,
      amount: "3.123456",
      price: 3.07,
      offerId: "1",
    };
    const op = Operation.manageSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("manageSellOffer");
    expect(obj.price).toBe("3.07");
  });

  it("creates a manageSellOfferOp (BigNumber price)", () => {
    const opts = {
      selling,
      buying,
      amount: "3.123456",
      price: new BigNumber(5).dividedBy(4),
      offerId: "1",
    };
    const op = Operation.manageSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("manageSellOffer");
    expect(obj.price).toBe("1.25");
  });

  it("creates a manageSellOfferOp with no offerId (defaults to 0)", () => {
    const opts = {
      selling,
      buying,
      amount: "1000.0000000",
      price: "3.141592",
    };
    const op = Operation.manageSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("manageSellOffer");
    expect(obj.selling.equals(selling)).toBe(true);
    expect(obj.buying.equals(buying)).toBe(true);
    expect(operation.body().value().amount().toString()).toBe("10000000000");
    expect(obj.amount).toBe("1000.0000000");
    expect(obj.price).toBe("3.141592");
    expect(obj.offerId).toBe("0");
  });

  it("cancels offer (amount 0 with offerId)", () => {
    const opts = {
      selling,
      buying,
      amount: "0.0000000",
      price: "3.141592",
      offerId: "1",
    };
    const op = Operation.manageSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("manageSellOffer");
    expect(obj.selling.equals(selling)).toBe(true);
    expect(obj.buying.equals(buying)).toBe(true);
    expect(operation.body().value().amount().toString()).toBe("0");
    expect(obj.amount).toBe("0.0000000");
    expect(obj.price).toBe("3.141592");
    expect(obj.offerId).toBe("1");
  });

  it("creates a manageSellOfferOp with numeric offerId", () => {
    const opts = {
      selling,
      buying,
      amount: "5.0000000",
      price: "2.0",
      offerId: 42,
    };
    const op = Operation.manageSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.offerId).toBe("42");
  });

  it("creates a manageSellOfferOp with source account", () => {
    const source = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
    const opts = {
      selling,
      buying,
      amount: "5.0000000",
      price: "2.0",
      source,
    };
    const op = Operation.manageSellOffer(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("manageSellOffer");
    expect(obj.source).toBe(source);
  });

  describe("fails to create manageSellOffer operation", () => {
    it("throws with an invalid amount", () => {
      expect(() =>
        Operation.manageSellOffer({
          amount: 20 as unknown as string,
          price: "10",
          selling,
          buying,
        }),
      ).toThrow(/amount argument must be of type String/);
    });

    it("throws with missing price", () => {
      expect(() =>
        Operation.manageSellOffer({
          amount: "20",
          price: undefined as unknown as string,
          selling,
          buying,
        }),
      ).toThrow(/price argument is required/);
    });

    it("throws with negative price", () => {
      expect(() =>
        Operation.manageSellOffer({
          amount: "20",
          price: "-1",
          selling,
          buying,
        }),
      ).toThrow(/price must be positive/);
    });

    it("throws with invalid price string", () => {
      expect(() =>
        Operation.manageSellOffer({
          amount: "20",
          price: "test",
          selling,
          buying,
        }),
      ).toThrow(/not a number/i);
    });
  });

  it("fails to create operation with an invalid source address", () => {
    expect(() =>
      Operation.manageSellOffer({
        amount: "20",
        price: "10",
        selling,
        buying,
        source: "GCEZ",
      }),
    ).toThrow(/Source address is invalid/);
  });

  it("roundtrips through XDR hex encoding", () => {
    const op = Operation.manageSellOffer({
      selling,
      buying,
      amount: "5.0000000",
      price: "1.5",
      offerId: "1",
    });
    const hex = op.toXDR("hex");
    const roundtripped = xdr.Operation.fromXDR(hex, "hex");
    expect(roundtripped.body().switch().name).toBe("manageSellOffer");
  });
});
