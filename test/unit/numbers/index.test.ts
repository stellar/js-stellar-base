/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

// TODO: clean up (keep only relevant tests in this file)

import { describe, it, expect } from "vitest";
import {
  scValToBigInt,
  ScInt,
  Address,
  Keypair,
  XdrLargeInt,
  scValToNative,
  nativeToScVal,
} from "../../../src/index.js";
import xdr from "../../../src/xdr.js";

// ========================================
// Tests migrated from scval_test.js
// Ensuring no test coverage is lost during JS to TS migration
// ========================================

describe("parsing and building ScVals - from scval_test.js", () => {
  const gigaMap = {
    bool: true,
    void: null,
    u32: xdr.ScVal.scvU32(1),
    i32: xdr.ScVal.scvI32(1),
    u64: 1n,
    i64: -1n,
    timepoint: new ScInt(1443571200n).toTimepoint(),
    duration: new ScInt(1000n).toDuration(),
    u128: new ScInt(1).toU128(),
    i128: new ScInt(1).toI128(),
    u256: new ScInt(1).toU256(),
    i256: new ScInt(1).toI256(),
    map: {
      arbitrary: 1n,
      nested: "values",
      etc: false,
    },
    vec: ["same", "type", "list"],
  };

  const targetScv = xdr.ScVal.scvMap(
    (
      [
        ["bool", xdr.ScVal.scvBool(true)],
        ["duration", new ScInt(1000n, { type: "duration" }).toScVal()],
        ["i128", new ScInt(1, { type: "i128" }).toScVal()],
        ["i256", new ScInt(1, { type: "i256" }).toScVal()],
        ["i32", xdr.ScVal.scvI32(1)],
        ["i64", xdr.ScVal.scvI64(new xdr.Int64(-1))],
        [
          "map",
          xdr.ScVal.scvMap([
            new xdr.ScMapEntry({
              key: xdr.ScVal.scvString("arbitrary"),
              val: xdr.ScVal.scvU64(new xdr.Uint64(1)),
            }),
            new xdr.ScMapEntry({
              key: xdr.ScVal.scvString("etc"),
              val: xdr.ScVal.scvBool(false),
            }),
            new xdr.ScMapEntry({
              key: xdr.ScVal.scvString("nested"),
              val: xdr.ScVal.scvString("values"),
            }),
          ]),
        ],
        ["timepoint", new ScInt(1443571200n, { type: "timepoint" }).toScVal()],
        ["u128", new ScInt(1, { type: "u128" }).toScVal()],
        ["u256", new ScInt(1, { type: "u256" }).toScVal()],
        ["u32", xdr.ScVal.scvU32(1)],
        ["u64", xdr.ScVal.scvU64(new xdr.Uint64(1))],
        [
          "vec",
          // eslint-disable-next-line @typescript-eslint/unbound-method
          xdr.ScVal.scvVec(["same", "type", "list"].map(xdr.ScVal.scvString)),
        ],
        ["void", xdr.ScVal.scvVoid()],
      ] as const
    ).map(([type, scv]) => {
      return new xdr.ScMapEntry({
        key: xdr.ScVal.scvString(type),
        val: scv,
      });
    }),
  );

  it("builds an ScVal from all intended native types", () => {
    const scv = nativeToScVal(gigaMap);

    // test case expectation sanity check
    expect((targetScv.value() as any[]).length).toBe(
      Object.keys(gigaMap).length,
    );
    expect(scv.switch().name).toBe("scvMap");
    expect((scv.value() as any[]).length).toBe(
      (targetScv.value() as any[]).length,
    );

    // iterate for granular errors on failures
    (targetScv.value() as any[]).forEach((entry: any, idx: number) => {
      const actual = (scv.value() as any[])[idx];
      expect(actual).toEqual(entry);
    });

    expect(scv.toXDR("base64")).toEqual(targetScv.toXDR("base64"));
  });

  it("converts ScVal to intended native types", () => {
    const kp = Keypair.random();
    const inputVec = ["Hello", "there.", "General", "Kenobi!"];

    (
      [
        [xdr.ScVal.scvVoid(), null],
        [xdr.ScVal.scvBool(true), true],
        [xdr.ScVal.scvBool(false), false],
        [xdr.ScVal.scvU32(1), 1],
        [xdr.ScVal.scvI32(1), 1],
        [new ScInt(11).toU64(), 11n],
        [new ScInt(11).toI64(), 11n],
        [new ScInt(22).toU128(), 22n],
        [new ScInt(22).toI128(), 22n],
        [new ScInt(33).toU256(), 33n],
        [new ScInt(33).toI256(), 33n],
        [xdr.ScVal.scvTimepoint(new xdr.Uint64(44n)), 44n],
        [xdr.ScVal.scvDuration(new xdr.Uint64(55n)), 55n],
        [
          xdr.ScVal.scvBytes(Buffer.alloc(32, 123)),
          Buffer.from("{".repeat(32)),
        ],
        [
          xdr.ScVal.scvBytes(Buffer.alloc(32, 123)),
          (actual: any) => actual instanceof Uint8Array && actual[0] === 123,
        ],
        [xdr.ScVal.scvString("hello there!"), "hello there!"],
        [xdr.ScVal.scvSymbol("hello"), "hello"],
        [xdr.ScVal.scvString(Buffer.from("hello")), "hello"],
        [xdr.ScVal.scvSymbol(Buffer.from("hello")), "hello"],
        [
          new Address(kp.publicKey()).toScVal(),
          (actual: any) => actual.toString() === kp.publicKey(),
        ],
        [
          xdr.ScVal.scvVec(inputVec.map((s) => xdr.ScVal.scvString(s))),
          inputVec,
        ],
        [
          xdr.ScVal.scvMap(
            [
              [new ScInt(0).toI256(), xdr.ScVal.scvBool(true)],
              [xdr.ScVal.scvBool(false), xdr.ScVal.scvString("second")],
              [
                xdr.ScVal.scvU32(2),
                // eslint-disable-next-line @typescript-eslint/unbound-method
                xdr.ScVal.scvVec(inputVec.map(xdr.ScVal.scvString)),
              ],
            ].map(([key, val]: any) => new xdr.ScMapEntry({ key, val })),
          ),
          {
            0: true,
            false: "second",
            2: inputVec,
          },
        ],
      ] as const
    ).forEach(([scv, expected]) => {
      expect(() => scv.toXDR()).not.toThrow();

      const actual = scValToNative(scv);

      if (typeof expected === "function") {
        expect(expected(actual)).toBe(true);
      } else {
        expect(actual).toEqual(expected);
      }
    });
  });

  it("converts native types with customized types", () => {
    (
      [
        [1, "u32", "scvU32"],
        [1, "i32", "scvI32"],
        [1, "i64", "scvI64"],
        [1, "i128", "scvI128"],
        [1, "u256", "scvU256"],
        [2, "timepoint", "scvTimepoint"],
        [3, "duration", "scvDuration"],
        ["a", "symbol", "scvSymbol"],
        ["a", undefined, "scvString"],
        [Keypair.random(), undefined, "scvAddress"],
        [Buffer.from("abcdefg"), undefined, "scvBytes"],
        [Buffer.from("abcdefg"), "string", "scvString"],
        [Buffer.from("abcdefg"), "symbol", "scvSymbol"],
      ] as const
    ).forEach(([input, typeSpec, outType]) => {
      const scv = nativeToScVal(input, { type: typeSpec } as { type: string });
      expect(scv.switch().name).toBe(outType);
    });

    let scv;

    scv = nativeToScVal(["a", "b", "c"], { type: "symbol" });
    expect(scv.switch().name).toBe("scvVec");
    (scv.value() as any[]).forEach((v: any) => {
      expect(v.switch().name).toBe("scvSymbol");
    });

    scv = nativeToScVal(
      {
        hello: "world",
        there: [1, 2, 3],
      },
      {
        type: {
          hello: ["symbol", null],
          there: [null, "i32"],
        },
      },
    );
    let e;
    expect(scv.switch().name).toBe("scvMap");

    e = (scv.value() as any[])[0];
    expect(e.key().switch().name).toBe("scvSymbol");
    expect(e.val().switch().name).toBe("scvString");

    e = (scv.value() as any[])[1];
    expect(e.key().switch().name).toBe("scvString");
    expect(e.val().switch().name).toBe("scvVec");
    expect(e.val().value()[0].switch().name).toBe("scvI32");
  });

  it("doesnt throw on arrays with mixed types", () => {
    expect(nativeToScVal([1, "a", false]).switch().name).toBe("scvVec");
  });

  it("allows type specifications across an array", () => {
    const scv = nativeToScVal([1, "a", false, "b"], {
      type: ["i128", "symbol"],
    });
    expect(scv.switch().name).toBe("scvVec");
    expect((scv.value() as any[]).length).toBe(4);
    ["scvI128", "scvSymbol", "scvBool", "scvString"].forEach(
      (expectedType, idx) => {
        expect((scv.value() as any[])[idx].switch().name).toBe(expectedType);
      },
    );
  });

  it("lets strings be small integer ScVals", () => {
    ["i32", "u32"].forEach((type) => {
      const scv = nativeToScVal("12345", { type });
      expect(scv.switch()).toEqual(
        type === "u32" ? xdr.ScValType.scvU32() : xdr.ScValType.scvI32(),
      );
      expect(scv.value()).toBe(12345);
    });
  });

  it("lets strings be large integer ScVals", () => {
    ["i64", "i128", "i256", "u64", "u128", "u256"].forEach((type) => {
      const scv = nativeToScVal("12345", { type });
      expect(XdrLargeInt.getType(scv.switch().name)).toBe(type);
      expect(scValToBigInt(scv)).toBe(BigInt(12345));
    });

    expect(() => nativeToScVal("not a number", { type: "i128" })).toThrow();
    expect(() => nativeToScVal("12345", { type: "notnumeric" })).toThrow();
  });

  it("lets strings be addresses", () => {
    [
      "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM",
      "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE",
      Keypair.random().publicKey(),
      Keypair.random().publicKey(),
    ].forEach((addr) => {
      const scv = nativeToScVal(addr, { type: "address" });
      const equiv = new Address(addr).toScVal();

      expect(scv.switch().name).toBe("scvAddress");
      expect(scv).toEqual(equiv);
    });
  });

  it("parses errors", () => {
    const userErr = xdr.ScVal.scvError(xdr.ScError.sceContract(1234));
    const systemErr = xdr.ScVal.scvError(
      xdr.ScError.sceWasmVm(xdr.ScErrorCode.scecInvalidInput()),
    );

    const native = scValToNative(xdr.ScVal.scvVec([userErr, systemErr]));

    expect(native).toEqual([
      { type: "contract", code: 1234 },
      {
        type: "system",
        code: systemErr.error().code().value,
        value: systemErr.error().code().name,
      },
    ]);
  });

  it("can sort maps by string", () => {
    const sample = nativeToScVal(
      { a: 1, b: 2, c: 3 },
      {
        type: {
          a: ["symbol"],
          b: ["symbol"],
          c: ["symbol"],
        },
      },
    );
    const sampleValue = sample.value() as any[];

    ["a", "b", "c"].forEach((val, idx) => {
      expect(sampleValue[idx].key().value()).toBe(val);
    });

    // nativeToScVal will sort, so we need to "unsort" to make sure it works.
    // We'll do this by swapping 0 (a) and 2 (c).
    const tmp = sampleValue[0];
    sampleValue[0] = sampleValue[2];
    sampleValue[2] = tmp;

    ["c", "b", "a"].forEach((val, idx) => {
      expect(sampleValue[idx].key().value()).toBe(val);
    });

    const sorted = xdr.scvSortedMap(sampleValue as xdr.ScMapEntry[]);
    expect(sorted.switch().name).toBe("scvMap");
    ["a", "b", "c"].forEach((val, idx) => {
      expect((sorted.value() as any[])[idx].key().value()).toBe(val);
    });
  });

  it("can sort number-like maps", () => {
    const sample = nativeToScVal(
      { 1: "a", 2: "b", 3: "c" },
      {
        type: {
          1: ["i64", "symbol"],
          2: ["i64", "symbol"],
          3: ["i64", "symbol"],
        },
      },
    );
    expect((sample.value() as any[])[0].key().switch().name).toBe("scvI64");

    [1n, 2n, 3n].forEach((val, idx) => {
      const underlyingKey = (sample.value() as any[])[idx].key().value();
      expect(underlyingKey.toBigInt()).toBe(val);
    });

    // nativeToScVal will sort, so we need to "unsort" to make sure it works.
    // We'll do this by swapping 0th (1n) and 2nd (3n).
    const tmp = (sample.value() as any[])[0];
    (sample.value() as any[])[0] = (sample.value() as any[])[2];
    (sample.value() as any[])[2] = tmp;

    [3n, 2n, 1n].forEach((val, idx) => {
      expect((sample.value() as any[])[idx].key().value().toBigInt()).toBe(val);
    });

    const sorted = xdr.scvSortedMap(sample.value() as xdr.ScMapEntry[]);
    expect(sorted.switch().name).toBe("scvMap");
    [1n, 2n, 3n].forEach((val, idx) => {
      expect((sorted.value() as any[])[idx].key().value().toBigInt()).toBe(val);
    });
  });
});
