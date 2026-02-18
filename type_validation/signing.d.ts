export declare function generate(secretKey: Buffer | string): Buffer;
export declare function sign(data: Buffer, rawSecret: Buffer | string): Buffer;
export declare function verify(data: Buffer, signature: Buffer, rawPublicKey: Buffer): boolean;
