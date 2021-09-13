// TypeScript Version: 2.9

/// <reference types="node" />
import { xdr } from './xdr';

export { xdr };

export class Account {
  constructor(accountId: string, sequence: string);
  accountId(): string;
  sequenceNumber(): string;
  incrementSequenceNumber(): void;
  createSubaccount(id: string): MuxedAccount;
}

export class MuxedAccount {
  constructor(account: Account, sequence: string);
  static fromAddress(mAddress: string, sequenceNum: string): MuxedAccount;
  static parseBaseAddress(mAddress: string): string;

  /* Modeled after Account, above */
  accountId(): string;
  sequenceNumber(): string;
  incrementSequenceNumber(): void;
  createSubaccount(id: string): MuxedAccount;

  baseAccount(): Account;
  id(): string;
  setId(id: string): MuxedAccount;
  toXDRObject(): xdr.MuxedAccount;
  equals(otherMuxedAccount: MuxedAccount): boolean;
}

export namespace AssetType {
  type native = 'native';
  type credit4 = 'credit_alphanum4';
  type credit12 = 'credit_alphanum12';
  type liquidityPoolShares = 'liquidity_pool_shares';
}
export type AssetType =
  | AssetType.native
  | AssetType.credit4
  | AssetType.credit12
  | AssetType.liquidityPoolShares;

export class Asset {
  static native(): Asset;
  static fromOperation(xdr: xdr.Asset): Asset;
  static compare(assetA: Asset, assetB: Asset): -1 | 0 | 1;

  constructor(code: string, issuer?: string);

  getCode(): string;
  getIssuer(): string;
  getAssetType(): AssetType;
  isNative(): boolean;
  equals(other: Asset): boolean;
  toXDRObject(): xdr.Asset;
  toChangeTrustXDRObject(): xdr.ChangeTrustAsset;
  toTrustLineXDRObject(): xdr.TrustLineAsset;

  code: string;
  issuer: string;
}

export class LiquidityPoolAsset {
  constructor(assetA: Asset, assetB: Asset, fee: number);

  static fromOperation(xdr: xdr.ChangeTrustAsset): LiquidityPoolAsset;

  toXDRObject(): xdr.ChangeTrustAsset;
  getLiquidityPoolParameters(): LiquidityPoolParameters;
  getAssetType(): AssetType.liquidityPoolShares;
  equals(other: LiquidityPoolAsset): boolean;

  assetA: Asset;
  assetB: Asset;
  fee: number;
}

export class LiquidityPoolId {
  constructor(liquidityPoolId: string);

  static fromOperation(xdr: xdr.TrustLineAsset): LiquidityPoolId;

  toXDRObject(): xdr.TrustLineAsset;
  getLiquidityPoolId(): string;
  equals(other: LiquidityPoolId): boolean;

  liquidityPoolId: string;
}

export class Claimant {
  readonly destination: string;
  readonly predicate: xdr.ClaimPredicate;
  constructor(destination: string, predicate?: xdr.ClaimPredicate);

  toXDRObject(): xdr.Claimant;

  static fromXDR(claimantXdr: xdr.Claimant): Claimant;
  static predicateUnconditional(): xdr.ClaimPredicate;
  static predicateAnd(left: xdr.ClaimPredicate, right: xdr.ClaimPredicate): xdr.ClaimPredicate;
  static predicateOr(left: xdr.ClaimPredicate, right: xdr.ClaimPredicate): xdr.ClaimPredicate;
  static predicateNot(predicate: xdr.ClaimPredicate): xdr.ClaimPredicate;
  static predicateBeforeAbsoluteTime(absBefore: string): xdr.ClaimPredicate;
  static predicateBeforeRelativeTime(seconds: string): xdr.ClaimPredicate;
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
  sign(data: Buffer): Buffer;
  signDecorated(data: Buffer): xdr.DecoratedSignature;
  signatureHint(): Buffer;
  verify(data: Buffer, signature: Buffer): boolean;

  xdrAccountId(): xdr.AccountId;
  xdrPublicKey(): xdr.PublicKey;
  xdrMuxedAccount(id: string): xdr.MuxedAccount;
}

export const LiquidityPoolFeeV18 = 30;

export function getLiquidityPoolId(liquidityPoolType: LiquidityPoolType, liquidityPoolParameters: LiquidityPoolParameters): Buffer;

export namespace LiquidityPoolParameters {
  interface ConstantProduct {
    assetA: Asset;
    assetB: Asset;
    fee: number;
  }
}
export type LiquidityPoolParameters =
  | LiquidityPoolParameters.ConstantProduct;

export namespace LiquidityPoolType {
  type constantProduct = 'constant_product';
}
export type LiquidityPoolType =
  | LiquidityPoolType.constantProduct;

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
export const AuthClawbackEnabledFlag: 8;
export namespace AuthFlag {
  type immutable = typeof AuthImmutableFlag;
  type required = typeof AuthRequiredFlag;
  type revocable = typeof AuthRevocableFlag;
  type clawbackEnabled = typeof AuthClawbackEnabledFlag;
}
export type AuthFlag =
  | AuthFlag.required
  | AuthFlag.immutable
  | AuthFlag.revocable
  | AuthFlag.clawbackEnabled;

export namespace TrustLineFlag {
  type deauthorize = 0;
  type authorize = 1;
  type authorizeToMaintainLiabilities = 2;
}
export type TrustLineFlag =
  | TrustLineFlag.deauthorize
  | TrustLineFlag.authorize
  | TrustLineFlag.authorizeToMaintainLiabilities;

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
export namespace SignerKeyOptions {
  interface Ed25519PublicKey {
    ed25519PublicKey: string;
  }
  interface Sha256Hash {
    sha256Hash: Buffer | string;
  }
  interface PreAuthTx {
    preAuthTx: Buffer | string;
  }
}
export type Signer =
  | Signer.Ed25519PublicKey
  | Signer.Sha256Hash
  | Signer.PreAuthTx;

export type SignerKeyOptions =
  | SignerKeyOptions.Ed25519PublicKey
  | SignerKeyOptions.Sha256Hash
  | SignerKeyOptions.PreAuthTx;

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
  type CreateClaimableBalance = 'createClaimableBalance';
  type ClaimClaimableBalance = 'claimClaimableBalance';
  type BeginSponsoringFutureReserves = 'beginSponsoringFutureReserves';
  type EndSponsoringFutureReserves = 'endSponsoringFutureReserves';
  type RevokeSponsorship = 'revokeSponsorship';
  type Clawback = 'clawback';
  type ClawbackClaimableBalance = 'clawbackClaimableBalance';
  type SetTrustLineFlags = 'setTrustLineFlags';
  type LiquidityPoolDeposit = 'liquidityPoolDeposit';
  type LiquidityPoolWithdraw = 'liquidityPoolWithdraw';
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
  | OperationType.BumpSequence
  | OperationType.CreateClaimableBalance
  | OperationType.ClaimClaimableBalance
  | OperationType.BeginSponsoringFutureReserves
  | OperationType.EndSponsoringFutureReserves
  | OperationType.RevokeSponsorship
  | OperationType.Clawback
  | OperationType.ClawbackClaimableBalance
  | OperationType.SetTrustLineFlags
  | OperationType.LiquidityPoolDeposit
  | OperationType.LiquidityPoolWithdraw;

export namespace OperationOptions {
  interface BaseOptions {
    source?: string;
    withMuxing?: boolean; // all operations support a muxed source
  }
  interface AccountMerge extends BaseOptions {
    destination: string;
  }
  interface AllowTrust extends BaseOptions {
    trustor: string;
    assetCode: string;
    authorize?: boolean | TrustLineFlag;
  }
  interface ChangeTrust extends BaseOptions {
    asset: Asset | LiquidityPoolAsset;
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
  interface CreateClaimableBalance extends BaseOptions {
    asset: Asset;
    amount: string;
    claimants: Claimant[];
  }
  interface ClaimClaimableBalance extends BaseOptions {
    balanceId: string;
  }
  interface BeginSponsoringFutureReserves extends BaseOptions {
    sponsoredId: string;
  }
  interface RevokeAccountSponsorship extends BaseOptions {
    account: string;
  }
  interface RevokeTrustlineSponsorship extends BaseOptions {
    account: string;
    asset: Asset | LiquidityPoolId;
  }
  interface RevokeOfferSponsorship extends BaseOptions {
    seller: string;
    offerId: string;
  }
  interface RevokeDataSponsorship extends BaseOptions {
    account: string;
    name: string;
  }
  interface RevokeClaimableBalanceSponsorship extends BaseOptions {
    balanceId: string;
  }
  interface RevokeLiquidityPoolSponsorship extends BaseOptions {
    liquidityPoolId: string;
  }
  interface RevokeSignerSponsorship extends BaseOptions {
    account: string;
    signer: SignerKeyOptions;
  }
  interface Clawback extends BaseOptions {
    asset: Asset;
    amount: string;
    from: string;
  }
  interface ClawbackClaimableBalance extends BaseOptions {
    balanceId: string;
  }
  interface SetTrustLineFlags extends BaseOptions {
    trustor: string;
    asset: Asset;
    flags: {
      authorized?: boolean;
      authorizedToMaintainLiabilities?: boolean;
      clawbackEnabled?: boolean;
    };
  }
  interface LiquidityPoolDeposit extends BaseOptions {
    liquidityPoolId: string;
    maxAmountA: string;
    maxAmountB: string;
    minPrice: number | string | object /* bignumber.js */;
    maxPrice: number | string | object /* bignumber.js */;
  }
  interface LiquidityPoolWithdraw extends BaseOptions {
    liquidityPoolId: string;
    amount: string;
    minAmountA: string;
    minAmountB: string;
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
  | OperationOptions.BumpSequence
  | OperationOptions.CreateClaimableBalance
  | OperationOptions.ClaimClaimableBalance
  | OperationOptions.BeginSponsoringFutureReserves
  | OperationOptions.RevokeAccountSponsorship
  | OperationOptions.RevokeTrustlineSponsorship
  | OperationOptions.RevokeOfferSponsorship
  | OperationOptions.RevokeDataSponsorship
  | OperationOptions.RevokeClaimableBalanceSponsorship
  | OperationOptions.RevokeLiquidityPoolSponsorship
  | OperationOptions.RevokeSignerSponsorship
  | OperationOptions.Clawback
  | OperationOptions.ClawbackClaimableBalance
  | OperationOptions.SetTrustLineFlags
  | OperationOptions.LiquidityPoolDeposit
  | OperationOptions.LiquidityPoolWithdraw;

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
    authorize: boolean | TrustLineFlag | undefined;
  }
  function allowTrust(
    options: OperationOptions.AllowTrust
  ): xdr.Operation<AllowTrust>;

  interface ChangeTrust extends BaseOperation<OperationType.ChangeTrust> {
    line: Asset | LiquidityPoolAsset;
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
    value?: Buffer;
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

  interface PathPaymentStrictReceive
    extends BaseOperation<OperationType.PathPaymentStrictReceive> {
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

  interface PathPaymentStrictSend
    extends BaseOperation<OperationType.PathPaymentStrictSend> {
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

  interface CreateClaimableBalance extends BaseOperation<OperationType.CreateClaimableBalance> {
    amount: string;
    asset: Asset;
    claimants: Claimant[];
  }
  function createClaimableBalance(
    options: OperationOptions.CreateClaimableBalance
  ): xdr.Operation<CreateClaimableBalance>;

  interface ClaimClaimableBalance extends BaseOperation<OperationType.ClaimClaimableBalance> {
    balanceId: string;
  }
  function claimClaimableBalance(
    options: OperationOptions.ClaimClaimableBalance
  ): xdr.Operation<ClaimClaimableBalance>;

  interface BeginSponsoringFutureReserves extends BaseOperation<OperationType.BeginSponsoringFutureReserves> {
    sponsoredId: string;
  }
  function beginSponsoringFutureReserves(
    options: OperationOptions.BeginSponsoringFutureReserves
  ): xdr.Operation<BeginSponsoringFutureReserves>;

  interface EndSponsoringFutureReserves extends BaseOperation<OperationType.EndSponsoringFutureReserves> {
  }
  function endSponsoringFutureReserves(
    options: OperationOptions.BaseOptions
  ): xdr.Operation<EndSponsoringFutureReserves>;

  interface RevokeAccountSponsorship extends BaseOperation<OperationType.RevokeSponsorship> {
    account: string;
  }
  function revokeAccountSponsorship(
    options: OperationOptions.RevokeAccountSponsorship
  ): xdr.Operation<RevokeAccountSponsorship>;

  interface RevokeTrustlineSponsorship extends BaseOperation<OperationType.RevokeSponsorship> {
    account: string;
    asset: Asset | LiquidityPoolId;
  }
  function revokeTrustlineSponsorship(
    options: OperationOptions.RevokeTrustlineSponsorship
  ): xdr.Operation<RevokeTrustlineSponsorship>;

  interface RevokeOfferSponsorship extends BaseOperation<OperationType.RevokeSponsorship> {
    seller: string;
    offerId: string;
  }
  function revokeOfferSponsorship(
    options: OperationOptions.RevokeOfferSponsorship
  ): xdr.Operation<RevokeOfferSponsorship>;

  interface RevokeDataSponsorship extends BaseOperation<OperationType.RevokeSponsorship> {
    account: string;
    name: string;
  }
  function revokeDataSponsorship(
    options: OperationOptions.RevokeDataSponsorship
  ): xdr.Operation<RevokeDataSponsorship>;

  interface RevokeClaimableBalanceSponsorship extends BaseOperation<OperationType.RevokeSponsorship> {
    balanceId: string;
  }
  function revokeClaimableBalanceSponsorship(
    options: OperationOptions.RevokeClaimableBalanceSponsorship
  ): xdr.Operation<RevokeClaimableBalanceSponsorship>;

  interface RevokeLiquidityPoolSponsorship extends BaseOperation<OperationType.RevokeSponsorship> {
    balanceId: string;
  }
  function revokeLiquidityPoolSponsorship(
    options: OperationOptions.RevokeLiquidityPoolSponsorship
  ): xdr.Operation<RevokeLiquidityPoolSponsorship>;

  interface RevokeSignerSponsorship extends BaseOperation<OperationType.RevokeSponsorship> {
    account: string;
    signer: SignerKeyOptions;
  }
  function revokeSignerSponsorship(
    options: OperationOptions.RevokeSignerSponsorship
  ): xdr.Operation<RevokeSignerSponsorship>;

  interface Clawback extends BaseOperation<OperationType.Clawback> {
    asset: Asset;
    amount: string;
    from: string;
  }
  function clawback(
    options: OperationOptions.Clawback
  ): xdr.Operation<Clawback>;

  interface ClawbackClaimableBalance extends BaseOperation<OperationType.ClawbackClaimableBalance> {
    balanceId: string;
  }
  function clawbackClaimableBalance(
    options: OperationOptions.ClawbackClaimableBalance
  ): xdr.Operation<ClawbackClaimableBalance>;

  interface SetTrustLineFlags extends BaseOperation<OperationType.SetTrustLineFlags> {
    trustor: string;
    asset: Asset;
    flags: {
      authorized?: boolean;
      authorizedToMaintainLiabilities?: boolean;
      clawbackEnabled?: boolean;
    };
  }
  function setTrustLineFlags(
    options: OperationOptions.SetTrustLineFlags
  ): xdr.Operation<SetTrustLineFlags>;
  interface LiquidityPoolDeposit extends BaseOperation<OperationType.LiquidityPoolDeposit> {
    liquidityPoolId: string;
    maxAmountA: string;
    maxAmountB: string;
    minPrice: string;
    maxPrice: string;
  }
  function liquidityPoolDeposit(
    options: OperationOptions.LiquidityPoolDeposit
  ): xdr.Operation<LiquidityPoolDeposit>;
  interface LiquidityPoolWithdraw extends BaseOperation<OperationType.LiquidityPoolWithdraw> {
    liquidityPoolId: string;
    amount: string;
    minAmountA: string;
    minAmountB: string;
  }
  function liquidityPoolWithdraw(
    options: OperationOptions.LiquidityPoolWithdraw
  ): xdr.Operation<LiquidityPoolWithdraw>;

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
  | Operation.BumpSequence
  | Operation.CreateClaimableBalance
  | Operation.ClaimClaimableBalance
  | Operation.BeginSponsoringFutureReserves
  | Operation.EndSponsoringFutureReserves
  | Operation.RevokeAccountSponsorship
  | Operation.RevokeTrustlineSponsorship
  | Operation.RevokeOfferSponsorship
  | Operation.RevokeDataSponsorship
  | Operation.RevokeClaimableBalanceSponsorship
  | Operation.RevokeLiquidityPoolSponsorship
  | Operation.RevokeSignerSponsorship
  | Operation.Clawback
  | Operation.ClawbackClaimableBalance
  | Operation.SetTrustLineFlags
  | Operation.LiquidityPoolDeposit
  | Operation.LiquidityPoolWithdraw;

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
  constructor(
    envelope: string | xdr.TransactionEnvelope,
    networkPassphrase: string,
    withMuxing?: boolean
  );
  feeSource: string;
  innerTransaction: Transaction;
}

export class Transaction<
  TMemo extends Memo = Memo,
  TOps extends Operation[] = Operation[]
> extends TransactionI {
  constructor(
    envelope: string | xdr.TransactionEnvelope,
    networkPassphrase: string,
    withMuxing?: boolean
  );
  memo: TMemo;
  operations: TOps;
  sequence: string;
  source: string;
  timeBounds?: {
    minTime: string;
    maxTime: string;
  };
}

export const BASE_FEE = '100';
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
  static buildFeeBumpTransaction(
    feeSource: Keypair | string,
    baseFee: string,
    innerTx: Transaction,
    networkPassphrase: string,
    withMuxing?: boolean
  ): FeeBumpTransaction;
  static fromXDR(
    envelope: string | xdr.TransactionEnvelope,
    networkPassphrase: string
  ): Transaction | FeeBumpTransaction;

  supportMuxedAccounts: boolean;
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
    withMuxing?: boolean;
  }
}

export function hash(data: Buffer): Buffer;
export function sign(data: Buffer, rawSecret: Buffer): Buffer;
export function verify(
  data: Buffer,
  signature: Buffer,
  rawPublicKey: Buffer
): boolean;
