import { sha256 } from 'sha.js';

type BufferAlikeES2015 = DataView | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array

export function hash(data: string | Buffer | BufferAlikeES2015): Buffer {
  const hasher = new sha256();
  if(typeof data === 'string') {
    hasher.update(data, 'utf8');
  } else {
    hasher.update(data)
  }
  return hasher.digest();
}
