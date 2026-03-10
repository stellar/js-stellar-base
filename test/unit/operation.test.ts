import { describe, it, expect } from "vitest";
import { Operation } from "../../src/operation.js";
import xdr from "../../src/xdr.js";

describe("Operation._checkUnsignedIntValue()", () => {
  it("returns correct values for valid inputs", () => {
    const cases: Array<{
      value: number | string | undefined;
      expected: number | undefined;
    }> = [
      { value: 0, expected: 0 },
      { value: 10, expected: 10 },
      { value: "0", expected: 0 },
      { value: "10", expected: 10 },
      { value: undefined, expected: undefined },
    ];

    for (const { value, expected } of cases) {
      expect(Operation._checkUnsignedIntValue("field", value)).toBe(expected);
    }
  });

  it("throws for invalid values", () => {
    const invalids: unknown[] = [
      {},
      [],
      "",
      "test",
      "0.5",
      "-10",
      "-10.5",
      "Infinity",
      Infinity,
      "Nan",
      NaN,
    ];

    for (const value of invalids) {
      expect(() =>
        Operation._checkUnsignedIntValue("field", value as number),
      ).toThrow();
    }
  });

  it("applies isValidFunction when provided", () => {
    const lessThan10 = (v: number) => v < 10;

    expect(
      Operation._checkUnsignedIntValue("field", undefined, lessThan10),
    ).toBe(undefined);

    expect(Operation._checkUnsignedIntValue("field", 8, lessThan10)).toBe(8);
    expect(Operation._checkUnsignedIntValue("field", "8", lessThan10)).toBe(8);

    expect(() =>
      Operation._checkUnsignedIntValue("field", 12, lessThan10),
    ).toThrow();
    expect(() =>
      Operation._checkUnsignedIntValue("field", "12", lessThan10),
    ).toThrow();
  });
});

describe("Operation.isValidAmount()", () => {
  it("returns true for valid amounts", () => {
    const valid = ["10", "0.10", "0.1234567", "922337203685.4775807"];
    for (const amount of valid) {
      expect(Operation.isValidAmount(amount)).toBe(true);
    }
  });

  it("returns false for invalid amounts", () => {
    const invalid: unknown[] = [
      100,
      100.5,
      "",
      "test",
      "0",
      "-10",
      "-10.5",
      "0.12345678",
      "922337203685.4775808",
      "Infinity",
      Infinity,
      "Nan",
      NaN,
    ];
    for (const amount of invalid) {
      expect(Operation.isValidAmount(amount as string)).toBe(false);
    }
  });

  it("allows 0 only when allowZero is true", () => {
    expect(Operation.isValidAmount("0")).toBe(false);
    expect(Operation.isValidAmount("0", true)).toBe(true);
  });
});

describe("Operation._fromXDRAmount()", () => {
  it("correctly parses XDR amounts", () => {
    expect(Operation._fromXDRAmount(xdr.Int64.fromString("1"))).toBe(
      "0.0000001",
    );
    expect(Operation._fromXDRAmount(xdr.Int64.fromString("10000000"))).toBe(
      "1.0000000",
    );
    expect(Operation._fromXDRAmount(xdr.Int64.fromString("10000000000"))).toBe(
      "1000.0000000",
    );
    expect(
      Operation._fromXDRAmount(xdr.Int64.fromString("1000000000000000000")),
    ).toBe("100000000000.0000000");
  });
});

describe("Operation._toXDRAmount()", () => {
  it("correctly converts string amounts to XDR Int64", () => {
    expect(Operation._toXDRAmount("0.0000001").toString()).toBe("1");
    expect(Operation._toXDRAmount("1.0000000").toString()).toBe("10000000");
    expect(Operation._toXDRAmount("1000.0000000").toString()).toBe(
      "10000000000",
    );
    expect(Operation._toXDRAmount("100000000000.0000000").toString()).toBe(
      "1000000000000000000",
    );
  });
});

describe("Operation._fromXDRPrice()", () => {
  it("converts an XDR Price to a decimal string", () => {
    expect(Operation._fromXDRPrice(new xdr.Price({ n: 1, d: 2 }))).toBe("0.5");
    expect(Operation._fromXDRPrice(new xdr.Price({ n: 11, d: 10 }))).toBe(
      "1.1",
    );
    expect(Operation._fromXDRPrice(new xdr.Price({ n: 1, d: 1 }))).toBe("1");
  });
});

describe("Operation._toXDRPrice()", () => {
  it("converts a string price to XDR", () => {
    const price = Operation._toXDRPrice("0.5");
    expect(price.n() / price.d()).toBeCloseTo(0.5);
  });

  it("converts a number price to XDR", () => {
    const price = Operation._toXDRPrice(1.5);
    expect(price.n() / price.d()).toBeCloseTo(1.5);
  });

  it("converts a {n, d} fraction to XDR", () => {
    const price = Operation._toXDRPrice({ n: 11, d: 10 });
    expect(price.n()).toBe(11);
    expect(price.d()).toBe(10);
  });

  it("throws for a negative price", () => {
    expect(() => Operation._toXDRPrice({ n: -1, d: 10 })).toThrow(
      /price must be positive/,
    );
    expect(() => Operation._toXDRPrice({ n: 1, d: -10 })).toThrow(
      /price must be positive/,
    );
  });
});
