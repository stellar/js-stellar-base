import { describe, it, expect } from "vitest";
import { Operation } from "../../../src/operation.js";
import xdr from "../../../src/xdr.js";

describe("Operation.inflation()", () => {
  it("creates an inflation operation", () => {
    const op = Operation.inflation();
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("inflation");
  });

  it("creates an inflation operation with source account", () => {
    const source = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
    const op = Operation.inflation({ source });
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("inflation");
    expect(obj.source).toBe(source);
  });

  it("creates an inflation operation with empty opts", () => {
    const op = Operation.inflation({});
    const xdrHex = op.toXDR("hex");
    const operation = xdr.Operation.fromXDR(Buffer.from(xdrHex, "hex"));
    const obj = Operation.fromXDRObject(operation);
    expect(obj.type).toBe("inflation");
    expect(obj.source).toBeUndefined();
  });

  it("creates an inflation operation with no args", () => {
    const op = Operation.inflation();
    expect(op).toBeInstanceOf(xdr.Operation);
    expect(op.body().switch().name).toBe("inflation");
  });

  it("fails to create inflation operation with an invalid source address", () => {
    expect(() => Operation.inflation({ source: "GCEZ" })).toThrow(
      /Source address is invalid/,
    );
  });

  it("roundtrips through XDR hex encoding", () => {
    const op = Operation.inflation();
    const hex = op.toXDR("hex");
    const roundtripped = xdr.Operation.fromXDR(hex, "hex");
    expect(roundtripped.body().switch().name).toBe("inflation");
  });
});
