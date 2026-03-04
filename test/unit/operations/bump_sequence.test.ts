import { describe, expect, it } from "vitest";
import { Operation } from "../../../src/operation.js";
import xdr from "../../../src/xdr.js";

describe("Operation.bumpSequence()", () => {
  it("creates a bumpSequence operation", () => {
    const opts = { bumpTo: "77833036561510299" };
    const op = Operation.bumpSequence(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("bumpSequence");
    expect(obj.bumpTo).toBe("77833036561510299");
  });

  it("creates a bumpSequence operation with small number", () => {
    const opts = { bumpTo: "100" };
    const op = Operation.bumpSequence(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("bumpSequence");
    expect(obj.bumpTo).toBe("100");
  });

  it("creates a bumpSequence operation with source account", () => {
    const source = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
    const opts = { bumpTo: "100", source };
    const op = Operation.bumpSequence(opts);
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("bumpSequence");
    expect(obj.source).toBe(source);
  });

  describe("fails to create bumpSequence operation", () => {
    it("throws when bumpTo is not a string", () => {
      expect(() =>
        Operation.bumpSequence({
          bumpTo: 1000 as unknown as string,
        }),
      ).toThrow(/bumpTo must be a string/);
    });

    it("throws when bumpTo is not a valid number string", () => {
      expect(() => Operation.bumpSequence({ bumpTo: "not-a-number" })).toThrow(
        /bumpTo must be a stringified number/,
      );
    });
  });

  it("fails to create operation with an invalid source address", () => {
    expect(() =>
      Operation.bumpSequence({
        bumpTo: "100",
        source: "GCEZ",
      }),
    ).toThrow(/Source address is invalid/);
  });

  it("roundtrips through XDR hex encoding", () => {
    const op = Operation.bumpSequence({ bumpTo: "42" });
    const hex = op.toXDR("hex");
    const roundtripped = xdr.Operation.fromXDR(hex, "hex");
    expect(roundtripped.body().switch().name).toBe("bumpSequence");
  });
});
