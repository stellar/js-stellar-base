import * as crypto from "crypto";
import { describe, it, expect } from "vitest";
import { hash } from "../../src/hashing.js";

describe("hash", () => {
  const expectedHex =
    "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";

  it("hashes a string properly, using SHA256", () => {
    const actualHex = hash("hello world").toString("hex");
    expect(actualHex).toEqual(expectedHex);
  });

  it("hashes a buffer properly, using SHA256", () => {
    const msg = Buffer.from("hello world", "utf8");
    const actualHex = hash(msg).toString("hex");
    expect(actualHex).toEqual(expectedHex);
  });

  it("hashes an array of bytes properly, using SHA256", () => {
    const msg: number[] = [
      104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
    ];
    const actualHex = hash(msg as unknown as Buffer).toString("hex");
    expect(actualHex).toEqual(expectedHex);
  });

  // Verify that our hash() produces the same result as Node's built-in
  // crypto.createHash("sha256"), ensuring the browser-compatible library
  // remains consistent with the native implementation.
  it("produces the same result as Node's crypto module", () => {
    const input = "I really hope this works";
    const cryptoHash = crypto.createHash("sha256").update(input).digest();
    const newHash = hash(input);
    expect(newHash.toString("hex")).toEqual(cryptoHash.toString("hex"));
  });
});
