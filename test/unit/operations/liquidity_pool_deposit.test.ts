import BigNumber from "bignumber.js";
import { describe, expect, it } from "vitest";
import { Operation } from "../../../src/operation.js";
import xdr from "../../../src/xdr.js";

describe("Operation.liquidityPoolDeposit()", () => {
  const liquidityPoolId =
    "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7";

  it("creates a liquidityPoolDeposit (string prices)", () => {
    const opts = {
      liquidityPoolId,
      maxAmountA: "10.0000000",
      maxAmountB: "20.0000000",
      minPrice: "0.45",
      maxPrice: "0.55",
    };
    const op = Operation.liquidityPoolDeposit(opts);
    const xdrHex = op.toXDR("hex");

    const xdrObj = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    expect(xdrObj.body().switch().name).toBe("liquidityPoolDeposit");
    expect(xdrObj.body().value().maxAmountA().toString()).toBe("100000000");
    expect(xdrObj.body().value().maxAmountB().toString()).toBe("200000000");

    const operation = Operation.fromXDRObject(xdrObj);
    expect(operation.type).toBe("liquidityPoolDeposit");
    expect(operation.liquidityPoolId).toBe(liquidityPoolId);
    expect(operation.maxAmountA).toBe("10.0000000");
    expect(operation.maxAmountB).toBe("20.0000000");
    expect(operation.minPrice).toBe("0.45");
    expect(operation.maxPrice).toBe("0.55");
  });

  it("creates a liquidityPoolDeposit (fraction prices)", () => {
    const opts = {
      liquidityPoolId,
      maxAmountA: "10.0000000",
      maxAmountB: "20.0000000",
      minPrice: { n: 9, d: 20 },
      maxPrice: { n: 11, d: 20 },
    };
    const op = Operation.liquidityPoolDeposit(opts);
    const xdrHex = op.toXDR("hex");

    const xdrObj = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    expect(xdrObj.body().switch().name).toBe("liquidityPoolDeposit");
    expect(xdrObj.body().value().maxAmountA().toString()).toBe("100000000");
    expect(xdrObj.body().value().maxAmountB().toString()).toBe("200000000");

    const operation = Operation.fromXDRObject(xdrObj);
    expect(operation.type).toBe("liquidityPoolDeposit");
    expect(operation.liquidityPoolId).toBe(liquidityPoolId);
    expect(operation.maxAmountA).toBe("10.0000000");
    expect(operation.maxAmountB).toBe("20.0000000");
    expect(operation.minPrice).toBe(new BigNumber(9).div(20).toString());
    expect(operation.maxPrice).toBe(new BigNumber(11).div(20).toString());
  });

  it("creates a liquidityPoolDeposit (number prices)", () => {
    const opts = {
      liquidityPoolId,
      maxAmountA: "10.0000000",
      maxAmountB: "20.0000000",
      minPrice: 0.45,
      maxPrice: 0.55,
    };
    const op = Operation.liquidityPoolDeposit(opts);
    const xdrHex = op.toXDR("hex");

    const xdrObj = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    expect(xdrObj.body().switch().name).toBe("liquidityPoolDeposit");
    expect(xdrObj.body().value().maxAmountA().toString()).toBe("100000000");
    expect(xdrObj.body().value().maxAmountB().toString()).toBe("200000000");

    const operation = Operation.fromXDRObject(xdrObj);
    expect(operation.type).toBe("liquidityPoolDeposit");
    expect(operation.liquidityPoolId).toBe(liquidityPoolId);
    expect(operation.maxAmountA).toBe("10.0000000");
    expect(operation.maxAmountB).toBe("20.0000000");
    expect(operation.minPrice).toBe("0.45");
    expect(operation.maxPrice).toBe("0.55");
  });

  it("creates a liquidityPoolDeposit (BigNumber prices)", () => {
    const opts = {
      liquidityPoolId,
      maxAmountA: "10.0000000",
      maxAmountB: "20.0000000",
      minPrice: new BigNumber(9).dividedBy(20),
      maxPrice: new BigNumber(11).dividedBy(20),
    };
    const op = Operation.liquidityPoolDeposit(opts);
    const xdrHex = op.toXDR("hex");

    const xdrObj = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    expect(xdrObj.body().switch().name).toBe("liquidityPoolDeposit");
    expect(xdrObj.body().value().maxAmountA().toString()).toBe("100000000");
    expect(xdrObj.body().value().maxAmountB().toString()).toBe("200000000");

    const operation = Operation.fromXDRObject(xdrObj);
    expect(operation.type).toBe("liquidityPoolDeposit");
    expect(operation.liquidityPoolId).toBe(liquidityPoolId);
    expect(operation.maxAmountA).toBe("10.0000000");
    expect(operation.maxAmountB).toBe("20.0000000");
    expect(operation.minPrice).toBe("0.45");
    expect(operation.maxPrice).toBe("0.55");
  });

  it("creates a liquidityPoolDeposit with source account", () => {
    const source = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
    const opts = {
      liquidityPoolId,
      maxAmountA: "10.0000000",
      maxAmountB: "20.0000000",
      minPrice: "0.45",
      maxPrice: "0.55",
      source,
    };
    const op = Operation.liquidityPoolDeposit(opts);
    const xdrHex = op.toXDR("hex");
    const xdrObj = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const operation = Operation.fromXDRObject(xdrObj);
    expect(operation.type).toBe("liquidityPoolDeposit");
    expect(operation.source).toBe(source);
  });

  describe("fails to create liquidityPoolDeposit operation", () => {
    it("throws when liquidityPoolId is missing", () => {
      expect(() =>
        Operation.liquidityPoolDeposit({
          liquidityPoolId: "",
          maxAmountA: "10",
          maxAmountB: "20",
          minPrice: "0.45",
          maxPrice: "0.55",
        }),
      ).toThrow(/liquidityPoolId argument is required/);
    });

    it("throws when maxAmountA is invalid", () => {
      expect(() =>
        Operation.liquidityPoolDeposit({
          liquidityPoolId,
          maxAmountA: 10 as unknown as string,
          maxAmountB: "20",
          minPrice: "0.45",
          maxPrice: "0.55",
        }),
      ).toThrow(
        /maxAmountA argument must be of type String, represent a positive number and have at most 7 digits after the decimal/,
      );
    });

    it("throws when maxAmountB is invalid", () => {
      expect(() =>
        Operation.liquidityPoolDeposit({
          liquidityPoolId,
          maxAmountA: "10",
          maxAmountB: 20 as unknown as string,
          minPrice: "0.45",
          maxPrice: "0.55",
        }),
      ).toThrow(
        /maxAmountB argument must be of type String, represent a positive number and have at most 7 digits after the decimal/,
      );
    });

    it("throws when minPrice is missing", () => {
      expect(() =>
        Operation.liquidityPoolDeposit({
          liquidityPoolId,
          maxAmountA: "10",
          maxAmountB: "20",
          minPrice: undefined as unknown as string,
          maxPrice: "0.55",
        }),
      ).toThrow(/minPrice argument is required/);
    });

    it("throws when maxPrice is missing", () => {
      expect(() =>
        Operation.liquidityPoolDeposit({
          liquidityPoolId,
          maxAmountA: "10",
          maxAmountB: "20",
          minPrice: "0.45",
          maxPrice: undefined as unknown as string,
        }),
      ).toThrow(/maxPrice argument is required/);
    });

    it("throws when prices are negative", () => {
      expect(() =>
        Operation.liquidityPoolDeposit({
          liquidityPoolId,
          maxAmountA: "10.0000000",
          maxAmountB: "20.0000000",
          minPrice: "-0.45",
          maxPrice: "0.55",
        }),
      ).toThrow(/price must be positive/);
    });

    it("throws with incrementally added parameters", () => {
      expect(() =>
        Operation.liquidityPoolDeposit({
          liquidityPoolId: "",
          maxAmountA: "10",
          maxAmountB: "20",
          minPrice: "0.45",
          maxPrice: "0.55",
        }),
      ).toThrow(/liquidityPoolId argument is required/);

      expect(() =>
        Operation.liquidityPoolDeposit({
          liquidityPoolId,
          maxAmountA: "" as string,
          maxAmountB: "20",
          minPrice: "0.45",
          maxPrice: "0.55",
        }),
      ).toThrow(/maxAmountA argument must be of type String/);

      expect(() =>
        Operation.liquidityPoolDeposit({
          liquidityPoolId,
          maxAmountA: "10",
          maxAmountB: "" as string,
          minPrice: "0.45",
          maxPrice: "0.55",
        }),
      ).toThrow(/maxAmountB argument must be of type String/);
    });
  });

  it("fails to create operation with an invalid source address", () => {
    expect(() =>
      Operation.liquidityPoolDeposit({
        liquidityPoolId,
        maxAmountA: "10",
        maxAmountB: "20",
        minPrice: "0.45",
        maxPrice: "0.55",
        source: "GCEZ",
      }),
    ).toThrow(/Source address is invalid/);
  });

  it("roundtrips through XDR hex encoding", () => {
    const op = Operation.liquidityPoolDeposit({
      liquidityPoolId,
      maxAmountA: "10.0000000",
      maxAmountB: "20.0000000",
      minPrice: "0.45",
      maxPrice: "0.55",
    });
    const hex = op.toXDR("hex");
    const roundtripped = xdr.Operation.fromXDR(hex, "hex");
    expect(roundtripped.body().switch().name).toBe("liquidityPoolDeposit");
  });
});
