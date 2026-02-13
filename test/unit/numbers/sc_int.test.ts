import { describe, it, expect } from "vitest";
import { ScInt } from "../../../src/numbers/sc_int.js";

describe("ScInt", () => {
  describe("constructor - input type conversion", () => {
    describe("bigint inputs", () => {
      it("accepts positive bigints", () => {
        const sci = new ScInt(42n);
        expect(sci.toBigInt()).toBe(42n);
      });

      it("accepts negative bigints", () => {
        const sci = new ScInt(-42n);
        expect(sci.toBigInt()).toBe(-42n);
      });

      it("accepts zero as bigint", () => {
        const sci = new ScInt(0n);
        expect(sci.toBigInt()).toBe(0n);
      });

      it("accepts large bigints", () => {
        const large = 1n << 200n;
        const sci = new ScInt(large);
        expect(sci.toBigInt()).toBe(large);
      });
    });

    describe("number inputs", () => {
      it("accepts positive integers", () => {
        const sci = new ScInt(42);
        expect(sci.toBigInt()).toBe(42n);
      });

      it("accepts negative integers", () => {
        const sci = new ScInt(-42);
        expect(sci.toBigInt()).toBe(-42n);
      });

      it("accepts zero", () => {
        const sci = new ScInt(0);
        expect(sci.toBigInt()).toBe(0n);
      });

      it("accepts hex literals", () => {
        const sci = new ScInt(0xdeadbeef);
        // 0xdeadbeef in decimal is 3735928559
        expect(sci.toBigInt()).toBe(3735928559n);
      });

      it("throws on decimal numbers", () => {
        expect(() => new ScInt(3.14)).toThrow();
      });

      it("throws on Infinity", () => {
        expect(() => new ScInt(Infinity)).toThrow();
      });

      it("throws on NaN", () => {
        expect(() => new ScInt(NaN)).toThrow();
      });
    });

    describe("string inputs", () => {
      it("accepts numeric strings", () => {
        const sci = new ScInt("123456789");
        expect(sci.toBigInt()).toBe(123456789n);
      });

      it("accepts negative numeric strings", () => {
        const sci = new ScInt("-123456789");
        expect(sci.toBigInt()).toBe(-123456789n);
      });

      it("accepts zero string", () => {
        const sci = new ScInt("0");
        expect(sci.toBigInt()).toBe(0n);
      });

      it("accepts numeric strings up to safe conversion range", () => {
        // Large strings may overflow; testing with 16-digit string
        const largeStr = "9999999999999999";
        const sci = new ScInt(largeStr);
        expect(sci.toBigInt()).toBe(BigInt(largeStr));
      });

      it("throws on non-numeric strings", () => {
        expect(() => new ScInt("hello")).toThrow(SyntaxError);
      });

      it("throws on decimal strings", () => {
        expect(() => new ScInt("3.14")).toThrow(SyntaxError);
      });

      it("handles empty string", () => {
        // Empty string is treated as zero or doesn't throw
        const sci = new ScInt("");
        expect(sci.toBigInt()).toBe(0n);
      });
    });
  });

  describe("type auto-selection", () => {
    it("selects u64 for small positive numbers", () => {
      const sci = new ScInt(100n);
      expect(sci.type).toBe("u64");
    });

    it("selects i64 for small negative numbers", () => {
      const sci = new ScInt(-100n);
      expect(sci.type).toBe("i64");
    });

    it("selects u64 for numbers up to u64 max", () => {
      const max = (1n << 64n) - 1n;
      const sci = new ScInt(max);
      expect(sci.type).toBe("u64");
    });

    it("selects u128 for numbers between u64 and u128 max", () => {
      const val = 1n << 64n;
      const sci = new ScInt(val);
      expect(sci.type).toBe("u128");
    });

    it("selects u128 for numbers up to u128 max", () => {
      const max = (1n << 128n) - 1n;
      const sci = new ScInt(max);
      expect(sci.type).toBe("u128");
    });

    it("selects u256 for numbers between u128 and u256 max", () => {
      const val = 1n << 128n;
      const sci = new ScInt(val);
      expect(sci.type).toBe("u256");
    });

    it("selects u256 for numbers up to u256 max", () => {
      const max = (1n << 256n) - 1n;
      const sci = new ScInt(max);
      expect(sci.type).toBe("u256");
    });

    it("throws for numbers exceeding u256 max", () => {
      const tooLarge = 1n << 256n;
      expect(() => new ScInt(tooLarge)).toThrow(RangeError);
    });

    it("selects i64 for negative numbers in i64 range", () => {
      const sci = new ScInt(-(1n << 63n) + 1n);
      expect(sci.type).toBe("i64");
    });

    it("selects i128 for negative numbers beyond i64 range", () => {
      const val = -(1n << 64n);
      const sci = new ScInt(val);
      expect(sci.type).toBe("i128");
    });

    it("selects i256 for large negative numbers", () => {
      const val = -(1n << 200n);
      const sci = new ScInt(val);
      expect(sci.type).toBe("i256");
    });
  });

  describe("opts.type parameter", () => {
    it("forces u64 type", () => {
      const sci = new ScInt(42n, { type: "u64" });
      expect(sci.type).toBe("u64");
    });

    it("forces i64 type", () => {
      const sci = new ScInt(42n, { type: "i64" });
      expect(sci.type).toBe("i64");
    });

    it("forces u128 type", () => {
      const sci = new ScInt(42n, { type: "u128" });
      expect(sci.type).toBe("u128");
    });

    it("forces i128 type", () => {
      const sci = new ScInt(42n, { type: "i128" });
      expect(sci.type).toBe("i128");
    });

    it("forces u256 type", () => {
      const sci = new ScInt(42n, { type: "u256" });
      expect(sci.type).toBe("u256");
    });

    it("forces i256 type", () => {
      const sci = new ScInt(42n, { type: "i256" });
      expect(sci.type).toBe("i256");
    });

    it("preserves the original value with forced type", () => {
      const sci = new ScInt(12345n, { type: "u256" });
      expect(sci.toBigInt()).toBe(12345n);
    });

    it("allows extra properties in opts", () => {
      const sci = new ScInt(42n, { type: "u64", extraProp: "value" });
      expect(sci.toBigInt()).toBe(42n);
    });
  });

  describe("signedness validation", () => {
    it("throws when negative value with unsigned type u64", () => {
      expect(() => new ScInt(-1n, { type: "u64" })).toThrow(TypeError);
    });

    it("throws when negative value with unsigned type u128", () => {
      expect(() => new ScInt(-1n, { type: "u128" })).toThrow(TypeError);
    });

    it("throws when negative value with unsigned type u256", () => {
      expect(() => new ScInt(-1n, { type: "u256" })).toThrow(TypeError);
    });

    it("error message includes the specified type", () => {
      try {
        new ScInt(-42n, { type: "u64" });
        expect.fail("should have thrown");
      } catch (e) {
        if (e instanceof TypeError) {
          expect(e.message).toContain("u64");
        } else {
          throw e;
        }
      }
    });

    it("error message includes the negative value", () => {
      try {
        new ScInt(-42n, { type: "u128" });
        expect.fail("should have thrown");
      } catch (e) {
        if (e instanceof TypeError) {
          expect(e.message).toContain("-42");
        } else {
          throw e;
        }
      }
    });

    it("allows negative values with signed types", () => {
      const i64 = new ScInt(-42n, { type: "i64" });
      expect(i64.toBigInt()).toBe(-42n);

      const i128 = new ScInt(-42n, { type: "i128" });
      expect(i128.toBigInt()).toBe(-42n);

      const i256 = new ScInt(-42n, { type: "i256" });
      expect(i256.toBigInt()).toBe(-42n);
    });

    it("allows positive values with signed types", () => {
      const sci = new ScInt(42n, { type: "i64" });
      expect(sci.toBigInt()).toBe(42n);
    });
  });

  describe("edge cases", () => {
    it("handles zero with any type", () => {
      const types = ["u64", "i64", "u128", "i128", "u256", "i256"] as const;
      types.forEach((type) => {
        const sci = new ScInt(0n, { type });
        expect(sci.toBigInt()).toBe(0n);
      });
    });

    it("handles max u64 value", () => {
      const max = (1n << 64n) - 1n;
      const sci = new ScInt(max, { type: "u64" });
      expect(sci.toBigInt()).toBe(max);
    });

    it("handles min i64 value", () => {
      const min = -(1n << 63n);
      const sci = new ScInt(min, { type: "i64" });
      expect(sci.toBigInt()).toBe(min);
    });

    it("handles max i64 value", () => {
      const max = (1n << 63n) - 1n;
      const sci = new ScInt(max, { type: "i64" });
      expect(sci.toBigInt()).toBe(max);
    });

    it("wraps oversized values for specified type (overflow to zero)", () => {
      const tooLarge = 1n << 64n;
      const sci = new ScInt(tooLarge, { type: "u64" });
      // Value overflows and wraps to 0 when type is u64
      expect(sci.toBigInt()).toBe(0n);
    });

    it("converts string negative to bigint correctly", () => {
      const sci = new ScInt("-999999999999999999");
      expect(sci.toBigInt()).toBe(-999999999999999999n);
      expect(sci.type).toMatch(/^i/);
    });
  });

  describe("optional opts parameter", () => {
    it("works without opts parameter", () => {
      const sci = new ScInt(42n);
      expect(sci.toBigInt()).toBe(42n);
    });

    it("works with undefined opts", () => {
      const sci = new ScInt(42n, undefined);
      expect(sci.toBigInt()).toBe(42n);
    });

    it("works with empty opts object", () => {
      const sci = new ScInt(42n, {});
      expect(sci.toBigInt()).toBe(42n);
    });
  });

  describe("integration with parent class", () => {
    it("returns a valid ScInt instance", () => {
      const sci = new ScInt(42n);
      expect(sci).toBeInstanceOf(ScInt);
    });

    it("has type property from parent", () => {
      const sci = new ScInt(42n);
      expect(sci).toHaveProperty("type");
    });

    it("has toBigInt method from parent", () => {
      const sci = new ScInt(42n);
      expect(typeof sci.toBigInt).toBe("function");
    });
  });
});
