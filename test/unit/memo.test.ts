import { describe, expect, it } from "vitest";
import {
  Memo,
  MemoNone,
  MemoID,
  MemoText,
  MemoHash,
  MemoReturn
} from "../../src/memo.js";

describe("Memo", () => {
  describe("constructor", () => {
    it("throws error when type is invalid", () => {
      // @ts-expect-error testing invalid input
      expect(() => new Memo("test")).toThrow(/Invalid memo type/);
    });
  });

  describe(".none()", () => {
    it("converts to/from xdr object", () => {
      const memo = Memo.none();
      expect(memo.type).toBe(MemoNone);
      expect(memo.value).toBeNull();

      const xdrMemo = memo.toXDRObject();
      expect(xdrMemo.value()).toBeUndefined();

      const baseMemo = Memo.fromXDRObject(xdrMemo);
      expect(baseMemo.type).toBe(MemoNone);
      expect(baseMemo.value).toBeNull();
    });
  });

  describe(".text()", () => {
    it("returns a value for a correct argument", () => {
      const memo = Memo.text("test");
      expect(memo.type).toBe(MemoText);
      expect(memo.value).toBe("test");

      const memoUtf8 = Memo.text("三代之時");
      expect(memoUtf8.type).toBe(MemoText);
      expect(memoUtf8.value).toBe("三代之時");

      const a = Buffer.from(memoUtf8.toXDRObject().value() as string, "utf8");
      const b = Buffer.from("三代之時", "utf8");
      expect(a).toEqual(b);
    });

    it("returns a value for a correct argument (utf8)", () => {
      let memoText = new Memo(MemoText, Buffer.from([0xd1]))
        .toXDRObject()
        .toXDR();
      const expected = Buffer.from([
        // memo_text
        0x00, 0x00, 0x00, 0x01,
        // length
        0x00, 0x00, 0x00, 0x01,
        // value
        0xd1, 0x00, 0x00, 0x00
      ]);
      expect(memoText.equals(expected)).toBe(true);
    });

    it("converts to/from xdr object", () => {
      const memo = Memo.text("test");
      expect(memo.type).toBe(MemoText);
      expect(memo.value).toBe("test");

      const xdrMemo = memo.toXDRObject();
      expect(xdrMemo.switch().name).toBe("memoText");
      expect((xdrMemo as any).arm()).toBe("text");
      expect(xdrMemo.text()).toBe("test");
      expect(xdrMemo.value()).toBe("test");

      const baseMemo = Memo.fromXDRObject(xdrMemo);
      expect(baseMemo.type).toBe(MemoText);
      expect(baseMemo.value).toBe("test");
    });

    it("converts to/from xdr object (buffer)", () => {
      const buf = Buffer.from([0xd1]);
      const memo = Memo.text(buf.toString("utf8"));
      expect(memo.type).toBe(MemoText);
      expect(memo.value).toBe(buf.toString("utf8"));

      const xdrMemo = memo.toXDRObject();
      expect(xdrMemo.switch().name).toBe("memoText");
      expect((xdrMemo as any).arm()).toBe("text");
      expect(xdrMemo.text()).toBe(buf.toString("utf8"));
      expect(xdrMemo.value()).toBe(buf.toString("utf8"));

      const baseMemo = Memo.fromXDRObject(xdrMemo);
      expect(baseMemo.type).toBe(MemoText);
      expect(baseMemo.value).toBe(buf.toString("utf8"));
    });

    it("throws an error when invalid argument was passed", () => {
      // @ts-expect-error testing missing arg
      expect(() => Memo.text()).toThrow(
        /Expects string, array or buffer, max 28 bytes/
      );
      // @ts-expect-error testing invalid input
      expect(() => Memo.text({})).toThrow(
        /Expects string, array or buffer, max 28 bytes/
      );
      // @ts-expect-error testing invalid input
      expect(() => Memo.text(10)).toThrow(
        /Expects string, array or buffer, max 28 bytes/
      );
      // @ts-expect-error testing invalid input
      expect(() => Memo.text(Infinity)).toThrow(
        /Expects string, array or buffer, max 28 bytes/
      );
      // @ts-expect-error testing invalid input
      expect(() => Memo.text(NaN)).toThrow(
        /Expects string, array or buffer, max 28 bytes/
      );
    });

    it("throws an error when string is longer than 28 bytes", () => {
      expect(() => Memo.text("12345678901234567890123456789")).toThrow(
        /Expects string, array or buffer, max 28 bytes/
      );
      expect(() => Memo.text("三代之時三代之時三代之時")).toThrow(
        /Expects string, array or buffer, max 28 bytes/
      );
    });
  });

  describe(".id()", () => {
    it("returns a value for a correct argument", () => {
      expect(() => Memo.id("1000")).not.toThrow();
      expect(() => Memo.id("0")).not.toThrow();
    });

    it("converts to/from xdr object", () => {
      const memo = Memo.id("1000");
      expect(memo.type).toBe(MemoID);
      expect(memo.value).toBe("1000");

      const xdrMemo = memo.toXDRObject();
      expect(xdrMemo.switch().name).toBe("memoId");
      expect((xdrMemo as any).arm()).toBe("id");
      expect(xdrMemo.id().toString()).toBe("1000");

      const baseMemo = Memo.fromXDRObject(xdrMemo);
      expect(baseMemo.type).toBe(MemoID);
      expect(baseMemo.value).toBe("1000");
    });

    it("throws an error when invalid argument was passed", () => {
      // @ts-expect-error testing missing arg
      expect(() => Memo.id()).toThrow(/Expects a int64/);
      // @ts-expect-error testing invalid input
      expect(() => Memo.id({})).toThrow(/Expects a int64/);
      // @ts-expect-error testing invalid input
      expect(() => Memo.id(Infinity)).toThrow(/Expects a int64/);
      // @ts-expect-error testing invalid input
      expect(() => Memo.id(NaN)).toThrow(/Expects a int64/);
      expect(() => Memo.id("test")).toThrow(/Expects a int64/);
    });
  });

  describe(".hash() & .return()", () => {
    it("hash converts to/from xdr object", () => {
      const buffer = Buffer.alloc(32, 10);

      const memo = Memo.hash(buffer);
      expect(memo.type).toBe(MemoHash);
      expect(memo.value).toEqual(buffer);

      const xdrMemo = memo.toXDRObject();
      expect(xdrMemo.switch().name).toBe("memoHash");
      expect((xdrMemo as any).arm()).toBe("hash");
      expect(xdrMemo.hash().length).toBe(32);
      expect(xdrMemo.hash()).toEqual(buffer);

      const baseMemo = Memo.fromXDRObject(xdrMemo);
      expect(baseMemo.type).toBe(MemoHash);
      expect((baseMemo.value as Buffer).length).toBe(32);
      expect((baseMemo.value as Buffer).toString("hex")).toBe(
        buffer.toString("hex")
      );
    });

    it("return converts to/from xdr object", () => {
      const buffer = Buffer.alloc(32, 10);

      // Testing string hash
      const memo = Memo.return(buffer.toString("hex"));
      expect(memo.value).toEqual(buffer);
      expect(memo.type).toBe(MemoReturn);

      const xdrMemo = memo.toXDRObject();
      expect(xdrMemo.switch().name).toBe("memoReturn");
      expect((xdrMemo as any).arm()).toBe("retHash");
      expect(xdrMemo.retHash().length).toBe(32);
      expect(xdrMemo.retHash().toString("hex")).toBe(buffer.toString("hex"));

      const baseMemo = Memo.fromXDRObject(xdrMemo);
      expect(baseMemo.type).toBe(MemoReturn);
      expect(Buffer.isBuffer(baseMemo.value)).toBe(true);
      expect((baseMemo.value as Buffer).length).toBe(32);
      expect((baseMemo.value as Buffer).toString("hex")).toBe(
        buffer.toString("hex")
      );
    });

    it("returns a value for a correct argument", () => {
      const methods = [Memo.hash, Memo.return] as const;
      for (const method of methods) {
        expect(() => method(Buffer.alloc(32).toString("hex"))).not.toThrow();
        expect(() =>
          method(
            "0000000000000000000000000000000000000000000000000000000000000000"
          )
        ).not.toThrow();
      }
    });

    it("throws an error when invalid argument was passed", () => {
      const methods = [Memo.hash, Memo.return] as const;
      for (const method of methods) {
        // @ts-expect-error testing missing arg
        expect(() => method()).toThrow(/Expects a 32 byte hash value/);
        // @ts-expect-error testing invalid input
        expect(() => method({})).toThrow(/Expects a 32 byte hash value/);
        // @ts-expect-error testing invalid input
        expect(() => method(Infinity)).toThrow(/Expects a 32 byte hash value/);
        // @ts-expect-error testing invalid input
        expect(() => method(NaN)).toThrow(/Expects a 32 byte hash value/);
        expect(() => method("test")).toThrow(/Expects a 32 byte hash value/);
        // @ts-expect-error testing invalid input
        expect(() => method([0, 10, 20])).toThrow(
          /Expects a 32 byte hash value/
        );
        expect(() => method(Buffer.alloc(33).toString("hex"))).toThrow(
          /Expects a 32 byte hash value/
        );
        expect(() =>
          method(
            "00000000000000000000000000000000000000000000000000000000000000"
          )
        ).toThrow(/Expects a 32 byte hash value/);
        expect(() =>
          method(
            "000000000000000000000000000000000000000000000000000000000000000000"
          )
        ).toThrow(/Expects a 32 byte hash value/);
      }
    });
  });
});
