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
  class Operation2<T extends Operation = Operation> {
    constructor(attributes: {
      sourceAccount: null | xdr.MuxedAccount;
      body: xdr.OperationBody;
    });

    sourceAccount(value?: null | xdr.MuxedAccount): null | xdr.MuxedAccount;

    body(value?: xdr.OperationBody): xdr.OperationBody;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Operation;

    static write(value: Operation2, io: Buffer): void;

    static isValid(value: Operation2): boolean;

    static toXDR(value: Operation2): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Operation2;

    static fromXDR(input: string, format: 'hex' | 'base64'): Operation2;
  }
}

export namespace xdr {
  export import Operation = xdrHidden.Operation2; // tslint:disable-line:strict-export-declare-modifiers
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

  class ErrorCode {
    readonly name: 'errMisc' | 'errDatum' | 'errConf' | 'errAuth' | 'errLoad';

    readonly value: 0 | 1 | 2 | 3 | 4;

    static errMisc(): ErrorCode;

    static errDatum(): ErrorCode;

    static errConf(): ErrorCode;

    static errAuth(): ErrorCode;

    static errLoad(): ErrorCode;
  }

  class Error {
    constructor(attributes: { code: ErrorCode; msg: string | Buffer });

    code(value?: ErrorCode): ErrorCode;

    msg(value?: string | Buffer): string | Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Error;

    static write(value: Error, io: Buffer): void;

    static isValid(value: Error): boolean;

    static toXDR(value: Error): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Error;

    static fromXDR(input: string, format: 'hex' | 'base64'): Error;
  }

  class AuthCert {
    constructor(attributes: {
      pubkey: Curve25519Public;
      expiration: Uint64;
      sig: Signature;
    });

    pubkey(value?: Curve25519Public): Curve25519Public;

    expiration(value?: Uint64): Uint64;

    sig(value?: Signature): Signature;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AuthCert;

    static write(value: AuthCert, io: Buffer): void;

    static isValid(value: AuthCert): boolean;

    static toXDR(value: AuthCert): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AuthCert;

    static fromXDR(input: string, format: 'hex' | 'base64'): AuthCert;
  }

  class Hello {
    constructor(attributes: {
      ledgerVersion: Uint32;
      overlayVersion: Uint32;
      overlayMinVersion: Uint32;
      networkId: Hash;
      versionStr: string | Buffer;
      listeningPort: number;
      peerId: NodeId;
      cert: AuthCert;
      nonce: Uint256;
    });

    ledgerVersion(value?: Uint32): Uint32;

    overlayVersion(value?: Uint32): Uint32;

    overlayMinVersion(value?: Uint32): Uint32;

    networkId(value?: Hash): Hash;

    versionStr(value?: string | Buffer): string | Buffer;

    listeningPort(value?: number): number;

    peerId(value?: NodeId): NodeId;

    cert(value?: AuthCert): AuthCert;

    nonce(value?: Uint256): Uint256;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Hello;

    static write(value: Hello, io: Buffer): void;

    static isValid(value: Hello): boolean;

    static toXDR(value: Hello): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Hello;

    static fromXDR(input: string, format: 'hex' | 'base64'): Hello;
  }

  class Auth {
    constructor(attributes: { unused: number });

    unused(value?: number): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Auth;

    static write(value: Auth, io: Buffer): void;

    static isValid(value: Auth): boolean;

    static toXDR(value: Auth): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Auth;

    static fromXDR(input: string, format: 'hex' | 'base64'): Auth;
  }

  class IpAddrType {
    readonly name: 'iPv4' | 'iPv6';

    readonly value: 0 | 1;

    static iPv4(): IpAddrType;

    static iPv6(): IpAddrType;
  }

  class PeerAddressIp {
    switch(): IpAddrType;

    ipv4(value?: Buffer): Buffer;

    ipv6(value?: Buffer): Buffer;

    value(): Buffer | Buffer;

    static iPv4(value: Buffer): PeerAddressIp;

    static iPv6(value: Buffer): PeerAddressIp;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PeerAddressIp;

    static write(value: PeerAddressIp, io: Buffer): void;

    static isValid(value: PeerAddressIp): boolean;

    static toXDR(value: PeerAddressIp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PeerAddressIp;

    static fromXDR(input: string, format: 'hex' | 'base64'): PeerAddressIp;
  }

  class PeerAddress {
    constructor(attributes: {
      ip: PeerAddressIp;
      port: Uint32;
      numFailures: Uint32;
    });

    ip(value?: PeerAddressIp): PeerAddressIp;

    port(value?: Uint32): Uint32;

    numFailures(value?: Uint32): Uint32;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PeerAddress;

    static write(value: PeerAddress, io: Buffer): void;

    static isValid(value: PeerAddress): boolean;

    static toXDR(value: PeerAddress): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PeerAddress;

    static fromXDR(input: string, format: 'hex' | 'base64'): PeerAddress;
  }

  class MessageType {
    readonly name:
      | 'errorMsg'
      | 'auth'
      | 'dontHave'
      | 'getPeer'
      | 'peer'
      | 'getTxSet'
      | 'txSet'
      | 'transaction'
      | 'getScpQuorumset'
      | 'scpQuorumset'
      | 'scpMessage'
      | 'getScpState'
      | 'hello'
      | 'surveyRequest'
      | 'surveyResponse';

    readonly value:
      | 0
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | 9
      | 10
      | 11
      | 12
      | 13
      | 14
      | 15;

    static errorMsg(): MessageType;

    static auth(): MessageType;

    static dontHave(): MessageType;

    static getPeer(): MessageType;

    static peer(): MessageType;

    static getTxSet(): MessageType;

    static txSet(): MessageType;

    static transaction(): MessageType;

    static getScpQuorumset(): MessageType;

    static scpQuorumset(): MessageType;

    static scpMessage(): MessageType;

    static getScpState(): MessageType;

    static hello(): MessageType;

    static surveyRequest(): MessageType;

    static surveyResponse(): MessageType;
  }

  class DontHave {
    constructor(attributes: { type: MessageType; reqHash: Uint256 });

    type(value?: MessageType): MessageType;

    reqHash(value?: Uint256): Uint256;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): DontHave;

    static write(value: DontHave, io: Buffer): void;

    static isValid(value: DontHave): boolean;

    static toXDR(value: DontHave): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): DontHave;

    static fromXDR(input: string, format: 'hex' | 'base64'): DontHave;
  }

  class SurveyMessageCommandType {
    readonly name: 'surveyTopology';

    readonly value: 0;

    static surveyTopology(): SurveyMessageCommandType;
  }

  class SurveyRequestMessage {
    constructor(attributes: {
      surveyorPeerId: NodeId;
      surveyedPeerId: NodeId;
      ledgerNum: Uint32;
      encryptionKey: Curve25519Public;
      commandType: SurveyMessageCommandType;
    });

    surveyorPeerId(value?: NodeId): NodeId;

    surveyedPeerId(value?: NodeId): NodeId;

    ledgerNum(value?: Uint32): Uint32;

    encryptionKey(value?: Curve25519Public): Curve25519Public;

    commandType(value?: SurveyMessageCommandType): SurveyMessageCommandType;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SurveyRequestMessage;

    static write(value: SurveyRequestMessage, io: Buffer): void;

    static isValid(value: SurveyRequestMessage): boolean;

    static toXDR(value: SurveyRequestMessage): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SurveyRequestMessage;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): SurveyRequestMessage;
  }

  class SignedSurveyRequestMessage {
    constructor(attributes: {
      requestSignature: Signature;
      request: SurveyRequestMessage;
    });

    requestSignature(value?: Signature): Signature;

    request(value?: SurveyRequestMessage): SurveyRequestMessage;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SignedSurveyRequestMessage;

    static write(value: SignedSurveyRequestMessage, io: Buffer): void;

    static isValid(value: SignedSurveyRequestMessage): boolean;

    static toXDR(value: SignedSurveyRequestMessage): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SignedSurveyRequestMessage;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): SignedSurveyRequestMessage;
  }

  type EncryptedBody = Buffer;

  class SurveyResponseMessage {
    constructor(attributes: {
      surveyorPeerId: NodeId;
      surveyedPeerId: NodeId;
      ledgerNum: Uint32;
      commandType: SurveyMessageCommandType;
      encryptedBody: EncryptedBody;
    });

    surveyorPeerId(value?: NodeId): NodeId;

    surveyedPeerId(value?: NodeId): NodeId;

    ledgerNum(value?: Uint32): Uint32;

    commandType(value?: SurveyMessageCommandType): SurveyMessageCommandType;

    encryptedBody(value?: EncryptedBody): EncryptedBody;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SurveyResponseMessage;

    static write(value: SurveyResponseMessage, io: Buffer): void;

    static isValid(value: SurveyResponseMessage): boolean;

    static toXDR(value: SurveyResponseMessage): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SurveyResponseMessage;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): SurveyResponseMessage;
  }

  class SignedSurveyResponseMessage {
    constructor(attributes: {
      responseSignature: Signature;
      response: SurveyResponseMessage;
    });

    responseSignature(value?: Signature): Signature;

    response(value?: SurveyResponseMessage): SurveyResponseMessage;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SignedSurveyResponseMessage;

    static write(value: SignedSurveyResponseMessage, io: Buffer): void;

    static isValid(value: SignedSurveyResponseMessage): boolean;

    static toXDR(value: SignedSurveyResponseMessage): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SignedSurveyResponseMessage;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): SignedSurveyResponseMessage;
  }

  class PeerStats {
    constructor(attributes: {
      id: NodeId;
      versionStr: string | Buffer;
      messagesRead: Uint64;
      messagesWritten: Uint64;
      bytesRead: Uint64;
      bytesWritten: Uint64;
      secondsConnected: Uint64;
      uniqueFloodBytesRecv: Uint64;
      duplicateFloodBytesRecv: Uint64;
      uniqueFetchBytesRecv: Uint64;
      duplicateFetchBytesRecv: Uint64;
      uniqueFloodMessageRecv: Uint64;
      duplicateFloodMessageRecv: Uint64;
      uniqueFetchMessageRecv: Uint64;
      duplicateFetchMessageRecv: Uint64;
    });

    id(value?: NodeId): NodeId;

    versionStr(value?: string | Buffer): string | Buffer;

    messagesRead(value?: Uint64): Uint64;

    messagesWritten(value?: Uint64): Uint64;

    bytesRead(value?: Uint64): Uint64;

    bytesWritten(value?: Uint64): Uint64;

    secondsConnected(value?: Uint64): Uint64;

    uniqueFloodBytesRecv(value?: Uint64): Uint64;

    duplicateFloodBytesRecv(value?: Uint64): Uint64;

    uniqueFetchBytesRecv(value?: Uint64): Uint64;

    duplicateFetchBytesRecv(value?: Uint64): Uint64;

    uniqueFloodMessageRecv(value?: Uint64): Uint64;

    duplicateFloodMessageRecv(value?: Uint64): Uint64;

    uniqueFetchMessageRecv(value?: Uint64): Uint64;

    duplicateFetchMessageRecv(value?: Uint64): Uint64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PeerStats;

    static write(value: PeerStats, io: Buffer): void;

    static isValid(value: PeerStats): boolean;

    static toXDR(value: PeerStats): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PeerStats;

    static fromXDR(input: string, format: 'hex' | 'base64'): PeerStats;
  }

  type PeerStatList = PeerStats[];

  class TopologyResponseBody {
    constructor(attributes: {
      inboundPeers: PeerStatList;
      outboundPeers: PeerStatList;
      totalInboundPeerCount: Uint32;
      totalOutboundPeerCount: Uint32;
    });

    inboundPeers(value?: PeerStatList): PeerStatList;

    outboundPeers(value?: PeerStatList): PeerStatList;

    totalInboundPeerCount(value?: Uint32): Uint32;

    totalOutboundPeerCount(value?: Uint32): Uint32;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TopologyResponseBody;

    static write(value: TopologyResponseBody, io: Buffer): void;

    static isValid(value: TopologyResponseBody): boolean;

    static toXDR(value: TopologyResponseBody): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TopologyResponseBody;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TopologyResponseBody;
  }

  class SurveyResponseBody {
    switch(): SurveyMessageCommandType;

    topologyResponseBody(value?: TopologyResponseBody): TopologyResponseBody;

    value(): TopologyResponseBody;

    static surveyTopology(value: TopologyResponseBody): SurveyResponseBody;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SurveyResponseBody;

    static write(value: SurveyResponseBody, io: Buffer): void;

    static isValid(value: SurveyResponseBody): boolean;

    static toXDR(value: SurveyResponseBody): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SurveyResponseBody;

    static fromXDR(input: string, format: 'hex' | 'base64'): SurveyResponseBody;
  }

  class StellarMessage {
    switch(): MessageType;

    error(value?: Error): Error;

    hello(value?: Hello): Hello;

    auth(value?: Auth): Auth;

    dontHave(value?: DontHave): DontHave;

    peers(value?: PeerAddress[]): PeerAddress[];

    txSetHash(value?: Uint256): Uint256;

    txSet(value?: TransactionSet): TransactionSet;

    transaction(value?: TransactionEnvelope): TransactionEnvelope;

    signedSurveyRequestMessage(
      value?: SignedSurveyRequestMessage
    ): SignedSurveyRequestMessage;

    signedSurveyResponseMessage(
      value?: SignedSurveyResponseMessage
    ): SignedSurveyResponseMessage;

    qSetHash(value?: Uint256): Uint256;

    qSet(value?: ScpQuorumSet): ScpQuorumSet;

    envelope(value?: ScpEnvelope): ScpEnvelope;

    getScpLedgerSeq(value?: Uint32): Uint32;

    value():
      | Error
      | Hello
      | Auth
      | DontHave
      | PeerAddress[]
      | Uint256
      | TransactionSet
      | TransactionEnvelope
      | SignedSurveyRequestMessage
      | SignedSurveyResponseMessage
      | Uint256
      | ScpQuorumSet
      | ScpEnvelope
      | Uint32;

    static errorMsg(value: Error): StellarMessage;

    static hello(value: Hello): StellarMessage;

    static auth(value: Auth): StellarMessage;

    static dontHave(value: DontHave): StellarMessage;

    static peer(value: PeerAddress[]): StellarMessage;

    static getTxSet(value: Uint256): StellarMessage;

    static txSet(value: TransactionSet): StellarMessage;

    static transaction(value: TransactionEnvelope): StellarMessage;

    static surveyRequest(value: SignedSurveyRequestMessage): StellarMessage;

    static surveyResponse(value: SignedSurveyResponseMessage): StellarMessage;

    static getScpQuorumset(value: Uint256): StellarMessage;

    static scpQuorumset(value: ScpQuorumSet): StellarMessage;

    static scpMessage(value: ScpEnvelope): StellarMessage;

    static getScpState(value: Uint32): StellarMessage;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): StellarMessage;

    static write(value: StellarMessage, io: Buffer): void;

    static isValid(value: StellarMessage): boolean;

    static toXDR(value: StellarMessage): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): StellarMessage;

    static fromXDR(input: string, format: 'hex' | 'base64'): StellarMessage;
  }

  class AuthenticatedMessageV0 {
    constructor(attributes: {
      sequence: Uint64;
      message: StellarMessage;
      mac: HmacSha256Mac;
    });

    sequence(value?: Uint64): Uint64;

    message(value?: StellarMessage): StellarMessage;

    mac(value?: HmacSha256Mac): HmacSha256Mac;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AuthenticatedMessageV0;

    static write(value: AuthenticatedMessageV0, io: Buffer): void;

    static isValid(value: AuthenticatedMessageV0): boolean;

    static toXDR(value: AuthenticatedMessageV0): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AuthenticatedMessageV0;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): AuthenticatedMessageV0;
  }

  class AuthenticatedMessage {
    switch(): Uint32;

    v0(value?: AuthenticatedMessageV0): AuthenticatedMessageV0;

    value(): AuthenticatedMessageV0;

    static 0(value: AuthenticatedMessageV0): AuthenticatedMessage;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AuthenticatedMessage;

    static write(value: AuthenticatedMessage, io: Buffer): void;

    static isValid(value: AuthenticatedMessage): boolean;

    static toXDR(value: AuthenticatedMessage): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AuthenticatedMessage;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): AuthenticatedMessage;
  }

  type Hash = Buffer;

  type Uint256 = Buffer;

  type Uint32 = number;

  type Int32 = number;

  class Uint64 extends UnsignedHyper {
  }

  class Int64 extends Hyper {
  }

  class CryptoKeyType {
    readonly name:
      | 'keyTypeEd25519'
      | 'keyTypePreAuthTx'
      | 'keyTypeHashX'
      | 'keyTypeMuxedEd25519';

    readonly value: 0 | 1 | 2 | 256;

    static keyTypeEd25519(): CryptoKeyType;

    static keyTypePreAuthTx(): CryptoKeyType;

    static keyTypeHashX(): CryptoKeyType;

    static keyTypeMuxedEd25519(): CryptoKeyType;
  }

  class PublicKeyType {
    readonly name: 'publicKeyTypeEd25519';

    readonly value: 0;

    static publicKeyTypeEd25519(): PublicKeyType;
  }

  class SignerKeyType {
    readonly name:
      | 'signerKeyTypeEd25519'
      | 'signerKeyTypePreAuthTx'
      | 'signerKeyTypeHashX';

    readonly value: 0 | 1 | 2;

    static signerKeyTypeEd25519(): SignerKeyType;

    static signerKeyTypePreAuthTx(): SignerKeyType;

    static signerKeyTypeHashX(): SignerKeyType;
  }

  class PublicKey {
    switch(): PublicKeyType;

    ed25519(value?: Uint256): Uint256;

    value(): Uint256;

    static publicKeyTypeEd25519(value: Uint256): PublicKey;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PublicKey;

    static write(value: PublicKey, io: Buffer): void;

    static isValid(value: PublicKey): boolean;

    static toXDR(value: PublicKey): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PublicKey;

    static fromXDR(input: string, format: 'hex' | 'base64'): PublicKey;
  }

  class SignerKey {
    switch(): SignerKeyType;

    ed25519(value?: Uint256): Uint256;

    preAuthTx(value?: Uint256): Uint256;

    hashX(value?: Uint256): Uint256;

    value(): Uint256 | Uint256 | Uint256;

    static signerKeyTypeEd25519(value: Uint256): SignerKey;

    static signerKeyTypePreAuthTx(value: Uint256): SignerKey;

    static signerKeyTypeHashX(value: Uint256): SignerKey;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SignerKey;

    static write(value: SignerKey, io: Buffer): void;

    static isValid(value: SignerKey): boolean;

    static toXDR(value: SignerKey): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SignerKey;

    static fromXDR(input: string, format: 'hex' | 'base64'): SignerKey;
  }

  type Signature = Buffer;

  type SignatureHint = Buffer;

  type NodeId = PublicKey;

  class Curve25519Secret {
    constructor(attributes: { key: Buffer });

    key(value?: Buffer): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Curve25519Secret;

    static write(value: Curve25519Secret, io: Buffer): void;

    static isValid(value: Curve25519Secret): boolean;

    static toXDR(value: Curve25519Secret): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Curve25519Secret;

    static fromXDR(input: string, format: 'hex' | 'base64'): Curve25519Secret;
  }

  class Curve25519Public {
    constructor(attributes: { key: Buffer });

    key(value?: Buffer): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Curve25519Public;

    static write(value: Curve25519Public, io: Buffer): void;

    static isValid(value: Curve25519Public): boolean;

    static toXDR(value: Curve25519Public): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Curve25519Public;

    static fromXDR(input: string, format: 'hex' | 'base64'): Curve25519Public;
  }

  class HmacSha256Key {
    constructor(attributes: { key: Buffer });

    key(value?: Buffer): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): HmacSha256Key;

    static write(value: HmacSha256Key, io: Buffer): void;

    static isValid(value: HmacSha256Key): boolean;

    static toXDR(value: HmacSha256Key): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): HmacSha256Key;

    static fromXDR(input: string, format: 'hex' | 'base64'): HmacSha256Key;
  }

  class HmacSha256Mac {
    constructor(attributes: { mac: Buffer });

    mac(value?: Buffer): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): HmacSha256Mac;

    static write(value: HmacSha256Mac, io: Buffer): void;

    static isValid(value: HmacSha256Mac): boolean;

    static toXDR(value: HmacSha256Mac): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): HmacSha256Mac;

    static fromXDR(input: string, format: 'hex' | 'base64'): HmacSha256Mac;
  }

  class MuxedAccountMed25519 {
    constructor(attributes: { id: Uint64; ed25519: Uint256 });

    id(value?: Uint64): Uint64;

    ed25519(value?: Uint256): Uint256;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): MuxedAccountMed25519;

    static write(value: MuxedAccountMed25519, io: Buffer): void;

    static isValid(value: MuxedAccountMed25519): boolean;

    static toXDR(value: MuxedAccountMed25519): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): MuxedAccountMed25519;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): MuxedAccountMed25519;
  }

  class MuxedAccount {
    switch(): CryptoKeyType;

    ed25519(value?: Uint256): Uint256;

    med25519(value?: MuxedAccountMed25519): MuxedAccountMed25519;

    value(): Uint256 | MuxedAccountMed25519;

    static keyTypeEd25519(value: Uint256): MuxedAccount;

    static keyTypeMuxedEd25519(value: MuxedAccountMed25519): MuxedAccount;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): MuxedAccount;

    static write(value: MuxedAccount, io: Buffer): void;

    static isValid(value: MuxedAccount): boolean;

    static toXDR(value: MuxedAccount): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): MuxedAccount;

    static fromXDR(input: string, format: 'hex' | 'base64'): MuxedAccount;
  }

  class DecoratedSignature {
    constructor(attributes: { hint: SignatureHint; signature: Signature });

    hint(value?: SignatureHint): SignatureHint;

    signature(value?: Signature): Signature;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): DecoratedSignature;

    static write(value: DecoratedSignature, io: Buffer): void;

    static isValid(value: DecoratedSignature): boolean;

    static toXDR(value: DecoratedSignature): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): DecoratedSignature;

    static fromXDR(input: string, format: 'hex' | 'base64'): DecoratedSignature;
  }

  class OperationType {
    readonly name:
      | 'createAccount'
      | 'payment'
      | 'pathPaymentStrictReceive'
      | 'manageSellOffer'
      | 'createPassiveSellOffer'
      | 'setOption'
      | 'changeTrust'
      | 'allowTrust'
      | 'accountMerge'
      | 'inflation'
      | 'manageDatum'
      | 'bumpSequence'
      | 'manageBuyOffer'
      | 'pathPaymentStrictSend';

    readonly value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

    static createAccount(): OperationType;

    static payment(): OperationType;

    static pathPaymentStrictReceive(): OperationType;

    static manageSellOffer(): OperationType;

    static createPassiveSellOffer(): OperationType;

    static setOption(): OperationType;

    static changeTrust(): OperationType;

    static allowTrust(): OperationType;

    static accountMerge(): OperationType;

    static inflation(): OperationType;

    static manageDatum(): OperationType;

    static bumpSequence(): OperationType;

    static manageBuyOffer(): OperationType;

    static pathPaymentStrictSend(): OperationType;
  }

  class CreateAccountOp {
    constructor(attributes: { destination: AccountId; startingBalance: Int64 });

    destination(value?: AccountId): AccountId;

    startingBalance(value?: Int64): Int64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): CreateAccountOp;

    static write(value: CreateAccountOp, io: Buffer): void;

    static isValid(value: CreateAccountOp): boolean;

    static toXDR(value: CreateAccountOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): CreateAccountOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): CreateAccountOp;
  }

  class PaymentOp {
    constructor(attributes: {
      destination: MuxedAccount;
      asset: Asset;
      amount: Int64;
    });

    destination(value?: MuxedAccount): MuxedAccount;

    asset(value?: Asset): Asset;

    amount(value?: Int64): Int64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PaymentOp;

    static write(value: PaymentOp, io: Buffer): void;

    static isValid(value: PaymentOp): boolean;

    static toXDR(value: PaymentOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PaymentOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): PaymentOp;
  }

  class PathPaymentStrictReceiveOp {
    constructor(attributes: {
      sendAsset: Asset;
      sendMax: Int64;
      destination: MuxedAccount;
      destAsset: Asset;
      destAmount: Int64;
      path: Asset[];
    });

    sendAsset(value?: Asset): Asset;

    sendMax(value?: Int64): Int64;

    destination(value?: MuxedAccount): MuxedAccount;

    destAsset(value?: Asset): Asset;

    destAmount(value?: Int64): Int64;

    path(value?: Asset[]): Asset[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PathPaymentStrictReceiveOp;

    static write(value: PathPaymentStrictReceiveOp, io: Buffer): void;

    static isValid(value: PathPaymentStrictReceiveOp): boolean;

    static toXDR(value: PathPaymentStrictReceiveOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PathPaymentStrictReceiveOp;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): PathPaymentStrictReceiveOp;
  }

  class PathPaymentStrictSendOp {
    constructor(attributes: {
      sendAsset: Asset;
      sendAmount: Int64;
      destination: MuxedAccount;
      destAsset: Asset;
      destMin: Int64;
      path: Asset[];
    });

    sendAsset(value?: Asset): Asset;

    sendAmount(value?: Int64): Int64;

    destination(value?: MuxedAccount): MuxedAccount;

    destAsset(value?: Asset): Asset;

    destMin(value?: Int64): Int64;

    path(value?: Asset[]): Asset[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PathPaymentStrictSendOp;

    static write(value: PathPaymentStrictSendOp, io: Buffer): void;

    static isValid(value: PathPaymentStrictSendOp): boolean;

    static toXDR(value: PathPaymentStrictSendOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PathPaymentStrictSendOp;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): PathPaymentStrictSendOp;
  }

  class ManageSellOfferOp {
    constructor(attributes: {
      selling: Asset;
      buying: Asset;
      amount: Int64;
      price: Price;
      offerId: Int64;
    });

    selling(value?: Asset): Asset;

    buying(value?: Asset): Asset;

    amount(value?: Int64): Int64;

    price(value?: Price): Price;

    offerId(value?: Int64): Int64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ManageSellOfferOp;

    static write(value: ManageSellOfferOp, io: Buffer): void;

    static isValid(value: ManageSellOfferOp): boolean;

    static toXDR(value: ManageSellOfferOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ManageSellOfferOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): ManageSellOfferOp;
  }

  class ManageBuyOfferOp {
    constructor(attributes: {
      selling: Asset;
      buying: Asset;
      buyAmount: Int64;
      price: Price;
      offerId: Int64;
    });

    selling(value?: Asset): Asset;

    buying(value?: Asset): Asset;

    buyAmount(value?: Int64): Int64;

    price(value?: Price): Price;

    offerId(value?: Int64): Int64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ManageBuyOfferOp;

    static write(value: ManageBuyOfferOp, io: Buffer): void;

    static isValid(value: ManageBuyOfferOp): boolean;

    static toXDR(value: ManageBuyOfferOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ManageBuyOfferOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): ManageBuyOfferOp;
  }

  class CreatePassiveSellOfferOp {
    constructor(attributes: {
      selling: Asset;
      buying: Asset;
      amount: Int64;
      price: Price;
    });

    selling(value?: Asset): Asset;

    buying(value?: Asset): Asset;

    amount(value?: Int64): Int64;

    price(value?: Price): Price;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): CreatePassiveSellOfferOp;

    static write(value: CreatePassiveSellOfferOp, io: Buffer): void;

    static isValid(value: CreatePassiveSellOfferOp): boolean;

    static toXDR(value: CreatePassiveSellOfferOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): CreatePassiveSellOfferOp;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): CreatePassiveSellOfferOp;
  }

  class SetOptionsOp {
    constructor(attributes: {
      inflationDest: null | AccountId;
      clearFlags: null | Uint32;
      setFlags: null | Uint32;
      masterWeight: null | Uint32;
      lowThreshold: null | Uint32;
      medThreshold: null | Uint32;
      highThreshold: null | Uint32;
      homeDomain: null | String32;
      signer: null | Signer;
    });

    inflationDest(value?: null | AccountId): null | AccountId;

    clearFlags(value?: null | Uint32): null | Uint32;

    setFlags(value?: null | Uint32): null | Uint32;

    masterWeight(value?: null | Uint32): null | Uint32;

    lowThreshold(value?: null | Uint32): null | Uint32;

    medThreshold(value?: null | Uint32): null | Uint32;

    highThreshold(value?: null | Uint32): null | Uint32;

    homeDomain(value?: null | String32): null | String32;

    signer(value?: null | Signer): null | Signer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SetOptionsOp;

    static write(value: SetOptionsOp, io: Buffer): void;

    static isValid(value: SetOptionsOp): boolean;

    static toXDR(value: SetOptionsOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SetOptionsOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): SetOptionsOp;
  }

  class ChangeTrustOp {
    constructor(attributes: { line: Asset; limit: Int64 });

    line(value?: Asset): Asset;

    limit(value?: Int64): Int64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ChangeTrustOp;

    static write(value: ChangeTrustOp, io: Buffer): void;

    static isValid(value: ChangeTrustOp): boolean;

    static toXDR(value: ChangeTrustOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ChangeTrustOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): ChangeTrustOp;
  }

  class AllowTrustOpAsset {
    switch(): AssetType;

    assetCode4(value?: AssetCode4): AssetCode4;

    assetCode12(value?: AssetCode12): AssetCode12;

    value(): AssetCode4 | AssetCode12;

    static assetTypeCreditAlphanum4(value: AssetCode4): AllowTrustOpAsset;

    static assetTypeCreditAlphanum12(value: AssetCode12): AllowTrustOpAsset;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AllowTrustOpAsset;

    static write(value: AllowTrustOpAsset, io: Buffer): void;

    static isValid(value: AllowTrustOpAsset): boolean;

    static toXDR(value: AllowTrustOpAsset): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AllowTrustOpAsset;

    static fromXDR(input: string, format: 'hex' | 'base64'): AllowTrustOpAsset;
  }

  class AllowTrustOp {
    constructor(attributes: {
      trustor: AccountId;
      asset: AllowTrustOpAsset;
      authorize: Uint32;
    });

    trustor(value?: AccountId): AccountId;

    asset(value?: AllowTrustOpAsset): AllowTrustOpAsset;

    authorize(value?: Uint32): Uint32;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AllowTrustOp;

    static write(value: AllowTrustOp, io: Buffer): void;

    static isValid(value: AllowTrustOp): boolean;

    static toXDR(value: AllowTrustOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AllowTrustOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): AllowTrustOp;
  }

  class ManageDataOp {
    constructor(attributes: {
      dataName: String64;
      dataValue: null | DataValue;
    });

    dataName(value?: String64): String64;

    dataValue(value?: null | DataValue): null | DataValue;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ManageDataOp;

    static write(value: ManageDataOp, io: Buffer): void;

    static isValid(value: ManageDataOp): boolean;

    static toXDR(value: ManageDataOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ManageDataOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): ManageDataOp;
  }

  class BumpSequenceOp {
    constructor(attributes: { bumpTo: SequenceNumber });

    bumpTo(value?: SequenceNumber): SequenceNumber;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): BumpSequenceOp;

    static write(value: BumpSequenceOp, io: Buffer): void;

    static isValid(value: BumpSequenceOp): boolean;

    static toXDR(value: BumpSequenceOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): BumpSequenceOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): BumpSequenceOp;
  }

  class OperationBody {
    switch(): OperationType;

    createAccountOp(value?: CreateAccountOp): CreateAccountOp;

    paymentOp(value?: PaymentOp): PaymentOp;

    pathPaymentStrictReceiveOp(
      value?: PathPaymentStrictReceiveOp
    ): PathPaymentStrictReceiveOp;

    manageSellOfferOp(value?: ManageSellOfferOp): ManageSellOfferOp;

    createPassiveSellOfferOp(
      value?: CreatePassiveSellOfferOp
    ): CreatePassiveSellOfferOp;

    setOptionsOp(value?: SetOptionsOp): SetOptionsOp;

    changeTrustOp(value?: ChangeTrustOp): ChangeTrustOp;

    allowTrustOp(value?: AllowTrustOp): AllowTrustOp;

    destination(value?: MuxedAccount): MuxedAccount;

    manageDataOp(value?: ManageDataOp): ManageDataOp;

    bumpSequenceOp(value?: BumpSequenceOp): BumpSequenceOp;

    manageBuyOfferOp(value?: ManageBuyOfferOp): ManageBuyOfferOp;

    pathPaymentStrictSendOp(
      value?: PathPaymentStrictSendOp
    ): PathPaymentStrictSendOp;

    value():
      | CreateAccountOp
      | PaymentOp
      | PathPaymentStrictReceiveOp
      | ManageSellOfferOp
      | CreatePassiveSellOfferOp
      | SetOptionsOp
      | ChangeTrustOp
      | AllowTrustOp
      | MuxedAccount
      | ManageDataOp
      | BumpSequenceOp
      | ManageBuyOfferOp
      | PathPaymentStrictSendOp;

    static createAccount(value: CreateAccountOp): OperationBody;

    static payment(value: PaymentOp): OperationBody;

    static pathPaymentStrictReceive(
      value: PathPaymentStrictReceiveOp
    ): OperationBody;

    static manageSellOffer(value: ManageSellOfferOp): OperationBody;

    static createPassiveSellOffer(
      value: CreatePassiveSellOfferOp
    ): OperationBody;

    static setOption(value: SetOptionsOp): OperationBody;

    static changeTrust(value: ChangeTrustOp): OperationBody;

    static allowTrust(value: AllowTrustOp): OperationBody;

    static accountMerge(value: MuxedAccount): OperationBody;

    static manageDatum(value: ManageDataOp): OperationBody;

    static bumpSequence(value: BumpSequenceOp): OperationBody;

    static manageBuyOffer(value: ManageBuyOfferOp): OperationBody;

    static pathPaymentStrictSend(value: PathPaymentStrictSendOp): OperationBody;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OperationBody;

    static write(value: OperationBody, io: Buffer): void;

    static isValid(value: OperationBody): boolean;

    static toXDR(value: OperationBody): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OperationBody;

    static fromXDR(input: string, format: 'hex' | 'base64'): OperationBody;
  }

  class MemoType {
    readonly name:
      | 'memoNone'
      | 'memoText'
      | 'memoId'
      | 'memoHash'
      | 'memoReturn';

    readonly value: 0 | 1 | 2 | 3 | 4;

    static memoNone(): MemoType;

    static memoText(): MemoType;

    static memoId(): MemoType;

    static memoHash(): MemoType;

    static memoReturn(): MemoType;
  }

  class Memo {
    switch(): MemoType;

    text(value?: string | Buffer): string | Buffer;

    id(value?: Uint64): Uint64;

    hash(value?: Hash): Hash;

    retHash(value?: Hash): Hash;

    value(): string | Buffer | Uint64 | Hash | Hash;

    static memoText(value: string | Buffer): Memo;

    static memoId(value: Uint64): Memo;

    static memoHash(value: Hash): Memo;

    static memoReturn(value: Hash): Memo;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Memo;

    static write(value: Memo, io: Buffer): void;

    static isValid(value: Memo): boolean;

    static toXDR(value: Memo): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Memo;

    static fromXDR(input: string, format: 'hex' | 'base64'): Memo;
  }

  class TimeBounds {
    constructor(attributes: { minTime: TimePoint; maxTime: TimePoint });

    minTime(value?: TimePoint): TimePoint;

    maxTime(value?: TimePoint): TimePoint;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TimeBounds;

    static write(value: TimeBounds, io: Buffer): void;

    static isValid(value: TimeBounds): boolean;

    static toXDR(value: TimeBounds): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TimeBounds;

    static fromXDR(input: string, format: 'hex' | 'base64'): TimeBounds;
  }

  class TransactionV0Ext {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionV0Ext;

    static write(value: TransactionV0Ext, io: Buffer): void;

    static isValid(value: TransactionV0Ext): boolean;

    static toXDR(value: TransactionV0Ext): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionV0Ext;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionV0Ext;
  }

  class TransactionV0 {
    constructor(attributes: {
      sourceAccountEd25519: Uint256;
      fee: Uint32;
      seqNum: SequenceNumber;
      timeBounds: null | TimeBounds;
      memo: Memo;
      operations: Operation[];
      ext: TransactionV0Ext;
    });

    sourceAccountEd25519(value?: Uint256): Uint256;

    fee(value?: Uint32): Uint32;

    seqNum(value?: SequenceNumber): SequenceNumber;

    timeBounds(value?: null | TimeBounds): null | TimeBounds;

    memo(value?: Memo): Memo;

    operations(value?: Operation[]): Operation[];

    ext(value?: TransactionV0Ext): TransactionV0Ext;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionV0;

    static write(value: TransactionV0, io: Buffer): void;

    static isValid(value: TransactionV0): boolean;

    static toXDR(value: TransactionV0): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionV0;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionV0;
  }

  class TransactionV0Envelope {
    constructor(attributes: {
      tx: TransactionV0;
      signatures: DecoratedSignature[];
    });

    tx(value?: TransactionV0): TransactionV0;

    signatures(value?: DecoratedSignature[]): DecoratedSignature[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionV0Envelope;

    static write(value: TransactionV0Envelope, io: Buffer): void;

    static isValid(value: TransactionV0Envelope): boolean;

    static toXDR(value: TransactionV0Envelope): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionV0Envelope;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionV0Envelope;
  }

  class TransactionExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionExt;

    static write(value: TransactionExt, io: Buffer): void;

    static isValid(value: TransactionExt): boolean;

    static toXDR(value: TransactionExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionExt;
  }

  class Transaction {
    constructor(attributes: {
      sourceAccount: MuxedAccount;
      fee: Uint32;
      seqNum: SequenceNumber;
      timeBounds: null | TimeBounds;
      memo: Memo;
      operations: Operation[];
      ext: TransactionExt;
    });

    sourceAccount(value?: MuxedAccount): MuxedAccount;

    fee(value?: Uint32): Uint32;

    seqNum(value?: SequenceNumber): SequenceNumber;

    timeBounds(value?: null | TimeBounds): null | TimeBounds;

    memo(value?: Memo): Memo;

    operations(value?: Operation[]): Operation[];

    ext(value?: TransactionExt): TransactionExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Transaction;

    static write(value: Transaction, io: Buffer): void;

    static isValid(value: Transaction): boolean;

    static toXDR(value: Transaction): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Transaction;

    static fromXDR(input: string, format: 'hex' | 'base64'): Transaction;
  }

  class TransactionV1Envelope {
    constructor(attributes: {
      tx: Transaction;
      signatures: DecoratedSignature[];
    });

    tx(value?: Transaction): Transaction;

    signatures(value?: DecoratedSignature[]): DecoratedSignature[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionV1Envelope;

    static write(value: TransactionV1Envelope, io: Buffer): void;

    static isValid(value: TransactionV1Envelope): boolean;

    static toXDR(value: TransactionV1Envelope): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionV1Envelope;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionV1Envelope;
  }

  class FeeBumpTransactionInnerTx {
    switch(): EnvelopeType;

    v1(value?: TransactionV1Envelope): TransactionV1Envelope;

    value(): TransactionV1Envelope;

    static envelopeTypeTx(
      value: TransactionV1Envelope
    ): FeeBumpTransactionInnerTx;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): FeeBumpTransactionInnerTx;

    static write(value: FeeBumpTransactionInnerTx, io: Buffer): void;

    static isValid(value: FeeBumpTransactionInnerTx): boolean;

    static toXDR(value: FeeBumpTransactionInnerTx): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): FeeBumpTransactionInnerTx;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): FeeBumpTransactionInnerTx;
  }

  class FeeBumpTransactionExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): FeeBumpTransactionExt;

    static write(value: FeeBumpTransactionExt, io: Buffer): void;

    static isValid(value: FeeBumpTransactionExt): boolean;

    static toXDR(value: FeeBumpTransactionExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): FeeBumpTransactionExt;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): FeeBumpTransactionExt;
  }

  class FeeBumpTransaction {
    constructor(attributes: {
      feeSource: MuxedAccount;
      fee: Int64;
      innerTx: FeeBumpTransactionInnerTx;
      ext: FeeBumpTransactionExt;
    });

    feeSource(value?: MuxedAccount): MuxedAccount;

    fee(value?: Int64): Int64;

    innerTx(value?: FeeBumpTransactionInnerTx): FeeBumpTransactionInnerTx;

    ext(value?: FeeBumpTransactionExt): FeeBumpTransactionExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): FeeBumpTransaction;

    static write(value: FeeBumpTransaction, io: Buffer): void;

    static isValid(value: FeeBumpTransaction): boolean;

    static toXDR(value: FeeBumpTransaction): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): FeeBumpTransaction;

    static fromXDR(input: string, format: 'hex' | 'base64'): FeeBumpTransaction;
  }

  class FeeBumpTransactionEnvelope {
    constructor(attributes: {
      tx: FeeBumpTransaction;
      signatures: DecoratedSignature[];
    });

    tx(value?: FeeBumpTransaction): FeeBumpTransaction;

    signatures(value?: DecoratedSignature[]): DecoratedSignature[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): FeeBumpTransactionEnvelope;

    static write(value: FeeBumpTransactionEnvelope, io: Buffer): void;

    static isValid(value: FeeBumpTransactionEnvelope): boolean;

    static toXDR(value: FeeBumpTransactionEnvelope): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): FeeBumpTransactionEnvelope;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): FeeBumpTransactionEnvelope;
  }

  class TransactionEnvelope {
    switch(): EnvelopeType;

    v0(value?: TransactionV0Envelope): TransactionV0Envelope;

    v1(value?: TransactionV1Envelope): TransactionV1Envelope;

    feeBump(value?: FeeBumpTransactionEnvelope): FeeBumpTransactionEnvelope;

    value():
      | TransactionV0Envelope
      | TransactionV1Envelope
      | FeeBumpTransactionEnvelope;

    static envelopeTypeTxV0(value: TransactionV0Envelope): TransactionEnvelope;

    static envelopeTypeTx(value: TransactionV1Envelope): TransactionEnvelope;

    static envelopeTypeTxFeeBump(
      value: FeeBumpTransactionEnvelope
    ): TransactionEnvelope;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionEnvelope;

    static write(value: TransactionEnvelope, io: Buffer): void;

    static isValid(value: TransactionEnvelope): boolean;

    static toXDR(value: TransactionEnvelope): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionEnvelope;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionEnvelope;
  }

  class TransactionSignaturePayloadTaggedTransaction {
    switch(): EnvelopeType;

    tx(value?: Transaction): Transaction;

    feeBump(value?: FeeBumpTransaction): FeeBumpTransaction;

    value(): Transaction | FeeBumpTransaction;

    static envelopeTypeTx(
      value: Transaction
    ): TransactionSignaturePayloadTaggedTransaction;

    static envelopeTypeTxFeeBump(
      value: FeeBumpTransaction
    ): TransactionSignaturePayloadTaggedTransaction;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionSignaturePayloadTaggedTransaction;

    static write(
      value: TransactionSignaturePayloadTaggedTransaction,
      io: Buffer
    ): void;

    static isValid(
      value: TransactionSignaturePayloadTaggedTransaction
    ): boolean;

    static toXDR(value: TransactionSignaturePayloadTaggedTransaction): Buffer;

    static fromXDR(
      input: Buffer,
      format?: 'raw'
    ): TransactionSignaturePayloadTaggedTransaction;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionSignaturePayloadTaggedTransaction;
  }

  class TransactionSignaturePayload {
    constructor(attributes: {
      networkId: Hash;
      taggedTransaction: TransactionSignaturePayloadTaggedTransaction;
    });

    networkId(value?: Hash): Hash;

    taggedTransaction(
      value?: TransactionSignaturePayloadTaggedTransaction
    ): TransactionSignaturePayloadTaggedTransaction;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionSignaturePayload;

    static write(value: TransactionSignaturePayload, io: Buffer): void;

    static isValid(value: TransactionSignaturePayload): boolean;

    static toXDR(value: TransactionSignaturePayload): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionSignaturePayload;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionSignaturePayload;
  }

  class ClaimOfferAtom {
    constructor(attributes: {
      sellerId: AccountId;
      offerId: Int64;
      assetSold: Asset;
      amountSold: Int64;
      assetBought: Asset;
      amountBought: Int64;
    });

    sellerId(value?: AccountId): AccountId;

    offerId(value?: Int64): Int64;

    assetSold(value?: Asset): Asset;

    amountSold(value?: Int64): Int64;

    assetBought(value?: Asset): Asset;

    amountBought(value?: Int64): Int64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ClaimOfferAtom;

    static write(value: ClaimOfferAtom, io: Buffer): void;

    static isValid(value: ClaimOfferAtom): boolean;

    static toXDR(value: ClaimOfferAtom): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ClaimOfferAtom;

    static fromXDR(input: string, format: 'hex' | 'base64'): ClaimOfferAtom;
  }

  class CreateAccountResultCode {
    readonly name:
      | 'createAccountSuccess'
      | 'createAccountMalformed'
      | 'createAccountUnderfunded'
      | 'createAccountLowReserve'
      | 'createAccountAlreadyExist';

    readonly value: 0 | -1 | -2 | -3 | -4;

    static createAccountSuccess(): CreateAccountResultCode;

    static createAccountMalformed(): CreateAccountResultCode;

    static createAccountUnderfunded(): CreateAccountResultCode;

    static createAccountLowReserve(): CreateAccountResultCode;

    static createAccountAlreadyExist(): CreateAccountResultCode;
  }

  class CreateAccountResult {
    switch(): CreateAccountResultCode;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): CreateAccountResult;

    static write(value: CreateAccountResult, io: Buffer): void;

    static isValid(value: CreateAccountResult): boolean;

    static toXDR(value: CreateAccountResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): CreateAccountResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): CreateAccountResult;
  }

  class PaymentResultCode {
    readonly name:
      | 'paymentSuccess'
      | 'paymentMalformed'
      | 'paymentUnderfunded'
      | 'paymentSrcNoTrust'
      | 'paymentSrcNotAuthorized'
      | 'paymentNoDestination'
      | 'paymentNoTrust'
      | 'paymentNotAuthorized'
      | 'paymentLineFull'
      | 'paymentNoIssuer';

    readonly value: 0 | -1 | -2 | -3 | -4 | -5 | -6 | -7 | -8 | -9;

    static paymentSuccess(): PaymentResultCode;

    static paymentMalformed(): PaymentResultCode;

    static paymentUnderfunded(): PaymentResultCode;

    static paymentSrcNoTrust(): PaymentResultCode;

    static paymentSrcNotAuthorized(): PaymentResultCode;

    static paymentNoDestination(): PaymentResultCode;

    static paymentNoTrust(): PaymentResultCode;

    static paymentNotAuthorized(): PaymentResultCode;

    static paymentLineFull(): PaymentResultCode;

    static paymentNoIssuer(): PaymentResultCode;
  }

  class PaymentResult {
    switch(): PaymentResultCode;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PaymentResult;

    static write(value: PaymentResult, io: Buffer): void;

    static isValid(value: PaymentResult): boolean;

    static toXDR(value: PaymentResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PaymentResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): PaymentResult;
  }

  class PathPaymentStrictReceiveResultCode {
    readonly name:
      | 'pathPaymentStrictReceiveSuccess'
      | 'pathPaymentStrictReceiveMalformed'
      | 'pathPaymentStrictReceiveUnderfunded'
      | 'pathPaymentStrictReceiveSrcNoTrust'
      | 'pathPaymentStrictReceiveSrcNotAuthorized'
      | 'pathPaymentStrictReceiveNoDestination'
      | 'pathPaymentStrictReceiveNoTrust'
      | 'pathPaymentStrictReceiveNotAuthorized'
      | 'pathPaymentStrictReceiveLineFull'
      | 'pathPaymentStrictReceiveNoIssuer'
      | 'pathPaymentStrictReceiveTooFewOffer'
      | 'pathPaymentStrictReceiveOfferCrossSelf'
      | 'pathPaymentStrictReceiveOverSendmax';

    readonly value:
      | 0
      | -1
      | -2
      | -3
      | -4
      | -5
      | -6
      | -7
      | -8
      | -9
      | -10
      | -11
      | -12;

    static pathPaymentStrictReceiveSuccess(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveMalformed(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveUnderfunded(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveSrcNoTrust(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveSrcNotAuthorized(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveNoDestination(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveNoTrust(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveNotAuthorized(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveLineFull(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveNoIssuer(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveTooFewOffer(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveOfferCrossSelf(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveOverSendmax(): PathPaymentStrictReceiveResultCode;
  }

  class SimplePaymentResult {
    constructor(attributes: {
      destination: AccountId;
      asset: Asset;
      amount: Int64;
    });

    destination(value?: AccountId): AccountId;

    asset(value?: Asset): Asset;

    amount(value?: Int64): Int64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SimplePaymentResult;

    static write(value: SimplePaymentResult, io: Buffer): void;

    static isValid(value: SimplePaymentResult): boolean;

    static toXDR(value: SimplePaymentResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SimplePaymentResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): SimplePaymentResult;
  }

  class PathPaymentStrictReceiveResultSuccess {
    constructor(attributes: {
      offers: ClaimOfferAtom[];
      last: SimplePaymentResult;
    });

    offers(value?: ClaimOfferAtom[]): ClaimOfferAtom[];

    last(value?: SimplePaymentResult): SimplePaymentResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PathPaymentStrictReceiveResultSuccess;

    static write(
      value: PathPaymentStrictReceiveResultSuccess,
      io: Buffer
    ): void;

    static isValid(value: PathPaymentStrictReceiveResultSuccess): boolean;

    static toXDR(value: PathPaymentStrictReceiveResultSuccess): Buffer;

    static fromXDR(
      input: Buffer,
      format?: 'raw'
    ): PathPaymentStrictReceiveResultSuccess;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): PathPaymentStrictReceiveResultSuccess;
  }

  class PathPaymentStrictReceiveResult {
    switch(): PathPaymentStrictReceiveResultCode;

    success(
      value?: PathPaymentStrictReceiveResultSuccess
    ): PathPaymentStrictReceiveResultSuccess;

    noIssuer(value?: Asset): Asset;

    value(): PathPaymentStrictReceiveResultSuccess | Asset;

    static pathPaymentStrictReceiveSuccess(
      value: PathPaymentStrictReceiveResultSuccess
    ): PathPaymentStrictReceiveResult;

    static pathPaymentStrictReceiveNoIssuer(
      value: Asset
    ): PathPaymentStrictReceiveResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PathPaymentStrictReceiveResult;

    static write(value: PathPaymentStrictReceiveResult, io: Buffer): void;

    static isValid(value: PathPaymentStrictReceiveResult): boolean;

    static toXDR(value: PathPaymentStrictReceiveResult): Buffer;

    static fromXDR(
      input: Buffer,
      format?: 'raw'
    ): PathPaymentStrictReceiveResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): PathPaymentStrictReceiveResult;
  }

  class PathPaymentStrictSendResultCode {
    readonly name:
      | 'pathPaymentStrictSendSuccess'
      | 'pathPaymentStrictSendMalformed'
      | 'pathPaymentStrictSendUnderfunded'
      | 'pathPaymentStrictSendSrcNoTrust'
      | 'pathPaymentStrictSendSrcNotAuthorized'
      | 'pathPaymentStrictSendNoDestination'
      | 'pathPaymentStrictSendNoTrust'
      | 'pathPaymentStrictSendNotAuthorized'
      | 'pathPaymentStrictSendLineFull'
      | 'pathPaymentStrictSendNoIssuer'
      | 'pathPaymentStrictSendTooFewOffer'
      | 'pathPaymentStrictSendOfferCrossSelf'
      | 'pathPaymentStrictSendUnderDestmin';

    readonly value:
      | 0
      | -1
      | -2
      | -3
      | -4
      | -5
      | -6
      | -7
      | -8
      | -9
      | -10
      | -11
      | -12;

    static pathPaymentStrictSendSuccess(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendMalformed(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendUnderfunded(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendSrcNoTrust(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendSrcNotAuthorized(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendNoDestination(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendNoTrust(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendNotAuthorized(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendLineFull(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendNoIssuer(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendTooFewOffer(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendOfferCrossSelf(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendUnderDestmin(): PathPaymentStrictSendResultCode;
  }

  class PathPaymentStrictSendResultSuccess {
    constructor(attributes: {
      offers: ClaimOfferAtom[];
      last: SimplePaymentResult;
    });

    offers(value?: ClaimOfferAtom[]): ClaimOfferAtom[];

    last(value?: SimplePaymentResult): SimplePaymentResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PathPaymentStrictSendResultSuccess;

    static write(value: PathPaymentStrictSendResultSuccess, io: Buffer): void;

    static isValid(value: PathPaymentStrictSendResultSuccess): boolean;

    static toXDR(value: PathPaymentStrictSendResultSuccess): Buffer;

    static fromXDR(
      input: Buffer,
      format?: 'raw'
    ): PathPaymentStrictSendResultSuccess;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): PathPaymentStrictSendResultSuccess;
  }

  class PathPaymentStrictSendResult {
    switch(): PathPaymentStrictSendResultCode;

    success(
      value?: PathPaymentStrictSendResultSuccess
    ): PathPaymentStrictSendResultSuccess;

    noIssuer(value?: Asset): Asset;

    value(): PathPaymentStrictSendResultSuccess | Asset;

    static pathPaymentStrictSendSuccess(
      value: PathPaymentStrictSendResultSuccess
    ): PathPaymentStrictSendResult;

    static pathPaymentStrictSendNoIssuer(
      value: Asset
    ): PathPaymentStrictSendResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PathPaymentStrictSendResult;

    static write(value: PathPaymentStrictSendResult, io: Buffer): void;

    static isValid(value: PathPaymentStrictSendResult): boolean;

    static toXDR(value: PathPaymentStrictSendResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PathPaymentStrictSendResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): PathPaymentStrictSendResult;
  }

  class ManageSellOfferResultCode {
    readonly name:
      | 'manageSellOfferSuccess'
      | 'manageSellOfferMalformed'
      | 'manageSellOfferSellNoTrust'
      | 'manageSellOfferBuyNoTrust'
      | 'manageSellOfferSellNotAuthorized'
      | 'manageSellOfferBuyNotAuthorized'
      | 'manageSellOfferLineFull'
      | 'manageSellOfferUnderfunded'
      | 'manageSellOfferCrossSelf'
      | 'manageSellOfferSellNoIssuer'
      | 'manageSellOfferBuyNoIssuer'
      | 'manageSellOfferNotFound'
      | 'manageSellOfferLowReserve';

    readonly value:
      | 0
      | -1
      | -2
      | -3
      | -4
      | -5
      | -6
      | -7
      | -8
      | -9
      | -10
      | -11
      | -12;

    static manageSellOfferSuccess(): ManageSellOfferResultCode;

    static manageSellOfferMalformed(): ManageSellOfferResultCode;

    static manageSellOfferSellNoTrust(): ManageSellOfferResultCode;

    static manageSellOfferBuyNoTrust(): ManageSellOfferResultCode;

    static manageSellOfferSellNotAuthorized(): ManageSellOfferResultCode;

    static manageSellOfferBuyNotAuthorized(): ManageSellOfferResultCode;

    static manageSellOfferLineFull(): ManageSellOfferResultCode;

    static manageSellOfferUnderfunded(): ManageSellOfferResultCode;

    static manageSellOfferCrossSelf(): ManageSellOfferResultCode;

    static manageSellOfferSellNoIssuer(): ManageSellOfferResultCode;

    static manageSellOfferBuyNoIssuer(): ManageSellOfferResultCode;

    static manageSellOfferNotFound(): ManageSellOfferResultCode;

    static manageSellOfferLowReserve(): ManageSellOfferResultCode;
  }

  class ManageOfferEffect {
    readonly name:
      | 'manageOfferCreated'
      | 'manageOfferUpdated'
      | 'manageOfferDeleted';

    readonly value: 0 | 1 | 2;

    static manageOfferCreated(): ManageOfferEffect;

    static manageOfferUpdated(): ManageOfferEffect;

    static manageOfferDeleted(): ManageOfferEffect;
  }

  class ManageOfferSuccessResultOffer {
    switch(): ManageOfferEffect;

    offer(value?: OfferEntry): OfferEntry;

    value(): OfferEntry;

    static manageOfferCreated(value: OfferEntry): ManageOfferSuccessResultOffer;

    static manageOfferUpdated(value: OfferEntry): ManageOfferSuccessResultOffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ManageOfferSuccessResultOffer;

    static write(value: ManageOfferSuccessResultOffer, io: Buffer): void;

    static isValid(value: ManageOfferSuccessResultOffer): boolean;

    static toXDR(value: ManageOfferSuccessResultOffer): Buffer;

    static fromXDR(
      input: Buffer,
      format?: 'raw'
    ): ManageOfferSuccessResultOffer;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ManageOfferSuccessResultOffer;
  }

  class ManageOfferSuccessResult {
    constructor(attributes: {
      offersClaimed: ClaimOfferAtom[];
      offer: ManageOfferSuccessResultOffer;
    });

    offersClaimed(value?: ClaimOfferAtom[]): ClaimOfferAtom[];

    offer(value?: ManageOfferSuccessResultOffer): ManageOfferSuccessResultOffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ManageOfferSuccessResult;

    static write(value: ManageOfferSuccessResult, io: Buffer): void;

    static isValid(value: ManageOfferSuccessResult): boolean;

    static toXDR(value: ManageOfferSuccessResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ManageOfferSuccessResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ManageOfferSuccessResult;
  }

  class ManageSellOfferResult {
    switch(): ManageSellOfferResultCode;

    success(value?: ManageOfferSuccessResult): ManageOfferSuccessResult;

    value(): ManageOfferSuccessResult;

    static manageSellOfferSuccess(
      value: ManageOfferSuccessResult
    ): ManageSellOfferResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ManageSellOfferResult;

    static write(value: ManageSellOfferResult, io: Buffer): void;

    static isValid(value: ManageSellOfferResult): boolean;

    static toXDR(value: ManageSellOfferResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ManageSellOfferResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ManageSellOfferResult;
  }

  class ManageBuyOfferResultCode {
    readonly name:
      | 'manageBuyOfferSuccess'
      | 'manageBuyOfferMalformed'
      | 'manageBuyOfferSellNoTrust'
      | 'manageBuyOfferBuyNoTrust'
      | 'manageBuyOfferSellNotAuthorized'
      | 'manageBuyOfferBuyNotAuthorized'
      | 'manageBuyOfferLineFull'
      | 'manageBuyOfferUnderfunded'
      | 'manageBuyOfferCrossSelf'
      | 'manageBuyOfferSellNoIssuer'
      | 'manageBuyOfferBuyNoIssuer'
      | 'manageBuyOfferNotFound'
      | 'manageBuyOfferLowReserve';

    readonly value:
      | 0
      | -1
      | -2
      | -3
      | -4
      | -5
      | -6
      | -7
      | -8
      | -9
      | -10
      | -11
      | -12;

    static manageBuyOfferSuccess(): ManageBuyOfferResultCode;

    static manageBuyOfferMalformed(): ManageBuyOfferResultCode;

    static manageBuyOfferSellNoTrust(): ManageBuyOfferResultCode;

    static manageBuyOfferBuyNoTrust(): ManageBuyOfferResultCode;

    static manageBuyOfferSellNotAuthorized(): ManageBuyOfferResultCode;

    static manageBuyOfferBuyNotAuthorized(): ManageBuyOfferResultCode;

    static manageBuyOfferLineFull(): ManageBuyOfferResultCode;

    static manageBuyOfferUnderfunded(): ManageBuyOfferResultCode;

    static manageBuyOfferCrossSelf(): ManageBuyOfferResultCode;

    static manageBuyOfferSellNoIssuer(): ManageBuyOfferResultCode;

    static manageBuyOfferBuyNoIssuer(): ManageBuyOfferResultCode;

    static manageBuyOfferNotFound(): ManageBuyOfferResultCode;

    static manageBuyOfferLowReserve(): ManageBuyOfferResultCode;
  }

  class ManageBuyOfferResult {
    switch(): ManageBuyOfferResultCode;

    success(value?: ManageOfferSuccessResult): ManageOfferSuccessResult;

    value(): ManageOfferSuccessResult;

    static manageBuyOfferSuccess(
      value: ManageOfferSuccessResult
    ): ManageBuyOfferResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ManageBuyOfferResult;

    static write(value: ManageBuyOfferResult, io: Buffer): void;

    static isValid(value: ManageBuyOfferResult): boolean;

    static toXDR(value: ManageBuyOfferResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ManageBuyOfferResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ManageBuyOfferResult;
  }

  class SetOptionsResultCode {
    readonly name:
      | 'setOptionsSuccess'
      | 'setOptionsLowReserve'
      | 'setOptionsTooManySigner'
      | 'setOptionsBadFlag'
      | 'setOptionsInvalidInflation'
      | 'setOptionsCantChange'
      | 'setOptionsUnknownFlag'
      | 'setOptionsThresholdOutOfRange'
      | 'setOptionsBadSigner'
      | 'setOptionsInvalidHomeDomain';

    readonly value: 0 | -1 | -2 | -3 | -4 | -5 | -6 | -7 | -8 | -9;

    static setOptionsSuccess(): SetOptionsResultCode;

    static setOptionsLowReserve(): SetOptionsResultCode;

    static setOptionsTooManySigner(): SetOptionsResultCode;

    static setOptionsBadFlag(): SetOptionsResultCode;

    static setOptionsInvalidInflation(): SetOptionsResultCode;

    static setOptionsCantChange(): SetOptionsResultCode;

    static setOptionsUnknownFlag(): SetOptionsResultCode;

    static setOptionsThresholdOutOfRange(): SetOptionsResultCode;

    static setOptionsBadSigner(): SetOptionsResultCode;

    static setOptionsInvalidHomeDomain(): SetOptionsResultCode;
  }

  class SetOptionsResult {
    switch(): SetOptionsResultCode;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SetOptionsResult;

    static write(value: SetOptionsResult, io: Buffer): void;

    static isValid(value: SetOptionsResult): boolean;

    static toXDR(value: SetOptionsResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SetOptionsResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): SetOptionsResult;
  }

  class ChangeTrustResultCode {
    readonly name:
      | 'changeTrustSuccess'
      | 'changeTrustMalformed'
      | 'changeTrustNoIssuer'
      | 'changeTrustInvalidLimit'
      | 'changeTrustLowReserve'
      | 'changeTrustSelfNotAllowed';

    readonly value: 0 | -1 | -2 | -3 | -4 | -5;

    static changeTrustSuccess(): ChangeTrustResultCode;

    static changeTrustMalformed(): ChangeTrustResultCode;

    static changeTrustNoIssuer(): ChangeTrustResultCode;

    static changeTrustInvalidLimit(): ChangeTrustResultCode;

    static changeTrustLowReserve(): ChangeTrustResultCode;

    static changeTrustSelfNotAllowed(): ChangeTrustResultCode;
  }

  class ChangeTrustResult {
    switch(): ChangeTrustResultCode;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ChangeTrustResult;

    static write(value: ChangeTrustResult, io: Buffer): void;

    static isValid(value: ChangeTrustResult): boolean;

    static toXDR(value: ChangeTrustResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ChangeTrustResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): ChangeTrustResult;
  }

  class AllowTrustResultCode {
    readonly name:
      | 'allowTrustSuccess'
      | 'allowTrustMalformed'
      | 'allowTrustNoTrustLine'
      | 'allowTrustTrustNotRequired'
      | 'allowTrustCantRevoke'
      | 'allowTrustSelfNotAllowed';

    readonly value: 0 | -1 | -2 | -3 | -4 | -5;

    static allowTrustSuccess(): AllowTrustResultCode;

    static allowTrustMalformed(): AllowTrustResultCode;

    static allowTrustNoTrustLine(): AllowTrustResultCode;

    static allowTrustTrustNotRequired(): AllowTrustResultCode;

    static allowTrustCantRevoke(): AllowTrustResultCode;

    static allowTrustSelfNotAllowed(): AllowTrustResultCode;
  }

  class AllowTrustResult {
    switch(): AllowTrustResultCode;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AllowTrustResult;

    static write(value: AllowTrustResult, io: Buffer): void;

    static isValid(value: AllowTrustResult): boolean;

    static toXDR(value: AllowTrustResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AllowTrustResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): AllowTrustResult;
  }

  class AccountMergeResultCode {
    readonly name:
      | 'accountMergeSuccess'
      | 'accountMergeMalformed'
      | 'accountMergeNoAccount'
      | 'accountMergeImmutableSet'
      | 'accountMergeHasSubEntry'
      | 'accountMergeSeqnumTooFar'
      | 'accountMergeDestFull';

    readonly value: 0 | -1 | -2 | -3 | -4 | -5 | -6;

    static accountMergeSuccess(): AccountMergeResultCode;

    static accountMergeMalformed(): AccountMergeResultCode;

    static accountMergeNoAccount(): AccountMergeResultCode;

    static accountMergeImmutableSet(): AccountMergeResultCode;

    static accountMergeHasSubEntry(): AccountMergeResultCode;

    static accountMergeSeqnumTooFar(): AccountMergeResultCode;

    static accountMergeDestFull(): AccountMergeResultCode;
  }

  class AccountMergeResult {
    switch(): AccountMergeResultCode;

    sourceAccountBalance(value?: Int64): Int64;

    value(): Int64;

    static accountMergeSuccess(value: Int64): AccountMergeResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AccountMergeResult;

    static write(value: AccountMergeResult, io: Buffer): void;

    static isValid(value: AccountMergeResult): boolean;

    static toXDR(value: AccountMergeResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AccountMergeResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): AccountMergeResult;
  }

  class InflationResultCode {
    readonly name: 'inflationSuccess' | 'inflationNotTime';

    readonly value: 0 | -1;

    static inflationSuccess(): InflationResultCode;

    static inflationNotTime(): InflationResultCode;
  }

  class InflationPayout {
    constructor(attributes: { destination: AccountId; amount: Int64 });

    destination(value?: AccountId): AccountId;

    amount(value?: Int64): Int64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): InflationPayout;

    static write(value: InflationPayout, io: Buffer): void;

    static isValid(value: InflationPayout): boolean;

    static toXDR(value: InflationPayout): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): InflationPayout;

    static fromXDR(input: string, format: 'hex' | 'base64'): InflationPayout;
  }

  class InflationResult {
    switch(): InflationResultCode;

    payouts(value?: InflationPayout[]): InflationPayout[];

    value(): InflationPayout[];

    static inflationSuccess(value: InflationPayout[]): InflationResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): InflationResult;

    static write(value: InflationResult, io: Buffer): void;

    static isValid(value: InflationResult): boolean;

    static toXDR(value: InflationResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): InflationResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): InflationResult;
  }

  class ManageDataResultCode {
    readonly name:
      | 'manageDataSuccess'
      | 'manageDataNotSupportedYet'
      | 'manageDataNameNotFound'
      | 'manageDataLowReserve'
      | 'manageDataInvalidName';

    readonly value: 0 | -1 | -2 | -3 | -4;

    static manageDataSuccess(): ManageDataResultCode;

    static manageDataNotSupportedYet(): ManageDataResultCode;

    static manageDataNameNotFound(): ManageDataResultCode;

    static manageDataLowReserve(): ManageDataResultCode;

    static manageDataInvalidName(): ManageDataResultCode;
  }

  class ManageDataResult {
    switch(): ManageDataResultCode;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ManageDataResult;

    static write(value: ManageDataResult, io: Buffer): void;

    static isValid(value: ManageDataResult): boolean;

    static toXDR(value: ManageDataResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ManageDataResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): ManageDataResult;
  }

  class BumpSequenceResultCode {
    readonly name: 'bumpSequenceSuccess' | 'bumpSequenceBadSeq';

    readonly value: 0 | -1;

    static bumpSequenceSuccess(): BumpSequenceResultCode;

    static bumpSequenceBadSeq(): BumpSequenceResultCode;
  }

  class BumpSequenceResult {
    switch(): BumpSequenceResultCode;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): BumpSequenceResult;

    static write(value: BumpSequenceResult, io: Buffer): void;

    static isValid(value: BumpSequenceResult): boolean;

    static toXDR(value: BumpSequenceResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): BumpSequenceResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): BumpSequenceResult;
  }

  class OperationResultCode {
    readonly name:
      | 'opInner'
      | 'opBadAuth'
      | 'opNoAccount'
      | 'opNotSupported'
      | 'opTooManySubentry'
      | 'opExceededWorkLimit';

    readonly value: 0 | -1 | -2 | -3 | -4 | -5;

    static opInner(): OperationResultCode;

    static opBadAuth(): OperationResultCode;

    static opNoAccount(): OperationResultCode;

    static opNotSupported(): OperationResultCode;

    static opTooManySubentry(): OperationResultCode;

    static opExceededWorkLimit(): OperationResultCode;
  }

  class OperationResultTr {
    switch(): OperationType;

    createAccountResult(value?: CreateAccountResult): CreateAccountResult;

    paymentResult(value?: PaymentResult): PaymentResult;

    pathPaymentStrictReceiveResult(
      value?: PathPaymentStrictReceiveResult
    ): PathPaymentStrictReceiveResult;

    manageSellOfferResult(value?: ManageSellOfferResult): ManageSellOfferResult;

    createPassiveSellOfferResult(
      value?: ManageSellOfferResult
    ): ManageSellOfferResult;

    setOptionsResult(value?: SetOptionsResult): SetOptionsResult;

    changeTrustResult(value?: ChangeTrustResult): ChangeTrustResult;

    allowTrustResult(value?: AllowTrustResult): AllowTrustResult;

    accountMergeResult(value?: AccountMergeResult): AccountMergeResult;

    inflationResult(value?: InflationResult): InflationResult;

    manageDataResult(value?: ManageDataResult): ManageDataResult;

    bumpSeqResult(value?: BumpSequenceResult): BumpSequenceResult;

    manageBuyOfferResult(value?: ManageBuyOfferResult): ManageBuyOfferResult;

    pathPaymentStrictSendResult(
      value?: PathPaymentStrictSendResult
    ): PathPaymentStrictSendResult;

    value():
      | CreateAccountResult
      | PaymentResult
      | PathPaymentStrictReceiveResult
      | ManageSellOfferResult
      | ManageSellOfferResult
      | SetOptionsResult
      | ChangeTrustResult
      | AllowTrustResult
      | AccountMergeResult
      | InflationResult
      | ManageDataResult
      | BumpSequenceResult
      | ManageBuyOfferResult
      | PathPaymentStrictSendResult;

    static createAccount(value: CreateAccountResult): OperationResultTr;

    static payment(value: PaymentResult): OperationResultTr;

    static pathPaymentStrictReceive(
      value: PathPaymentStrictReceiveResult
    ): OperationResultTr;

    static manageSellOffer(value: ManageSellOfferResult): OperationResultTr;

    static createPassiveSellOffer(
      value: ManageSellOfferResult
    ): OperationResultTr;

    static setOption(value: SetOptionsResult): OperationResultTr;

    static changeTrust(value: ChangeTrustResult): OperationResultTr;

    static allowTrust(value: AllowTrustResult): OperationResultTr;

    static accountMerge(value: AccountMergeResult): OperationResultTr;

    static inflation(value: InflationResult): OperationResultTr;

    static manageDatum(value: ManageDataResult): OperationResultTr;

    static bumpSequence(value: BumpSequenceResult): OperationResultTr;

    static manageBuyOffer(value: ManageBuyOfferResult): OperationResultTr;

    static pathPaymentStrictSend(
      value: PathPaymentStrictSendResult
    ): OperationResultTr;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OperationResultTr;

    static write(value: OperationResultTr, io: Buffer): void;

    static isValid(value: OperationResultTr): boolean;

    static toXDR(value: OperationResultTr): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OperationResultTr;

    static fromXDR(input: string, format: 'hex' | 'base64'): OperationResultTr;
  }

  class OperationResult {
    switch(): OperationResultCode;

    tr(value?: OperationResultTr): OperationResultTr;

    value(): OperationResultTr;

    static opInner(value: OperationResultTr): OperationResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OperationResult;

    static write(value: OperationResult, io: Buffer): void;

    static isValid(value: OperationResult): boolean;

    static toXDR(value: OperationResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OperationResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): OperationResult;
  }

  class TransactionResultCode {
    readonly name:
      | 'txFeeBumpInnerSuccess'
      | 'txSuccess'
      | 'txFailed'
      | 'txTooEarly'
      | 'txTooLate'
      | 'txMissingOperation'
      | 'txBadSeq'
      | 'txBadAuth'
      | 'txInsufficientBalance'
      | 'txNoAccount'
      | 'txInsufficientFee'
      | 'txBadAuthExtra'
      | 'txInternalError'
      | 'txNotSupported'
      | 'txFeeBumpInnerFailed';

    readonly value:
      | 1
      | 0
      | -1
      | -2
      | -3
      | -4
      | -5
      | -6
      | -7
      | -8
      | -9
      | -10
      | -11
      | -12
      | -13;

    static txFeeBumpInnerSuccess(): TransactionResultCode;

    static txSuccess(): TransactionResultCode;

    static txFailed(): TransactionResultCode;

    static txTooEarly(): TransactionResultCode;

    static txTooLate(): TransactionResultCode;

    static txMissingOperation(): TransactionResultCode;

    static txBadSeq(): TransactionResultCode;

    static txBadAuth(): TransactionResultCode;

    static txInsufficientBalance(): TransactionResultCode;

    static txNoAccount(): TransactionResultCode;

    static txInsufficientFee(): TransactionResultCode;

    static txBadAuthExtra(): TransactionResultCode;

    static txInternalError(): TransactionResultCode;

    static txNotSupported(): TransactionResultCode;

    static txFeeBumpInnerFailed(): TransactionResultCode;
  }

  class InnerTransactionResultResult {
    switch(): TransactionResultCode;

    results(value?: OperationResult[]): OperationResult[];

    value(): OperationResult[];

    static txSuccess(value: OperationResult[]): InnerTransactionResultResult;

    static txFailed(value: OperationResult[]): InnerTransactionResultResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): InnerTransactionResultResult;

    static write(value: InnerTransactionResultResult, io: Buffer): void;

    static isValid(value: InnerTransactionResultResult): boolean;

    static toXDR(value: InnerTransactionResultResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): InnerTransactionResultResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): InnerTransactionResultResult;
  }

  class InnerTransactionResultExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): InnerTransactionResultExt;

    static write(value: InnerTransactionResultExt, io: Buffer): void;

    static isValid(value: InnerTransactionResultExt): boolean;

    static toXDR(value: InnerTransactionResultExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): InnerTransactionResultExt;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): InnerTransactionResultExt;
  }

  class InnerTransactionResult {
    constructor(attributes: {
      feeCharged: Int64;
      result: InnerTransactionResultResult;
      ext: InnerTransactionResultExt;
    });

    feeCharged(value?: Int64): Int64;

    result(value?: InnerTransactionResultResult): InnerTransactionResultResult;

    ext(value?: InnerTransactionResultExt): InnerTransactionResultExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): InnerTransactionResult;

    static write(value: InnerTransactionResult, io: Buffer): void;

    static isValid(value: InnerTransactionResult): boolean;

    static toXDR(value: InnerTransactionResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): InnerTransactionResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): InnerTransactionResult;
  }

  class InnerTransactionResultPair {
    constructor(attributes: {
      transactionHash: Hash;
      result: InnerTransactionResult;
    });

    transactionHash(value?: Hash): Hash;

    result(value?: InnerTransactionResult): InnerTransactionResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): InnerTransactionResultPair;

    static write(value: InnerTransactionResultPair, io: Buffer): void;

    static isValid(value: InnerTransactionResultPair): boolean;

    static toXDR(value: InnerTransactionResultPair): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): InnerTransactionResultPair;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): InnerTransactionResultPair;
  }

  class TransactionResultResult {
    switch(): TransactionResultCode;

    innerResultPair(
      value?: InnerTransactionResultPair
    ): InnerTransactionResultPair;

    results(value?: OperationResult[]): OperationResult[];

    value(): InnerTransactionResultPair | OperationResult[];

    static txFeeBumpInnerSuccess(
      value: InnerTransactionResultPair
    ): TransactionResultResult;

    static txFeeBumpInnerFailed(
      value: InnerTransactionResultPair
    ): TransactionResultResult;

    static txSuccess(value: OperationResult[]): TransactionResultResult;

    static txFailed(value: OperationResult[]): TransactionResultResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionResultResult;

    static write(value: TransactionResultResult, io: Buffer): void;

    static isValid(value: TransactionResultResult): boolean;

    static toXDR(value: TransactionResultResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionResultResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionResultResult;
  }

  class TransactionResultExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionResultExt;

    static write(value: TransactionResultExt, io: Buffer): void;

    static isValid(value: TransactionResultExt): boolean;

    static toXDR(value: TransactionResultExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionResultExt;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionResultExt;
  }

  class TransactionResult {
    constructor(attributes: {
      feeCharged: Int64;
      result: TransactionResultResult;
      ext: TransactionResultExt;
    });

    feeCharged(value?: Int64): Int64;

    result(value?: TransactionResultResult): TransactionResultResult;

    ext(value?: TransactionResultExt): TransactionResultExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionResult;

    static write(value: TransactionResult, io: Buffer): void;

    static isValid(value: TransactionResult): boolean;

    static toXDR(value: TransactionResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionResult;
  }

  type Value = Buffer;

  class ScpBallot {
    constructor(attributes: { counter: Uint32; value: Value });

    counter(value?: Uint32): Uint32;

    value(value?: Value): Value;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpBallot;

    static write(value: ScpBallot, io: Buffer): void;

    static isValid(value: ScpBallot): boolean;

    static toXDR(value: ScpBallot): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpBallot;

    static fromXDR(input: string, format: 'hex' | 'base64'): ScpBallot;
  }

  class ScpStatementType {
    readonly name:
      | 'scpStPrepare'
      | 'scpStConfirm'
      | 'scpStExternalize'
      | 'scpStNominate';

    readonly value: 0 | 1 | 2 | 3;

    static scpStPrepare(): ScpStatementType;

    static scpStConfirm(): ScpStatementType;

    static scpStExternalize(): ScpStatementType;

    static scpStNominate(): ScpStatementType;
  }

  class ScpNomination {
    constructor(attributes: {
      quorumSetHash: Hash;
      votes: Value[];
      accepted: Value[];
    });

    quorumSetHash(value?: Hash): Hash;

    votes(value?: Value[]): Value[];

    accepted(value?: Value[]): Value[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpNomination;

    static write(value: ScpNomination, io: Buffer): void;

    static isValid(value: ScpNomination): boolean;

    static toXDR(value: ScpNomination): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpNomination;

    static fromXDR(input: string, format: 'hex' | 'base64'): ScpNomination;
  }

  class ScpStatementPrepare {
    constructor(attributes: {
      quorumSetHash: Hash;
      ballot: ScpBallot;
      prepared: null | ScpBallot;
      preparedPrime: null | ScpBallot;
      nC: Uint32;
      nH: Uint32;
    });

    quorumSetHash(value?: Hash): Hash;

    ballot(value?: ScpBallot): ScpBallot;

    prepared(value?: null | ScpBallot): null | ScpBallot;

    preparedPrime(value?: null | ScpBallot): null | ScpBallot;

    nC(value?: Uint32): Uint32;

    nH(value?: Uint32): Uint32;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpStatementPrepare;

    static write(value: ScpStatementPrepare, io: Buffer): void;

    static isValid(value: ScpStatementPrepare): boolean;

    static toXDR(value: ScpStatementPrepare): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpStatementPrepare;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ScpStatementPrepare;
  }

  class ScpStatementConfirm {
    constructor(attributes: {
      ballot: ScpBallot;
      nPrepared: Uint32;
      nCommit: Uint32;
      nH: Uint32;
      quorumSetHash: Hash;
    });

    ballot(value?: ScpBallot): ScpBallot;

    nPrepared(value?: Uint32): Uint32;

    nCommit(value?: Uint32): Uint32;

    nH(value?: Uint32): Uint32;

    quorumSetHash(value?: Hash): Hash;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpStatementConfirm;

    static write(value: ScpStatementConfirm, io: Buffer): void;

    static isValid(value: ScpStatementConfirm): boolean;

    static toXDR(value: ScpStatementConfirm): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpStatementConfirm;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ScpStatementConfirm;
  }

  class ScpStatementExternalize {
    constructor(attributes: {
      commit: ScpBallot;
      nH: Uint32;
      commitQuorumSetHash: Hash;
    });

    commit(value?: ScpBallot): ScpBallot;

    nH(value?: Uint32): Uint32;

    commitQuorumSetHash(value?: Hash): Hash;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpStatementExternalize;

    static write(value: ScpStatementExternalize, io: Buffer): void;

    static isValid(value: ScpStatementExternalize): boolean;

    static toXDR(value: ScpStatementExternalize): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpStatementExternalize;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ScpStatementExternalize;
  }

  class ScpStatementPledges {
    switch(): ScpStatementType;

    prepare(value?: ScpStatementPrepare): ScpStatementPrepare;

    confirm(value?: ScpStatementConfirm): ScpStatementConfirm;

    externalize(value?: ScpStatementExternalize): ScpStatementExternalize;

    nominate(value?: ScpNomination): ScpNomination;

    value():
      | ScpStatementPrepare
      | ScpStatementConfirm
      | ScpStatementExternalize
      | ScpNomination;

    static scpStPrepare(value: ScpStatementPrepare): ScpStatementPledges;

    static scpStConfirm(value: ScpStatementConfirm): ScpStatementPledges;

    static scpStExternalize(
      value: ScpStatementExternalize
    ): ScpStatementPledges;

    static scpStNominate(value: ScpNomination): ScpStatementPledges;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpStatementPledges;

    static write(value: ScpStatementPledges, io: Buffer): void;

    static isValid(value: ScpStatementPledges): boolean;

    static toXDR(value: ScpStatementPledges): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpStatementPledges;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ScpStatementPledges;
  }

  class ScpStatement {
    constructor(attributes: {
      nodeId: NodeId;
      slotIndex: Uint64;
      pledges: ScpStatementPledges;
    });

    nodeId(value?: NodeId): NodeId;

    slotIndex(value?: Uint64): Uint64;

    pledges(value?: ScpStatementPledges): ScpStatementPledges;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpStatement;

    static write(value: ScpStatement, io: Buffer): void;

    static isValid(value: ScpStatement): boolean;

    static toXDR(value: ScpStatement): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpStatement;

    static fromXDR(input: string, format: 'hex' | 'base64'): ScpStatement;
  }

  class ScpEnvelope {
    constructor(attributes: { statement: ScpStatement; signature: Signature });

    statement(value?: ScpStatement): ScpStatement;

    signature(value?: Signature): Signature;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpEnvelope;

    static write(value: ScpEnvelope, io: Buffer): void;

    static isValid(value: ScpEnvelope): boolean;

    static toXDR(value: ScpEnvelope): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpEnvelope;

    static fromXDR(input: string, format: 'hex' | 'base64'): ScpEnvelope;
  }

  class ScpQuorumSet {
    constructor(attributes: {
      threshold: Uint32;
      validators: PublicKey[];
      innerSets: ScpQuorumSet[];
    });

    threshold(value?: Uint32): Uint32;

    validators(value?: PublicKey[]): PublicKey[];

    innerSets(value?: ScpQuorumSet[]): ScpQuorumSet[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpQuorumSet;

    static write(value: ScpQuorumSet, io: Buffer): void;

    static isValid(value: ScpQuorumSet): boolean;

    static toXDR(value: ScpQuorumSet): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpQuorumSet;

    static fromXDR(input: string, format: 'hex' | 'base64'): ScpQuorumSet;
  }

  type AccountId = PublicKey;

  type Thresholds = Buffer;

  type String32 = string | Buffer;

  type String64 = string | Buffer;

  type SequenceNumber = Int64;

  type TimePoint = Uint64;

  type DataValue = Buffer;

  type AssetCode4 = Buffer;

  type AssetCode12 = Buffer;

  class AssetType {
    readonly name:
      | 'assetTypeNative'
      | 'assetTypeCreditAlphanum4'
      | 'assetTypeCreditAlphanum12';

    readonly value: 0 | 1 | 2;

    static assetTypeNative(): AssetType;

    static assetTypeCreditAlphanum4(): AssetType;

    static assetTypeCreditAlphanum12(): AssetType;
  }

  class AssetAlphaNum4 {
    constructor(attributes: { assetCode: AssetCode4; issuer: AccountId });

    assetCode(value?: AssetCode4): AssetCode4;

    issuer(value?: AccountId): AccountId;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AssetAlphaNum4;

    static write(value: AssetAlphaNum4, io: Buffer): void;

    static isValid(value: AssetAlphaNum4): boolean;

    static toXDR(value: AssetAlphaNum4): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AssetAlphaNum4;

    static fromXDR(input: string, format: 'hex' | 'base64'): AssetAlphaNum4;
  }

  class AssetAlphaNum12 {
    constructor(attributes: { assetCode: AssetCode12; issuer: AccountId });

    assetCode(value?: AssetCode12): AssetCode12;

    issuer(value?: AccountId): AccountId;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AssetAlphaNum12;

    static write(value: AssetAlphaNum12, io: Buffer): void;

    static isValid(value: AssetAlphaNum12): boolean;

    static toXDR(value: AssetAlphaNum12): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AssetAlphaNum12;

    static fromXDR(input: string, format: 'hex' | 'base64'): AssetAlphaNum12;
  }

  class Asset {
    switch(): AssetType;

    alphaNum4(value?: AssetAlphaNum4): AssetAlphaNum4;

    alphaNum12(value?: AssetAlphaNum12): AssetAlphaNum12;

    value(): AssetAlphaNum4 | AssetAlphaNum12;

    static assetTypeCreditAlphanum4(value: AssetAlphaNum4): Asset;

    static assetTypeCreditAlphanum12(value: AssetAlphaNum12): Asset;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Asset;

    static write(value: Asset, io: Buffer): void;

    static isValid(value: Asset): boolean;

    static toXDR(value: Asset): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Asset;

    static fromXDR(input: string, format: 'hex' | 'base64'): Asset;
  }

  class Price {
    constructor(attributes: { n: Int32; d: Int32 });

    n(value?: Int32): Int32;

    d(value?: Int32): Int32;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Price;

    static write(value: Price, io: Buffer): void;

    static isValid(value: Price): boolean;

    static toXDR(value: Price): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Price;

    static fromXDR(input: string, format: 'hex' | 'base64'): Price;
  }

  class Liabilities {
    constructor(attributes: { buying: Int64; selling: Int64 });

    buying(value?: Int64): Int64;

    selling(value?: Int64): Int64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Liabilities;

    static write(value: Liabilities, io: Buffer): void;

    static isValid(value: Liabilities): boolean;

    static toXDR(value: Liabilities): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Liabilities;

    static fromXDR(input: string, format: 'hex' | 'base64'): Liabilities;
  }

  class ThresholdIndices {
    readonly name:
      | 'thresholdMasterWeight'
      | 'thresholdLow'
      | 'thresholdMed'
      | 'thresholdHigh';

    readonly value: 0 | 1 | 2 | 3;

    static thresholdMasterWeight(): ThresholdIndices;

    static thresholdLow(): ThresholdIndices;

    static thresholdMed(): ThresholdIndices;

    static thresholdHigh(): ThresholdIndices;
  }

  class LedgerEntryType {
    readonly name: 'account' | 'trustline' | 'offer' | 'datum';

    readonly value: 0 | 1 | 2 | 3;

    static account(): LedgerEntryType;

    static trustline(): LedgerEntryType;

    static offer(): LedgerEntryType;

    static datum(): LedgerEntryType;
  }

  class Signer {
    constructor(attributes: { key: SignerKey; weight: Uint32 });

    key(value?: SignerKey): SignerKey;

    weight(value?: Uint32): Uint32;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Signer;

    static write(value: Signer, io: Buffer): void;

    static isValid(value: Signer): boolean;

    static toXDR(value: Signer): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Signer;

    static fromXDR(input: string, format: 'hex' | 'base64'): Signer;
  }

  class AccountFlags {
    readonly name:
      | 'authRequiredFlag'
      | 'authRevocableFlag'
      | 'authImmutableFlag';

    readonly value: 1 | 2 | 4;

    static authRequiredFlag(): AccountFlags;

    static authRevocableFlag(): AccountFlags;

    static authImmutableFlag(): AccountFlags;
  }

  class AccountEntryV1Ext {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AccountEntryV1Ext;

    static write(value: AccountEntryV1Ext, io: Buffer): void;

    static isValid(value: AccountEntryV1Ext): boolean;

    static toXDR(value: AccountEntryV1Ext): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AccountEntryV1Ext;

    static fromXDR(input: string, format: 'hex' | 'base64'): AccountEntryV1Ext;
  }

  class AccountEntryV1 {
    constructor(attributes: {
      liabilities: Liabilities;
      ext: AccountEntryV1Ext;
    });

    liabilities(value?: Liabilities): Liabilities;

    ext(value?: AccountEntryV1Ext): AccountEntryV1Ext;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AccountEntryV1;

    static write(value: AccountEntryV1, io: Buffer): void;

    static isValid(value: AccountEntryV1): boolean;

    static toXDR(value: AccountEntryV1): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AccountEntryV1;

    static fromXDR(input: string, format: 'hex' | 'base64'): AccountEntryV1;
  }

  class AccountEntryExt {
    switch(): number;

    v1(value?: AccountEntryV1): AccountEntryV1;

    value(): AccountEntryV1;

    static 1(value: AccountEntryV1): AccountEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AccountEntryExt;

    static write(value: AccountEntryExt, io: Buffer): void;

    static isValid(value: AccountEntryExt): boolean;

    static toXDR(value: AccountEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AccountEntryExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): AccountEntryExt;
  }

  class AccountEntry {
    constructor(attributes: {
      accountId: AccountId;
      balance: Int64;
      seqNum: SequenceNumber;
      numSubEntries: Uint32;
      inflationDest: null | AccountId;
      flags: Uint32;
      homeDomain: String32;
      thresholds: Thresholds;
      signers: Signer[];
      ext: AccountEntryExt;
    });

    accountId(value?: AccountId): AccountId;

    balance(value?: Int64): Int64;

    seqNum(value?: SequenceNumber): SequenceNumber;

    numSubEntries(value?: Uint32): Uint32;

    inflationDest(value?: null | AccountId): null | AccountId;

    flags(value?: Uint32): Uint32;

    homeDomain(value?: String32): String32;

    thresholds(value?: Thresholds): Thresholds;

    signers(value?: Signer[]): Signer[];

    ext(value?: AccountEntryExt): AccountEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AccountEntry;

    static write(value: AccountEntry, io: Buffer): void;

    static isValid(value: AccountEntry): boolean;

    static toXDR(value: AccountEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AccountEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): AccountEntry;
  }

  class TrustLineFlags {
    readonly name: 'authorizedFlag' | 'authorizedToMaintainLiabilitiesFlag';

    readonly value: 1 | 2;

    static authorizedFlag(): TrustLineFlags;

    static authorizedToMaintainLiabilitiesFlag(): TrustLineFlags;
  }

  class TrustLineEntryV1Ext {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TrustLineEntryV1Ext;

    static write(value: TrustLineEntryV1Ext, io: Buffer): void;

    static isValid(value: TrustLineEntryV1Ext): boolean;

    static toXDR(value: TrustLineEntryV1Ext): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TrustLineEntryV1Ext;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TrustLineEntryV1Ext;
  }

  class TrustLineEntryV1 {
    constructor(attributes: {
      liabilities: Liabilities;
      ext: TrustLineEntryV1Ext;
    });

    liabilities(value?: Liabilities): Liabilities;

    ext(value?: TrustLineEntryV1Ext): TrustLineEntryV1Ext;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TrustLineEntryV1;

    static write(value: TrustLineEntryV1, io: Buffer): void;

    static isValid(value: TrustLineEntryV1): boolean;

    static toXDR(value: TrustLineEntryV1): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TrustLineEntryV1;

    static fromXDR(input: string, format: 'hex' | 'base64'): TrustLineEntryV1;
  }

  class TrustLineEntryExt {
    switch(): number;

    v1(value?: TrustLineEntryV1): TrustLineEntryV1;

    value(): TrustLineEntryV1;

    static 1(value: TrustLineEntryV1): TrustLineEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TrustLineEntryExt;

    static write(value: TrustLineEntryExt, io: Buffer): void;

    static isValid(value: TrustLineEntryExt): boolean;

    static toXDR(value: TrustLineEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TrustLineEntryExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): TrustLineEntryExt;
  }

  class TrustLineEntry {
    constructor(attributes: {
      accountId: AccountId;
      asset: Asset;
      balance: Int64;
      limit: Int64;
      flags: Uint32;
      ext: TrustLineEntryExt;
    });

    accountId(value?: AccountId): AccountId;

    asset(value?: Asset): Asset;

    balance(value?: Int64): Int64;

    limit(value?: Int64): Int64;

    flags(value?: Uint32): Uint32;

    ext(value?: TrustLineEntryExt): TrustLineEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TrustLineEntry;

    static write(value: TrustLineEntry, io: Buffer): void;

    static isValid(value: TrustLineEntry): boolean;

    static toXDR(value: TrustLineEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TrustLineEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): TrustLineEntry;
  }

  class OfferEntryFlags {
    readonly name: 'passiveFlag';

    readonly value: 1;

    static passiveFlag(): OfferEntryFlags;
  }

  class OfferEntryExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OfferEntryExt;

    static write(value: OfferEntryExt, io: Buffer): void;

    static isValid(value: OfferEntryExt): boolean;

    static toXDR(value: OfferEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OfferEntryExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): OfferEntryExt;
  }

  class OfferEntry {
    constructor(attributes: {
      sellerId: AccountId;
      offerId: Int64;
      selling: Asset;
      buying: Asset;
      amount: Int64;
      price: Price;
      flags: Uint32;
      ext: OfferEntryExt;
    });

    sellerId(value?: AccountId): AccountId;

    offerId(value?: Int64): Int64;

    selling(value?: Asset): Asset;

    buying(value?: Asset): Asset;

    amount(value?: Int64): Int64;

    price(value?: Price): Price;

    flags(value?: Uint32): Uint32;

    ext(value?: OfferEntryExt): OfferEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OfferEntry;

    static write(value: OfferEntry, io: Buffer): void;

    static isValid(value: OfferEntry): boolean;

    static toXDR(value: OfferEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OfferEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): OfferEntry;
  }

  class DataEntryExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): DataEntryExt;

    static write(value: DataEntryExt, io: Buffer): void;

    static isValid(value: DataEntryExt): boolean;

    static toXDR(value: DataEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): DataEntryExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): DataEntryExt;
  }

  class DataEntry {
    constructor(attributes: {
      accountId: AccountId;
      dataName: String64;
      dataValue: DataValue;
      ext: DataEntryExt;
    });

    accountId(value?: AccountId): AccountId;

    dataName(value?: String64): String64;

    dataValue(value?: DataValue): DataValue;

    ext(value?: DataEntryExt): DataEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): DataEntry;

    static write(value: DataEntry, io: Buffer): void;

    static isValid(value: DataEntry): boolean;

    static toXDR(value: DataEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): DataEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): DataEntry;
  }

  class LedgerEntryData {
    switch(): LedgerEntryType;

    account(value?: AccountEntry): AccountEntry;

    trustLine(value?: TrustLineEntry): TrustLineEntry;

    offer(value?: OfferEntry): OfferEntry;

    data(value?: DataEntry): DataEntry;

    value(): AccountEntry | TrustLineEntry | OfferEntry | DataEntry;

    static account(value: AccountEntry): LedgerEntryData;

    static trustline(value: TrustLineEntry): LedgerEntryData;

    static offer(value: OfferEntry): LedgerEntryData;

    static datum(value: DataEntry): LedgerEntryData;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerEntryData;

    static write(value: LedgerEntryData, io: Buffer): void;

    static isValid(value: LedgerEntryData): boolean;

    static toXDR(value: LedgerEntryData): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerEntryData;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerEntryData;
  }

  class LedgerEntryExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerEntryExt;

    static write(value: LedgerEntryExt, io: Buffer): void;

    static isValid(value: LedgerEntryExt): boolean;

    static toXDR(value: LedgerEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerEntryExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerEntryExt;
  }

  class LedgerEntry {
    constructor(attributes: {
      lastModifiedLedgerSeq: Uint32;
      data: LedgerEntryData;
      ext: LedgerEntryExt;
    });

    lastModifiedLedgerSeq(value?: Uint32): Uint32;

    data(value?: LedgerEntryData): LedgerEntryData;

    ext(value?: LedgerEntryExt): LedgerEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerEntry;

    static write(value: LedgerEntry, io: Buffer): void;

    static isValid(value: LedgerEntry): boolean;

    static toXDR(value: LedgerEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerEntry;
  }

  class EnvelopeType {
    readonly name:
      | 'envelopeTypeTxV0'
      | 'envelopeTypeScp'
      | 'envelopeTypeTx'
      | 'envelopeTypeAuth'
      | 'envelopeTypeScpvalue'
      | 'envelopeTypeTxFeeBump';

    readonly value: 0 | 1 | 2 | 3 | 4 | 5;

    static envelopeTypeTxV0(): EnvelopeType;

    static envelopeTypeScp(): EnvelopeType;

    static envelopeTypeTx(): EnvelopeType;

    static envelopeTypeAuth(): EnvelopeType;

    static envelopeTypeScpvalue(): EnvelopeType;

    static envelopeTypeTxFeeBump(): EnvelopeType;
  }

  type UpgradeType = Buffer;

  class StellarValueType {
    readonly name: 'stellarValueBasic' | 'stellarValueSigned';

    readonly value: 0 | 1;

    static stellarValueBasic(): StellarValueType;

    static stellarValueSigned(): StellarValueType;
  }

  class LedgerCloseValueSignature {
    constructor(attributes: { nodeId: NodeId; signature: Signature });

    nodeId(value?: NodeId): NodeId;

    signature(value?: Signature): Signature;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerCloseValueSignature;

    static write(value: LedgerCloseValueSignature, io: Buffer): void;

    static isValid(value: LedgerCloseValueSignature): boolean;

    static toXDR(value: LedgerCloseValueSignature): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerCloseValueSignature;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): LedgerCloseValueSignature;
  }

  class StellarValueExt {
    switch(): StellarValueType;

    lcValueSignature(
      value?: LedgerCloseValueSignature
    ): LedgerCloseValueSignature;

    value(): LedgerCloseValueSignature;

    static stellarValueSigned(
      value: LedgerCloseValueSignature
    ): StellarValueExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): StellarValueExt;

    static write(value: StellarValueExt, io: Buffer): void;

    static isValid(value: StellarValueExt): boolean;

    static toXDR(value: StellarValueExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): StellarValueExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): StellarValueExt;
  }

  class StellarValue {
    constructor(attributes: {
      txSetHash: Hash;
      closeTime: TimePoint;
      upgrades: UpgradeType[];
      ext: StellarValueExt;
    });

    txSetHash(value?: Hash): Hash;

    closeTime(value?: TimePoint): TimePoint;

    upgrades(value?: UpgradeType[]): UpgradeType[];

    ext(value?: StellarValueExt): StellarValueExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): StellarValue;

    static write(value: StellarValue, io: Buffer): void;

    static isValid(value: StellarValue): boolean;

    static toXDR(value: StellarValue): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): StellarValue;

    static fromXDR(input: string, format: 'hex' | 'base64'): StellarValue;
  }

  class LedgerHeaderExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerHeaderExt;

    static write(value: LedgerHeaderExt, io: Buffer): void;

    static isValid(value: LedgerHeaderExt): boolean;

    static toXDR(value: LedgerHeaderExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerHeaderExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerHeaderExt;
  }

  class LedgerHeader {
    constructor(attributes: {
      ledgerVersion: Uint32;
      previousLedgerHash: Hash;
      scpValue: StellarValue;
      txSetResultHash: Hash;
      bucketListHash: Hash;
      ledgerSeq: Uint32;
      totalCoins: Int64;
      feePool: Int64;
      inflationSeq: Uint32;
      idPool: Uint64;
      baseFee: Uint32;
      baseReserve: Uint32;
      maxTxSetSize: Uint32;
      skipList: Hash[];
      ext: LedgerHeaderExt;
    });

    ledgerVersion(value?: Uint32): Uint32;

    previousLedgerHash(value?: Hash): Hash;

    scpValue(value?: StellarValue): StellarValue;

    txSetResultHash(value?: Hash): Hash;

    bucketListHash(value?: Hash): Hash;

    ledgerSeq(value?: Uint32): Uint32;

    totalCoins(value?: Int64): Int64;

    feePool(value?: Int64): Int64;

    inflationSeq(value?: Uint32): Uint32;

    idPool(value?: Uint64): Uint64;

    baseFee(value?: Uint32): Uint32;

    baseReserve(value?: Uint32): Uint32;

    maxTxSetSize(value?: Uint32): Uint32;

    skipList(value?: Hash[]): Hash[];

    ext(value?: LedgerHeaderExt): LedgerHeaderExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerHeader;

    static write(value: LedgerHeader, io: Buffer): void;

    static isValid(value: LedgerHeader): boolean;

    static toXDR(value: LedgerHeader): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerHeader;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerHeader;
  }

  class LedgerUpgradeType {
    readonly name:
      | 'ledgerUpgradeVersion'
      | 'ledgerUpgradeBaseFee'
      | 'ledgerUpgradeMaxTxSetSize'
      | 'ledgerUpgradeBaseReserve';

    readonly value: 1 | 2 | 3 | 4;

    static ledgerUpgradeVersion(): LedgerUpgradeType;

    static ledgerUpgradeBaseFee(): LedgerUpgradeType;

    static ledgerUpgradeMaxTxSetSize(): LedgerUpgradeType;

    static ledgerUpgradeBaseReserve(): LedgerUpgradeType;
  }

  class LedgerUpgrade {
    switch(): LedgerUpgradeType;

    newLedgerVersion(value?: Uint32): Uint32;

    newBaseFee(value?: Uint32): Uint32;

    newMaxTxSetSize(value?: Uint32): Uint32;

    newBaseReserve(value?: Uint32): Uint32;

    value(): Uint32 | Uint32 | Uint32 | Uint32;

    static ledgerUpgradeVersion(value: Uint32): LedgerUpgrade;

    static ledgerUpgradeBaseFee(value: Uint32): LedgerUpgrade;

    static ledgerUpgradeMaxTxSetSize(value: Uint32): LedgerUpgrade;

    static ledgerUpgradeBaseReserve(value: Uint32): LedgerUpgrade;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerUpgrade;

    static write(value: LedgerUpgrade, io: Buffer): void;

    static isValid(value: LedgerUpgrade): boolean;

    static toXDR(value: LedgerUpgrade): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerUpgrade;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerUpgrade;
  }

  class LedgerKeyAccount {
    constructor(attributes: { accountId: AccountId });

    accountId(value?: AccountId): AccountId;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerKeyAccount;

    static write(value: LedgerKeyAccount, io: Buffer): void;

    static isValid(value: LedgerKeyAccount): boolean;

    static toXDR(value: LedgerKeyAccount): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerKeyAccount;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerKeyAccount;
  }

  class LedgerKeyTrustLine {
    constructor(attributes: { accountId: AccountId; asset: Asset });

    accountId(value?: AccountId): AccountId;

    asset(value?: Asset): Asset;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerKeyTrustLine;

    static write(value: LedgerKeyTrustLine, io: Buffer): void;

    static isValid(value: LedgerKeyTrustLine): boolean;

    static toXDR(value: LedgerKeyTrustLine): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerKeyTrustLine;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerKeyTrustLine;
  }

  class LedgerKeyOffer {
    constructor(attributes: { sellerId: AccountId; offerId: Int64 });

    sellerId(value?: AccountId): AccountId;

    offerId(value?: Int64): Int64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerKeyOffer;

    static write(value: LedgerKeyOffer, io: Buffer): void;

    static isValid(value: LedgerKeyOffer): boolean;

    static toXDR(value: LedgerKeyOffer): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerKeyOffer;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerKeyOffer;
  }

  class LedgerKeyData {
    constructor(attributes: { accountId: AccountId; dataName: String64 });

    accountId(value?: AccountId): AccountId;

    dataName(value?: String64): String64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerKeyData;

    static write(value: LedgerKeyData, io: Buffer): void;

    static isValid(value: LedgerKeyData): boolean;

    static toXDR(value: LedgerKeyData): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerKeyData;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerKeyData;
  }

  class LedgerKey {
    switch(): LedgerEntryType;

    account(value?: LedgerKeyAccount): LedgerKeyAccount;

    trustLine(value?: LedgerKeyTrustLine): LedgerKeyTrustLine;

    offer(value?: LedgerKeyOffer): LedgerKeyOffer;

    data(value?: LedgerKeyData): LedgerKeyData;

    value():
      | LedgerKeyAccount
      | LedgerKeyTrustLine
      | LedgerKeyOffer
      | LedgerKeyData;

    static account(value: LedgerKeyAccount): LedgerKey;

    static trustline(value: LedgerKeyTrustLine): LedgerKey;

    static offer(value: LedgerKeyOffer): LedgerKey;

    static datum(value: LedgerKeyData): LedgerKey;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerKey;

    static write(value: LedgerKey, io: Buffer): void;

    static isValid(value: LedgerKey): boolean;

    static toXDR(value: LedgerKey): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerKey;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerKey;
  }

  class BucketEntryType {
    readonly name: 'metaentry' | 'liveentry' | 'deadentry' | 'initentry';

    readonly value: -1 | 0 | 1 | 2;

    static metaentry(): BucketEntryType;

    static liveentry(): BucketEntryType;

    static deadentry(): BucketEntryType;

    static initentry(): BucketEntryType;
  }

  class BucketMetadataExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): BucketMetadataExt;

    static write(value: BucketMetadataExt, io: Buffer): void;

    static isValid(value: BucketMetadataExt): boolean;

    static toXDR(value: BucketMetadataExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): BucketMetadataExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): BucketMetadataExt;
  }

  class BucketMetadata {
    constructor(attributes: { ledgerVersion: Uint32; ext: BucketMetadataExt });

    ledgerVersion(value?: Uint32): Uint32;

    ext(value?: BucketMetadataExt): BucketMetadataExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): BucketMetadata;

    static write(value: BucketMetadata, io: Buffer): void;

    static isValid(value: BucketMetadata): boolean;

    static toXDR(value: BucketMetadata): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): BucketMetadata;

    static fromXDR(input: string, format: 'hex' | 'base64'): BucketMetadata;
  }

  class BucketEntry {
    switch(): BucketEntryType;

    liveEntry(value?: LedgerEntry): LedgerEntry;

    deadEntry(value?: LedgerKey): LedgerKey;

    metaEntry(value?: BucketMetadata): BucketMetadata;

    value(): LedgerEntry | LedgerKey | BucketMetadata;

    static liveentry(value: LedgerEntry): BucketEntry;

    static initentry(value: LedgerEntry): BucketEntry;

    static deadentry(value: LedgerKey): BucketEntry;

    static metaentry(value: BucketMetadata): BucketEntry;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): BucketEntry;

    static write(value: BucketEntry, io: Buffer): void;

    static isValid(value: BucketEntry): boolean;

    static toXDR(value: BucketEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): BucketEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): BucketEntry;
  }

  class TransactionSet {
    constructor(attributes: {
      previousLedgerHash: Hash;
      txes: TransactionEnvelope[];
    });

    previousLedgerHash(value?: Hash): Hash;

    txes(value?: TransactionEnvelope[]): TransactionEnvelope[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionSet;

    static write(value: TransactionSet, io: Buffer): void;

    static isValid(value: TransactionSet): boolean;

    static toXDR(value: TransactionSet): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionSet;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionSet;
  }

  class TransactionResultPair {
    constructor(attributes: {
      transactionHash: Hash;
      result: TransactionResult;
    });

    transactionHash(value?: Hash): Hash;

    result(value?: TransactionResult): TransactionResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionResultPair;

    static write(value: TransactionResultPair, io: Buffer): void;

    static isValid(value: TransactionResultPair): boolean;

    static toXDR(value: TransactionResultPair): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionResultPair;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionResultPair;
  }

  class TransactionResultSet {
    constructor(attributes: { results: TransactionResultPair[] });

    results(value?: TransactionResultPair[]): TransactionResultPair[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionResultSet;

    static write(value: TransactionResultSet, io: Buffer): void;

    static isValid(value: TransactionResultSet): boolean;

    static toXDR(value: TransactionResultSet): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionResultSet;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionResultSet;
  }

  class TransactionHistoryEntryExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionHistoryEntryExt;

    static write(value: TransactionHistoryEntryExt, io: Buffer): void;

    static isValid(value: TransactionHistoryEntryExt): boolean;

    static toXDR(value: TransactionHistoryEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionHistoryEntryExt;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionHistoryEntryExt;
  }

  class TransactionHistoryEntry {
    constructor(attributes: {
      ledgerSeq: Uint32;
      txSet: TransactionSet;
      ext: TransactionHistoryEntryExt;
    });

    ledgerSeq(value?: Uint32): Uint32;

    txSet(value?: TransactionSet): TransactionSet;

    ext(value?: TransactionHistoryEntryExt): TransactionHistoryEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionHistoryEntry;

    static write(value: TransactionHistoryEntry, io: Buffer): void;

    static isValid(value: TransactionHistoryEntry): boolean;

    static toXDR(value: TransactionHistoryEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionHistoryEntry;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionHistoryEntry;
  }

  class TransactionHistoryResultEntryExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionHistoryResultEntryExt;

    static write(value: TransactionHistoryResultEntryExt, io: Buffer): void;

    static isValid(value: TransactionHistoryResultEntryExt): boolean;

    static toXDR(value: TransactionHistoryResultEntryExt): Buffer;

    static fromXDR(
      input: Buffer,
      format?: 'raw'
    ): TransactionHistoryResultEntryExt;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionHistoryResultEntryExt;
  }

  class TransactionHistoryResultEntry {
    constructor(attributes: {
      ledgerSeq: Uint32;
      txResultSet: TransactionResultSet;
      ext: TransactionHistoryResultEntryExt;
    });

    ledgerSeq(value?: Uint32): Uint32;

    txResultSet(value?: TransactionResultSet): TransactionResultSet;

    ext(
      value?: TransactionHistoryResultEntryExt
    ): TransactionHistoryResultEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionHistoryResultEntry;

    static write(value: TransactionHistoryResultEntry, io: Buffer): void;

    static isValid(value: TransactionHistoryResultEntry): boolean;

    static toXDR(value: TransactionHistoryResultEntry): Buffer;

    static fromXDR(
      input: Buffer,
      format?: 'raw'
    ): TransactionHistoryResultEntry;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionHistoryResultEntry;
  }

  class LedgerHeaderHistoryEntryExt {
    switch(): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerHeaderHistoryEntryExt;

    static write(value: LedgerHeaderHistoryEntryExt, io: Buffer): void;

    static isValid(value: LedgerHeaderHistoryEntryExt): boolean;

    static toXDR(value: LedgerHeaderHistoryEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerHeaderHistoryEntryExt;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): LedgerHeaderHistoryEntryExt;
  }

  class LedgerHeaderHistoryEntry {
    constructor(attributes: {
      hash: Hash;
      header: LedgerHeader;
      ext: LedgerHeaderHistoryEntryExt;
    });

    hash(value?: Hash): Hash;

    header(value?: LedgerHeader): LedgerHeader;

    ext(value?: LedgerHeaderHistoryEntryExt): LedgerHeaderHistoryEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerHeaderHistoryEntry;

    static write(value: LedgerHeaderHistoryEntry, io: Buffer): void;

    static isValid(value: LedgerHeaderHistoryEntry): boolean;

    static toXDR(value: LedgerHeaderHistoryEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerHeaderHistoryEntry;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): LedgerHeaderHistoryEntry;
  }

  class LedgerScpMessages {
    constructor(attributes: { ledgerSeq: Uint32; messages: ScpEnvelope[] });

    ledgerSeq(value?: Uint32): Uint32;

    messages(value?: ScpEnvelope[]): ScpEnvelope[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerScpMessages;

    static write(value: LedgerScpMessages, io: Buffer): void;

    static isValid(value: LedgerScpMessages): boolean;

    static toXDR(value: LedgerScpMessages): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerScpMessages;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerScpMessages;
  }

  class ScpHistoryEntryV0 {
    constructor(attributes: {
      quorumSets: ScpQuorumSet[];
      ledgerMessages: LedgerScpMessages;
    });

    quorumSets(value?: ScpQuorumSet[]): ScpQuorumSet[];

    ledgerMessages(value?: LedgerScpMessages): LedgerScpMessages;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpHistoryEntryV0;

    static write(value: ScpHistoryEntryV0, io: Buffer): void;

    static isValid(value: ScpHistoryEntryV0): boolean;

    static toXDR(value: ScpHistoryEntryV0): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpHistoryEntryV0;

    static fromXDR(input: string, format: 'hex' | 'base64'): ScpHistoryEntryV0;
  }

  class ScpHistoryEntry {
    switch(): number;

    v0(value?: ScpHistoryEntryV0): ScpHistoryEntryV0;

    value(): ScpHistoryEntryV0;

    static 0(value: ScpHistoryEntryV0): ScpHistoryEntry;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpHistoryEntry;

    static write(value: ScpHistoryEntry, io: Buffer): void;

    static isValid(value: ScpHistoryEntry): boolean;

    static toXDR(value: ScpHistoryEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpHistoryEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): ScpHistoryEntry;
  }

  class LedgerEntryChangeType {
    readonly name:
      | 'ledgerEntryCreated'
      | 'ledgerEntryUpdated'
      | 'ledgerEntryRemoved'
      | 'ledgerEntryState';

    readonly value: 0 | 1 | 2 | 3;

    static ledgerEntryCreated(): LedgerEntryChangeType;

    static ledgerEntryUpdated(): LedgerEntryChangeType;

    static ledgerEntryRemoved(): LedgerEntryChangeType;

    static ledgerEntryState(): LedgerEntryChangeType;
  }

  class LedgerEntryChange {
    switch(): LedgerEntryChangeType;

    created(value?: LedgerEntry): LedgerEntry;

    updated(value?: LedgerEntry): LedgerEntry;

    removed(value?: LedgerKey): LedgerKey;

    state(value?: LedgerEntry): LedgerEntry;

    value(): LedgerEntry | LedgerEntry | LedgerKey | LedgerEntry;

    static ledgerEntryCreated(value: LedgerEntry): LedgerEntryChange;

    static ledgerEntryUpdated(value: LedgerEntry): LedgerEntryChange;

    static ledgerEntryRemoved(value: LedgerKey): LedgerEntryChange;

    static ledgerEntryState(value: LedgerEntry): LedgerEntryChange;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerEntryChange;

    static write(value: LedgerEntryChange, io: Buffer): void;

    static isValid(value: LedgerEntryChange): boolean;

    static toXDR(value: LedgerEntryChange): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerEntryChange;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerEntryChange;
  }

  type LedgerEntryChanges = LedgerEntryChange[];

  class OperationMeta {
    constructor(attributes: { changes: LedgerEntryChanges });

    changes(value?: LedgerEntryChanges): LedgerEntryChanges;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OperationMeta;

    static write(value: OperationMeta, io: Buffer): void;

    static isValid(value: OperationMeta): boolean;

    static toXDR(value: OperationMeta): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OperationMeta;

    static fromXDR(input: string, format: 'hex' | 'base64'): OperationMeta;
  }

  class TransactionMetaV1 {
    constructor(attributes: {
      txChanges: LedgerEntryChanges;
      operations: OperationMeta[];
    });

    txChanges(value?: LedgerEntryChanges): LedgerEntryChanges;

    operations(value?: OperationMeta[]): OperationMeta[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionMetaV1;

    static write(value: TransactionMetaV1, io: Buffer): void;

    static isValid(value: TransactionMetaV1): boolean;

    static toXDR(value: TransactionMetaV1): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionMetaV1;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionMetaV1;
  }

  class TransactionMetaV2 {
    constructor(attributes: {
      txChangesBefore: LedgerEntryChanges;
      operations: OperationMeta[];
      txChangesAfter: LedgerEntryChanges;
    });

    txChangesBefore(value?: LedgerEntryChanges): LedgerEntryChanges;

    operations(value?: OperationMeta[]): OperationMeta[];

    txChangesAfter(value?: LedgerEntryChanges): LedgerEntryChanges;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionMetaV2;

    static write(value: TransactionMetaV2, io: Buffer): void;

    static isValid(value: TransactionMetaV2): boolean;

    static toXDR(value: TransactionMetaV2): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionMetaV2;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionMetaV2;
  }

  class TransactionMeta {
    switch(): number;

    operations(value?: OperationMeta[]): OperationMeta[];

    v1(value?: TransactionMetaV1): TransactionMetaV1;

    v2(value?: TransactionMetaV2): TransactionMetaV2;

    value(): OperationMeta[] | TransactionMetaV1 | TransactionMetaV2;

    static 0(value: OperationMeta[]): TransactionMeta;

    static 1(value: TransactionMetaV1): TransactionMeta;

    static 2(value: TransactionMetaV2): TransactionMeta;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionMeta;

    static write(value: TransactionMeta, io: Buffer): void;

    static isValid(value: TransactionMeta): boolean;

    static toXDR(value: TransactionMeta): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionMeta;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionMeta;
  }

  class TransactionResultMeta {
    constructor(attributes: {
      result: TransactionResultPair;
      feeProcessing: LedgerEntryChanges;
      txApplyProcessing: TransactionMeta;
    });

    result(value?: TransactionResultPair): TransactionResultPair;

    feeProcessing(value?: LedgerEntryChanges): LedgerEntryChanges;

    txApplyProcessing(value?: TransactionMeta): TransactionMeta;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionResultMeta;

    static write(value: TransactionResultMeta, io: Buffer): void;

    static isValid(value: TransactionResultMeta): boolean;

    static toXDR(value: TransactionResultMeta): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionResultMeta;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): TransactionResultMeta;
  }

  class UpgradeEntryMeta {
    constructor(attributes: {
      upgrade: LedgerUpgrade;
      changes: LedgerEntryChanges;
    });

    upgrade(value?: LedgerUpgrade): LedgerUpgrade;

    changes(value?: LedgerEntryChanges): LedgerEntryChanges;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): UpgradeEntryMeta;

    static write(value: UpgradeEntryMeta, io: Buffer): void;

    static isValid(value: UpgradeEntryMeta): boolean;

    static toXDR(value: UpgradeEntryMeta): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): UpgradeEntryMeta;

    static fromXDR(input: string, format: 'hex' | 'base64'): UpgradeEntryMeta;
  }

  class LedgerCloseMetaV0 {
    constructor(attributes: {
      ledgerHeader: LedgerHeaderHistoryEntry;
      txSet: TransactionSet;
      txProcessing: TransactionResultMeta[];
      upgradesProcessing: UpgradeEntryMeta[];
      scpInfo: ScpHistoryEntry[];
    });

    ledgerHeader(value?: LedgerHeaderHistoryEntry): LedgerHeaderHistoryEntry;

    txSet(value?: TransactionSet): TransactionSet;

    txProcessing(value?: TransactionResultMeta[]): TransactionResultMeta[];

    upgradesProcessing(value?: UpgradeEntryMeta[]): UpgradeEntryMeta[];

    scpInfo(value?: ScpHistoryEntry[]): ScpHistoryEntry[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerCloseMetaV0;

    static write(value: LedgerCloseMetaV0, io: Buffer): void;

    static isValid(value: LedgerCloseMetaV0): boolean;

    static toXDR(value: LedgerCloseMetaV0): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerCloseMetaV0;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerCloseMetaV0;
  }

  class LedgerCloseMeta {
    switch(): number;

    v0(value?: LedgerCloseMetaV0): LedgerCloseMetaV0;

    value(): LedgerCloseMetaV0;

    static 0(value: LedgerCloseMetaV0): LedgerCloseMeta;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerCloseMeta;

    static write(value: LedgerCloseMeta, io: Buffer): void;

    static isValid(value: LedgerCloseMeta): boolean;

    static toXDR(value: LedgerCloseMeta): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerCloseMeta;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerCloseMeta;
  }
}

export function hash(data: Buffer): Buffer;
export function sign(data: Buffer, rawSecret: Buffer): xdr.Signature;
export function verify(
  data: Buffer,
  signature: xdr.Signature,
  rawPublicKey: Buffer
): boolean;
