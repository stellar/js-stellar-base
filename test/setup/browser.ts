import { Buffer } from "buffer";

Object.defineProperty(globalThis, "Buffer", {
  value: Buffer,
  configurable: true,
  writable: true
});