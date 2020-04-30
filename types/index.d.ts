// TypeScript Version: 2.9

/// <reference types="node" />
export {};

export class Account {
  constructor(accountId: string, sequence: string);
  accountId(): string;
  sequenceNumber(): string;
  incrementSequenceNumber(): void;
}

export namespace AssetType {
  type native = 'native';
  type credit4 = 'credit_alphanum4';
  type credit12 = 'credit_alphanum12';
}
export type AssetType =
  | AssetType.native
  | AssetType.credit4
  | AssetType.credit12;

export class Asset {
  static native(): Asset;
  static fromOperation(xdr: xdr.Asset): Asset;

  constructor(code: string, issuer?: string);

  getCode(): string;
  getIssuer(): string;
  getAssetType(): AssetType;
  isNative(): boolean;
  equals(other: Asset): boolean;
  toXDRObject(): xdr.Asset;

  code: string;
  issuer: string;
}

export const FastSigning: boolean;

export type KeypairType = 'ed25519';

export class Keypair {
  static fromRawEd25519Seed(secretSeed: Buffer): Keypair;
  static fromSecret(secretKey: string): Keypair;
  static master(networkPassphrase: string): Keypair;
  static fromPublicKey(publicKey: string): Keypair;
  static random(): Keypair;

  constructor(
    keys:
      | { type: KeypairType; secretKey: string; publicKey?: string }
      | { type: KeypairType; publicKey: string }
  );

  readonly type: KeypairType;
  publicKey(): string;
  secret(): string;
  rawPublicKey(): Buffer;
  rawSecretKey(): Buffer;
  canSign(): boolean;
  sign(data: Buffer): xdr.Signature;
  signDecorated(data: Buffer): xdr.DecoratedSignature;
  signatureHint(): xdr.SignatureHint;
  verify(data: Buffer, signature: xdr.Signature): boolean;
  xdrAccountId(): xdr.AccountId;
}

export const MemoNone = 'none';
export const MemoID = 'id';
export const MemoText = 'text';
export const MemoHash = 'hash';
export const MemoReturn = 'return';
export namespace MemoType {
  type None = typeof MemoNone;
  type ID = typeof MemoID;
  type Text = typeof MemoText;
  type Hash = typeof MemoHash;
  type Return = typeof MemoReturn;
}
export type MemoType =
  | MemoType.None
  | MemoType.ID
  | MemoType.Text
  | MemoType.Hash
  | MemoType.Return;
export type MemoValue = null | string | Buffer;

export class Memo<T extends MemoType = MemoType> {
  static fromXDRObject(memo: xdr.Memo): Memo;
  static hash(hash: string): Memo<MemoType.Hash>;
  static id(id: string): Memo<MemoType.ID>;
  static none(): Memo<MemoType.None>;
  static return(hash: string): Memo<MemoType.Return>;
  static text(text: string): Memo<MemoType.Text>;

  constructor(type: MemoType.None, value?: null);
  constructor(type: MemoType.Hash | MemoType.Return, value: Buffer);
  constructor(
    type: MemoType.Hash | MemoType.Return | MemoType.ID | MemoType.Text,
    value: string
  );
  constructor(type: T, value: MemoValue);

  type: T;
  value: T extends MemoType.None
    ? null
    : T extends MemoType.ID
    ? string
    : T extends MemoType.Text
    ? string | Buffer // github.com/stellar/js-stellar-base/issues/152
    : T extends MemoType.Hash
    ? Buffer
    : T extends MemoType.Return
    ? Buffer
    : MemoValue;

  toXDRObject(): xdr.Memo;
}

export enum Networks {
  PUBLIC = 'Public Global Stellar Network ; September 2015',
  TESTNET = 'Test SDF Network ; September 2015'
}

export const AuthRequiredFlag: 1;
export const AuthRevocableFlag: 2;
export const AuthImmutableFlag: 4;
export namespace AuthFlag {
  type immutable = typeof AuthImmutableFlag;
  type required = typeof AuthRequiredFlag;
  type revocable = typeof AuthRevocableFlag;
}
export type AuthFlag =
  | AuthFlag.immutable
  | AuthFlag.required
  | AuthFlag.revocable;

export namespace Signer {
  interface Ed25519PublicKey {
    ed25519PublicKey: string;
    weight: number | undefined;
  }
  interface Sha256Hash {
    sha256Hash: Buffer;
    weight: number | undefined;
  }
  interface PreAuthTx {
    preAuthTx: Buffer;
    weight: number | undefined;
  }
}
export type Signer =
  | Signer.Ed25519PublicKey
  | Signer.Sha256Hash
  | Signer.PreAuthTx;

export namespace SignerOptions {
  interface Ed25519PublicKey {
    ed25519PublicKey: string;
    weight?: number | string;
  }
  interface Sha256Hash {
    sha256Hash: Buffer | string;
    weight?: number | string;
  }
  interface PreAuthTx {
    preAuthTx: Buffer | string;
    weight?: number | string;
  }
}
export type SignerOptions =
  | SignerOptions.Ed25519PublicKey
  | SignerOptions.Sha256Hash
  | SignerOptions.PreAuthTx;

export namespace OperationType {
  type CreateAccount = 'createAccount';
  type Payment = 'payment';
  type PathPaymentStrictReceive = 'pathPaymentStrictReceive';
  type PathPaymentStrictSend = 'pathPaymentStrictSend';
  type CreatePassiveSellOffer = 'createPassiveSellOffer';
  type ManageSellOffer = 'manageSellOffer';
  type ManageBuyOffer = 'manageBuyOffer';
  type SetOptions = 'setOptions';
  type ChangeTrust = 'changeTrust';
  type AllowTrust = 'allowTrust';
  type AccountMerge = 'accountMerge';
  type Inflation = 'inflation';
  type ManageData = 'manageData';
  type BumpSequence = 'bumpSequence';
}
export type OperationType =
  | OperationType.CreateAccount
  | OperationType.Payment
  | OperationType.PathPaymentStrictReceive
  | OperationType.PathPaymentStrictSend
  | OperationType.CreatePassiveSellOffer
  | OperationType.ManageSellOffer
  | OperationType.ManageBuyOffer
  | OperationType.SetOptions
  | OperationType.ChangeTrust
  | OperationType.AllowTrust
  | OperationType.AccountMerge
  | OperationType.Inflation
  | OperationType.ManageData
  | OperationType.BumpSequence;

export namespace OperationOptions {
  interface BaseOptions {
    source?: string;
  }
  interface AccountMerge extends BaseOptions {
    destination: string;
  }
  interface AllowTrust extends BaseOptions {
    trustor: string;
    assetCode: string;
    authorize?: boolean | number;
  }
  interface ChangeTrust extends BaseOptions {
    asset: Asset;
    limit?: string;
  }
  interface CreateAccount extends BaseOptions {
    destination: string;
    startingBalance: string;
  }
  interface CreatePassiveSellOffer extends BaseOptions {
    selling: Asset;
    buying: Asset;
    amount: string;
    price: number | string | object /* bignumber.js */;
  }
  interface ManageSellOffer extends CreatePassiveSellOffer {
    offerId?: number | string;
  }
  interface ManageBuyOffer extends BaseOptions {
    selling: Asset;
    buying: Asset;
    buyAmount: string;
    price: number | string | object /* bignumber.js */;
    offerId?: number | string;
  }
  // tslint:disable-next-line
  interface Inflation extends BaseOptions {
    // tslint:disable-line
  }
  interface ManageData extends BaseOptions {
    name: string;
    value: string | Buffer | null;
  }
  interface PathPaymentStrictReceive extends BaseOptions {
    sendAsset: Asset;
    sendMax: string;
    destination: string;
    destAsset: Asset;
    destAmount: string;
    path?: Asset[];
  }
  interface PathPaymentStrictSend extends BaseOptions {
    sendAsset: Asset;
    sendAmount: string;
    destination: string;
    destAsset: Asset;
    destMin: string;
    path?: Asset[];
  }
  interface Payment extends BaseOptions {
    amount: string;
    asset: Asset;
    destination: string;
  }
  interface SetOptions<T extends SignerOptions = never> extends BaseOptions {
    inflationDest?: string;
    clearFlags?: AuthFlag;
    setFlags?: AuthFlag;
    masterWeight?: number | string;
    lowThreshold?: number | string;
    medThreshold?: number | string;
    highThreshold?: number | string;
    homeDomain?: string;
    signer?: T;
  }
  interface BumpSequence extends BaseOptions {
    bumpTo: string;
  }
}
export type OperationOptions =
  | OperationOptions.CreateAccount
  | OperationOptions.Payment
  | OperationOptions.PathPaymentStrictReceive
  | OperationOptions.PathPaymentStrictSend
  | OperationOptions.CreatePassiveSellOffer
  | OperationOptions.ManageSellOffer
  | OperationOptions.ManageBuyOffer
  | OperationOptions.SetOptions
  | OperationOptions.ChangeTrust
  | OperationOptions.AllowTrust
  | OperationOptions.AccountMerge
  | OperationOptions.Inflation
  | OperationOptions.ManageData
  | OperationOptions.BumpSequence;

export namespace Operation {
  interface BaseOperation<T extends OperationType = OperationType> {
    type: T;
    source?: string;
  }

  interface AccountMerge extends BaseOperation<OperationType.AccountMerge> {
    destination: string;
  }
  function accountMerge(
    options: OperationOptions.AccountMerge
  ): xdr.Operation<AccountMerge>;

  interface AllowTrust extends BaseOperation<OperationType.AllowTrust> {
    trustor: string;
    assetCode: string;
    // this is a boolean or a number so that it can support protocol 12 or 13
    authorize: boolean | number | undefined;
  }
  function allowTrust(
    options: OperationOptions.AllowTrust
  ): xdr.Operation<AllowTrust>;

  interface ChangeTrust extends BaseOperation<OperationType.ChangeTrust> {
    line: Asset;
    limit: string;
  }
  function changeTrust(
    options: OperationOptions.ChangeTrust
  ): xdr.Operation<ChangeTrust>;

  interface CreateAccount extends BaseOperation<OperationType.CreateAccount> {
    destination: string;
    startingBalance: string;
  }
  function createAccount(
    options: OperationOptions.CreateAccount
  ): xdr.Operation<CreateAccount>;

  interface CreatePassiveSellOffer
    extends BaseOperation<OperationType.CreatePassiveSellOffer> {
    selling: Asset;
    buying: Asset;
    amount: string;
    price: string;
  }
  function createPassiveSellOffer(
    options: OperationOptions.CreatePassiveSellOffer
  ): xdr.Operation<CreatePassiveSellOffer>;

  interface Inflation extends BaseOperation<OperationType.Inflation> {}
  function inflation(
    options: OperationOptions.Inflation
  ): xdr.Operation<Inflation>;

  interface ManageData extends BaseOperation<OperationType.ManageData> {
    name: string;
    value: Buffer;
  }
  function manageData(
    options: OperationOptions.ManageData
  ): xdr.Operation<ManageData>;

  interface ManageSellOffer
    extends BaseOperation<OperationType.ManageSellOffer> {
    selling: Asset;
    buying: Asset;
    amount: string;
    price: string;
    offerId: string;
  }
  function manageSellOffer(
    options: OperationOptions.ManageSellOffer
  ): xdr.Operation<ManageSellOffer>;

  interface ManageBuyOffer extends BaseOperation<OperationType.ManageBuyOffer> {
    selling: Asset;
    buying: Asset;
    buyAmount: string;
    price: string;
    offerId: string;
  }
  function manageBuyOffer(
    options: OperationOptions.ManageBuyOffer
  ): xdr.Operation<ManageBuyOffer>;

  interface PathPaymentStrictReceive extends BaseOperation<OperationType.PathPaymentStrictReceive> {
    sendAsset: Asset;
    sendMax: string;
    destination: string;
    destAsset: Asset;
    destAmount: string;
    path: Asset[];
  }
  function pathPaymentStrictReceive(
    options: OperationOptions.PathPaymentStrictReceive
  ): xdr.Operation<PathPaymentStrictReceive>;

  interface PathPaymentStrictSend extends BaseOperation<OperationType.PathPaymentStrictSend> {
    sendAsset: Asset;
    sendAmount: string;
    destination: string;
    destAsset: Asset;
    destMin: string;
    path: Asset[];
  }
  function pathPaymentStrictSend(
    options: OperationOptions.PathPaymentStrictSend
  ): xdr.Operation<PathPaymentStrictSend>;

  interface Payment extends BaseOperation<OperationType.Payment> {
    amount: string;
    asset: Asset;
    destination: string;
  }
  function payment(options: OperationOptions.Payment): xdr.Operation<Payment>;

  interface SetOptions<T extends SignerOptions = SignerOptions>
    extends BaseOperation<OperationType.SetOptions> {
    inflationDest?: string;
    clearFlags?: AuthFlag;
    setFlags?: AuthFlag;
    masterWeight?: number;
    lowThreshold?: number;
    medThreshold?: number;
    highThreshold?: number;
    homeDomain?: string;
    signer: T extends { ed25519PublicKey: any }
      ? Signer.Ed25519PublicKey
      : T extends { sha256Hash: any }
      ? Signer.Sha256Hash
      : T extends { preAuthTx: any }
      ? Signer.PreAuthTx
      : never;
  }
  function setOptions<T extends SignerOptions = never>(
    options: OperationOptions.SetOptions<T>
  ): xdr.Operation<SetOptions<T>>;

  interface BumpSequence extends BaseOperation<OperationType.BumpSequence> {
    bumpTo: string;
  }
  function bumpSequence(
    options: OperationOptions.BumpSequence
  ): xdr.Operation<BumpSequence>;

  function fromXDRObject<T extends Operation = Operation>(
    xdrOperation: xdr.Operation<T>
  ): T;
}
export type Operation =
  | Operation.CreateAccount
  | Operation.Payment
  | Operation.PathPaymentStrictReceive
  | Operation.PathPaymentStrictSend
  | Operation.CreatePassiveSellOffer
  | Operation.ManageSellOffer
  | Operation.ManageBuyOffer
  | Operation.SetOptions
  | Operation.ChangeTrust
  | Operation.AllowTrust
  | Operation.AccountMerge
  | Operation.Inflation
  | Operation.ManageData
  | Operation.BumpSequence;

export namespace StrKey {
  function encodeEd25519PublicKey(data: Buffer): string;
  function decodeEd25519PublicKey(data: string): Buffer;
  function isValidEd25519PublicKey(Key: string): boolean;

  function encodeEd25519SecretSeed(data: Buffer): string;
  function decodeEd25519SecretSeed(data: string): Buffer;
  function isValidEd25519SecretSeed(seed: string): boolean;

  function encodePreAuthTx(data: Buffer): string;
  function decodePreAuthTx(data: string): Buffer;

  function encodeSha256Hash(data: Buffer): string;
  function decodeSha256Hash(data: string): Buffer;

  function encodeMuxedAccount(data: Buffer): string;
  function decodeMuxedAccount(data: string): Buffer;
}

export class TransactionI {
  addSignature(publicKey: string, signature: string): void;
  fee: string;
  getKeypairSignature(keypair: Keypair): string;
  hash(): Buffer;
  networkPassphrase: string;
  sign(...keypairs: Keypair[]): void;
  signatureBase(): Buffer;
  signatures: xdr.DecoratedSignature[];
  signHashX(preimage: Buffer | string): void;
  toEnvelope(): xdr.TransactionEnvelope;
  toXDR(): string;
}

export class FeeBumpTransaction extends TransactionI {
  constructor(envelope: string | xdr.TransactionEnvelope, networkPassphrase: string);
  feeSource: string;
  innerTransaction: Transaction;
}

export class Transaction<
  TMemo extends Memo = Memo,
  TOps extends Operation[] = Operation[]
> extends TransactionI {
  constructor(envelope: string | xdr.TransactionEnvelope, networkPassphrase: string);
  memo: TMemo;
  operations: TOps;
  sequence: string;
  source: string;
  timeBounds?: {
    minTime: string;
    maxTime: string;
  };
}

export const BASE_FEE = "100";
export const TimeoutInfinite = 0;

export class TransactionBuilder {
  constructor(
    sourceAccount: Account,
    options?: TransactionBuilder.TransactionBuilderOptions
  );
  addOperation(operation: xdr.Operation): this;
  addMemo(memo: Memo): this;
  setTimeout(timeoutInSeconds: number): this;
  build(): Transaction;
  setNetworkPassphrase(networkPassphrase: string): this;
  static buildFeeBumpTransaction(feeSource: Keypair, baseFee: string, innerTx: Transaction, networkPassphrase: string): FeeBumpTransaction;
  static fromXDR(envelope: string|xdr.TransactionEnvelope, networkPassphrase: string): Transaction|FeeBumpTransaction;
}

export namespace TransactionBuilder {
  interface TransactionBuilderOptions {
    fee: string;
    timebounds?: {
      minTime?: number | string;
      maxTime?: number | string;
    };
    memo?: Memo;
    networkPassphrase?: string;
    v1?: boolean;
  }
}

// Hidden namespace as hack to work around name collision.
declare namespace xdrHidden {
  // tslint:disable-line:strict-export-declare-modifiers
  class Operation2<T extends Operation = Operation> extends xdr.XDRStruct {
    static fromXDR(input: Buffer, format?: 'raw'): xdr.Operation;
    static fromXDR(input: string, format: 'hex' | 'base64'): xdr.Operation;
  }
}

export namespace xdr {
  class XDRStruct {
    static fromXDR(input: Buffer, format?: 'raw'): XDRStruct;
    static fromXDR(input: string, format: 'hex' | 'base64'): XDRStruct;

    toXDR(base?: string): Buffer;
    toXDR(encoding: string): string;
  }
  export import Operation = xdrHidden.Operation2; // tslint:disable-line:strict-export-declare-modifiers
  class AccountId extends XDRStruct {
    static fromXDR(xdr: Buffer, format?: 'raw'): AccountId;
    static fromXDR(xdr: string, format: 'hex' | 'base64'): AccountId;
  }
  class Asset extends XDRStruct {
    static fromXDR(xdr: Buffer, format?: 'raw'): Asset;
    static fromXDR(xdr: string, format: 'hex' | 'base64'): Asset;
  }
  class Memo extends XDRStruct {
    static fromXDR(xdr: Buffer, format?: 'raw'): Memo;
    static fromXDR(xdr: string, format: 'hex' | 'base64'): Memo;
  }
  class EnvelopeType extends XDRStruct {
    static fromXDR(xdr: Buffer, format?: 'raw'): Memo;
    static fromXDR(xdr: string, format: 'hex' | 'base64'): Memo;
    name: string;
    value: number;
  }
  class TransactionEnvelope extends XDRStruct {
    static fromXDR(xdr: Buffer, format?: 'raw'): TransactionEnvelope;
    static fromXDR(xdr: string, format: 'hex' | 'base64'): TransactionEnvelope;
    switch(): EnvelopeType;
    v0(): TransactionV0Envelope;
    v1(): TransactionV1Envelope;
    feeBump(): FeeBumpTransactionEnvelope;
    value(): TransactionV0Envelope | TransactionV1Envelope | FeeBumpTransactionEnvelope;
  }
  class FeeBumpTransactionEnvelope extends XDRStruct {
    static fromXDR(xdr: Buffer, format?: 'raw'): FeeBumpTransactionEnvelope;
    static fromXDR(xdr: string, format: 'hex' | 'base64'): FeeBumpTransactionEnvelope;
  }
  class TransactionV0Envelope extends XDRStruct {
    static fromXDR(xdr: Buffer, format?: 'raw'): TransactionV0Envelope;
    static fromXDR(xdr: string, format: 'hex' | 'base64'): TransactionV0Envelope;
  }
  class TransactionV1Envelope extends XDRStruct {
    static fromXDR(xdr: Buffer, format?: 'raw'): TransactionV1Envelope;
    static fromXDR(xdr: string, format: 'hex' | 'base64'): TransactionV1Envelope;
  }
  class DecoratedSignature extends XDRStruct {
    static fromXDR(xdr: Buffer, format?: 'raw'): DecoratedSignature;
    static fromXDR(xdr: string, format: 'hex' | 'base64'): DecoratedSignature;

    constructor(keys: { hint: SignatureHint; signature: Signature });

    hint(): SignatureHint;
    signature(): Buffer;
  }
  type SignatureHint = Buffer;
  type Signature = Buffer;

  class TransactionResult extends XDRStruct {
    static fromXDR(xdr: Buffer, format?: 'raw'): TransactionResult;
    static fromXDR(xdr: string, format: 'hex'): TransactionResult;
  }
    interface SignedInt {
    readonly MAX_VALUE: 2147483647;
    readonly MIN_VALUE: -2147483648;
    read(io: Buffer): number;
    write(value: number, io: Buffer): void;
    isValid(value: number): boolean;
    toXDR(value: number): Buffer;
    fromXDR(input: Buffer, format?: 'raw'): number;
    fromXDR(input: string, format: 'hex' | 'base64'): number;
  }

  interface UnsignedInt {
    readonly MAX_VALUE: 4294967295;
    readonly MIN_VALUE: 0;
    read(io: Buffer): number;
    write(value: number, io: Buffer): void;
    isValid(value: number): boolean;
    toXDR(value: number): Buffer;
    fromXDR(input: Buffer, format?: 'raw'): number;
    fromXDR(input: string, format: 'hex' | 'base64'): number;
  }

  class Hyper {
    low: number;

    high: number;

    unsigned: boolean;

    constructor(low: number, high: number);

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static toXDR(value: Hyper): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Hyper;

    static fromXDR(input: string, format: 'hex' | 'base64'): Hyper;

    static readonly MAX_VALUE: Hyper;

    static readonly MIN_VALUE: Hyper;

    static read(io: Buffer): Hyper;

    static write(value: Hyper, io: Buffer): void;

    static fromString(input: string): Hyper;

    static fromBytes(low: number, high: number): Hyper;

    static isValid(value: Hyper): boolean;
  }

  class UnsignedHyper {
    low: number;

    high: number;

    unsigned: boolean;

    constructor(low: number, high: number);

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static toXDR(value: UnsignedHyper): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): UnsignedHyper;

    static fromXDR(input: string, format: 'hex' | 'base64'): UnsignedHyper;

    static readonly MAX_VALUE: UnsignedHyper;

    static readonly MIN_VALUE: UnsignedHyper;

    static read(io: Buffer): UnsignedHyper;

    static write(value: UnsignedHyper, io: Buffer): void;

    static fromString(input: string): UnsignedHyper;

    static fromBytes(low: number, high: number): UnsignedHyper;

    static isValid(value: UnsignedHyper): boolean;
  }

  class XDRString {
    constructor(maxLength: 4294967295);

    read(io: Buffer): Buffer;

    readString(io: Buffer): string;

    write(value: string | Buffer, io: Buffer): void;

    isValid(value: string | number[] | Buffer): boolean;

    toXDR(value: string | Buffer): Buffer;

    fromXDR(input: Buffer, format?: 'raw'): Buffer;

    fromXDR(input: string, format: 'hex' | 'base64'): Buffer;
  }

  class XDRArray {
    constructor(
      childType: {
        read(io: any): any;
        write(value: any, io: Buffer): void;
        isValid(value: any): boolean;
      },
      length: number
    );

    read(io: Buffer): Buffer;

    write(value: any[], io: Buffer): void;

    isValid(value: any[]): boolean;

    toXDR(value: any[]): Buffer;

    fromXDR(input: Buffer, format?: 'raw'): Buffer;

    fromXDR(input: string, format: 'hex' | 'base64'): Buffer;
  }

  class VarArray extends XDRArray {}

  class Opaque {
    constructor(length: number);

    read(io: Buffer): Buffer;

    write(value: Buffer, io: Buffer): void;

    isValid(value: Buffer): boolean;

    toXDR(value: Buffer): Buffer;

    fromXDR(input: Buffer, format?: 'raw'): Buffer;

    fromXDR(input: string, format: 'hex' | 'base64'): Buffer;
  }

  class VarOpaque extends Opaque {}

  const Uint32: UnsignedInt;

  const Int32: SignedInt;

  class Uint64 extends UnsignedHyper {}

  class Int64 extends Hyper {}

  const String32: XDRString;

  const String64: XDRString;

  const Hash: Opaque;

  const EncryptedBody: VarOpaque;

  const Value: VarOpaque;

  const SequenceNumber: typeof Int64;
}

export function hash(data: Buffer): Buffer;
export function sign(data: Buffer, rawSecret: Buffer): xdr.Signature;
export function verify(
  data: Buffer,
  signature: xdr.Signature,
  rawPublicKey: Buffer
): boolean;
