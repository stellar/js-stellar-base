/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

// TODO: clean up (keep only relevant tests in this file)

import { describe, it, expect } from "vitest";
import {
  scValToBigInt,
  XdrLargeInt,
  nativeToScVal,
} from "../../../src/index.js";

// ========================================
// Tests migrated from scval_test.js
// Ensuring no test coverage is lost during JS to TS migration
// ========================================

describe("parsing and building ScVals - from scval_test.js", () => {
  it("lets strings be large integer ScVals", () => {
    ["i64", "i128", "i256", "u64", "u128", "u256"].forEach((type) => {
      const scv = nativeToScVal("12345", { type });
      expect(XdrLargeInt.getType(scv.switch().name)).toBe(type);
      expect(scValToBigInt(scv)).toBe(BigInt(12345));
    });

    expect(() => nativeToScVal("not a number", { type: "i128" })).toThrow();
    expect(() => nativeToScVal("12345", { type: "notnumeric" })).toThrow();
  });
});
