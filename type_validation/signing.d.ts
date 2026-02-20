export declare function generate(secretKey: Buffer | Uint8Array): Buffer;
export declare function sign(data: Buffer, rawSecret: Buffer | Uint8Array): Buffer;
export declare function verify(data: Buffer, signature: Buffer, rawPublicKey: Buffer | Uint8Array): boolean;
