import { Operation as BaseOperation } from '../operation';
import { Struct, Opaque, Void, UnionWithFunctions, Hyper, UnsignedHyper, UnsignedInt, Int, VarOpaque, String as StringXDR, Bool, Option, Enum, VarArray, UnionWithConstructors } from 'js-xdr';

declare namespace xdr {  // Primitives Void, Hyper, Int, Float, Double, Quadruple, Bool, String, Opaque, VarOpaque.

  export class Hash extends Opaque {}
  export class Uint256 extends Opaque {}
  export class Uint32 extends UnsignedInt {}
  export class Int32 extends Int {}
  export class Uint64 extends UnsignedHyper {}
  export class Int64 extends Hyper {}
  export class Thresholds extends Opaque {}
  export class String32 extends StringXDR {}
  export class String64 extends StringXDR {}
  export class SequenceNumber extends Int64 {}
  export class TimePoint extends Uint64 {}
  export class DataValue extends VarOpaque {}
  export class AssetCode4 extends Opaque {}
  export class AssetCode12 extends Opaque {}

  export class AssetAlphaNum4 extends AbstractAssetAlphaNum<AssetCode4> {}
  export class AssetAlphaNum12 extends AbstractAssetAlphaNum<AssetCode12> {}

  export type SignatureHint = Buffer;
  export type Signature = Buffer;
}

declare namespace xdr {  // Array and VarArray.

  export class Asset<T extends AssetType = AssetType> extends UnionWithFunctions<typeof Asset> {
    static fromXDR(input: Buffer, format?: 'raw'): Asset
    static fromXDR(input: string, format: 'hex' | 'base64'): Asset
    constructor(xdrTypeString: 'assetTypeCreditAlphanum4' | 'assetTypeCreditAlphanum12', xdrType: AssetAlphaNum4 | AssetAlphaNum12)
    static assetTypeNative(): Asset<AssetType.assetTypeNative>
    static assetTypeCreditAlphanum4(value: AssetAlphaNum12): Asset<AssetType.assetTypeCreditAlphanum4>
    static assetTypeCreditAlphanum12(value: AssetAlphaNum4): Asset<AssetType.assetTypeCreditAlphanum12>
    alphaNum12(): T extends AssetType.assetTypeCreditAlphanum12 ? AssetAlphaNum12 : never;
    alphaNum4(): T extends AssetType.assetTypeCreditAlphanum4 ? AssetAlphaNum4 : never;
    switch(): AssetType;
  }

  // TS-TODO: Can someone double check this achieve the same as https://github.com/stellar/js-stellar-base/blob/typescript/types/index.d.ts#L530 ?
  export class Operation<T extends BaseOperation = BaseOperation> extends Struct {
    static fromXDR(input: Buffer, format?: 'raw'): Operation
    static fromXDR(input: string, format: 'hex' | 'base64'): Operation
    sourceAccount(): Option<AccountId>
    body(): OperationBody
  }

  export abstract class AbstractAssetAlphaNum<TAssetCode extends Void | AssetCode4 | AssetCode12 = Void | AssetCode4 | AssetCode12> extends Struct<AbstractAssetAlphaNum> {
    constructor(attributes: {
      assetCode(): string,
      issuer(): any,
    })
    assetCode(): TAssetCode;
    issuer(): any;
  }

  export class EnvelopeType extends Enum<never, never> {
    static envelopeTypeScp(): Enum<'envelopeTypeScp', 1>
    static envelopeTypeTx(): Enum<'envelopeTypeTx', 2>
    static envelopeTypeAuth(): Enum<'envelopeTypeAuth', 3>
    static envelopeTypeScpvalue(): Enum<'envelopeTypeScpvalue', 4>
  }

  export enum MemoType {
    None = 0,
    Text = 1,
    Id = 2,
    Hash = 3,
    Return = 4,
  }
  export class Memo<T extends MemoType = MemoType> extends UnionWithFunctions<typeof Memo> {
    static fromXDR(input: Buffer, format?: 'raw'): Memo
    static fromXDR(input: string, format: 'hex' | 'base64'): Memo
    static memoNone(): Memo<MemoType.None>
    static memoText(value: StringXDR): Memo<MemoType.Text>
    static memoId(value: Uint64): Memo<MemoType.Id>
    static memoHash(value: Hash): Memo<MemoType.Hash>
    static memoReturn(value: Hash): Memo<MemoType.Return>
    text(): StringXDR
    id(): Uint64
    hash(): Hash
    retHash(): Hash
  }

  export class TimeBounds extends Struct<TimeBounds> {
    static fromXDR(input: Buffer, format?: 'raw'): TimeBounds
    static fromXDR(input: string, format: 'hex' | 'base64'): TimeBounds
    minTime(): TimePoint
    maxTime(): TimePoint
  }

  export class Transaction extends Struct<Transaction> {
    static fromXDR(input: Buffer, format?: 'raw'): Transaction
    static fromXDR(input: string, format: 'hex' | 'base64'): Transaction
    sourceAccount(): AccountId
    fee(): Uint32
    seqNum(): SequenceNumber
    timeBounds(): Option<TimeBounds>
    memo(): Memo
    operations(): VarArray<Operation>
    ext(): unknown
  }

  export class TransactionEnvelope extends Struct<TransactionEnvelope> {
    static fromXDR(input: Buffer, format?: 'raw'): TransactionEnvelope
    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionEnvelope
    tx(): Transaction
    signatures(): VarArray<DecoratedSignature>
  }
  type asdf<TAttributes extends object> = {[key in keyof TAttributes]: () => TAttributes[key]}

  export class DecoratedSignature extends Struct<DecoratedSignature> {
    static fromXDR(input: Buffer, format?: 'raw'): DecoratedSignature
    static fromXDR(input: string, format: 'hex' | 'base64'): DecoratedSignature
    hint(): SignatureHint
    signature(): Signature
  }

  export namespace DecoratedSignature {
    export interface IAttributes {
      hint: SignatureHint
      signature: Signature
    }
  }

  export class PublicKeyTypeEd25519 extends Struct<PublicKeyTypeEd25519> {
    static fromXDR(input: Buffer, format?: 'raw'): PublicKeyTypeEd25519
    static fromXDR(input: string, format: 'hex' | 'base64'): PublicKeyTypeEd25519
    constructor(somekindBuffer: Buffer);
  }

  export class Price extends Struct<Price> {
    n(): Int32
    d(): Int32
  }

  export enum PublicKeyType {
    publicKeyTypeEd25519 = 0,
  }
  export class PublicKey<T extends PublicKeyType = PublicKeyType> extends UnionWithConstructors<typeof PublicKey> {
    static publicKeyTypeEd25519: new (...args: ConstructorParameters<typeof PublicKeyTypeEd25519>) => PublicKey<PublicKeyType.publicKeyTypeEd25519>
    ed25519(): T extends PublicKeyType.publicKeyTypeEd25519 ? Uint256 : never
  }
  export class AccountId<T extends PublicKeyType = PublicKeyType> extends PublicKey {
    static publicKeyTypeEd25519: new (...args: ConstructorParameters<typeof PublicKeyTypeEd25519>) => AccountId<PublicKeyType.publicKeyTypeEd25519>
  }

  export enum SignerKeyType {
    signerKeyTypeEd25519 = 0,
    signerKeyTypePreAuthTx = 1,
    signerKeyTypeHashX = 2,
  }
  export class SignerKey<T extends SignerKeyType = SignerKeyType> extends UnionWithConstructors<typeof SignerKey> {
    static signerKeyTypeEd25519: new (...args: ConstructorParameters<typeof Uint256>) => SignerKey<SignerKeyType.signerKeyTypeEd25519>
    static signerKeyTypePreAuthTx: new (...args: ConstructorParameters<typeof Uint256>) => SignerKey<SignerKeyType.signerKeyTypePreAuthTx>
    static signerKeyTypeHashX: new (...args: ConstructorParameters<typeof Uint256>) => SignerKey<SignerKeyType.signerKeyTypeHashX>
    ed25519(): T extends SignerKeyType.signerKeyTypeEd25519 ? Uint256 : never
    preAuthTx(): T extends SignerKeyType.signerKeyTypePreAuthTx ? Uint256 : never
    hashX(): T extends SignerKeyType.signerKeyTypeHashX ? Uint256 : never
  }

  export class Signer extends Struct<Signer> {
    static fromXDR(input: Buffer, format?: 'raw'): Signer
    static fromXDR(input: string, format: 'hex' | 'base64'): Signer
    key(): SignerKey
    weight(): Uint32
  }

  export class TransactionResult extends Struct<TransactionResult> {
    static fromXDR(input: Buffer, format?: 'raw'): TransactionResult
    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionResult
  }

  export enum AssetType {
    assetTypeNative = 0,
    assetTypeCreditAlphanum4 = 1,
    assetTypeCreditAlphanum12 = 2,
  }
  export class AllowTrustOpAsset<T extends AssetType = AssetType> extends UnionWithFunctions<typeof AllowTrustOpAsset> {
    static assetTypeCreditAlphanum4(assetCode: AssetCode4): AllowTrustOpAsset
    static assetTypeCreditAlphanum12(assetCode: AssetCode12): AllowTrustOpAsset
    assetCode4(): T extends AssetType.assetTypeCreditAlphanum4 ? AssetCode4 : never
    assetCode12(): T extends AssetType.assetTypeCreditAlphanum12 ? AssetCode12 : never
  }

  export class AllowTrust extends Struct<AllowTrust> {}

}

declare namespace xdr {  // Operations
  export class CreateAccountOp extends Struct<CreateAccountOp> {
    destination(): AccountId
    startingBalance(): Int64
  }


  export class PaymentOp extends Struct<PaymentOp> {
    destination(): AccountId
    asset(): Asset
    amount(): Int64
  }


  export class PathPaymentOp extends Struct<PathPaymentOp> {
    sendAsset(): Asset
    sendMax(): Int64
    destination(): AccountId
    destAsset(): Asset
    destAmount(): Int64
    // ["path", xdr.varArray(xdr.lookup("Asset"), 5)],
  }

  export class ManageSellOfferOp extends Struct<ManageSellOfferOp> {
    selling(): Asset
    buying(): Asset
    amount(): Int64
    price(): Price
    offerId(): Int64
  }


  export class ManageBuyOfferOp extends Struct<ManageBuyOfferOp> {
    selling(): Asset
    buying(): Asset
    buyAmount(): Int64
    price(): Price
    offerId(): Int64
  }


  export class CreatePassiveSellOfferOp extends Struct<CreatePassiveSellOfferOp> {
    selling(): Asset
    buying(): Asset
    amount(): Int64
    price(): Price
  }


  export class SetOptionsOp extends Struct<SetOptionsOp> {
    inflationDest(): AccountId
    clearFlags(): Uint32
    setFlags(): Uint32
    masterWeight(): Uint32
    lowThreshold(): Uint32
    medThreshold(): Uint32
    highThreshold(): Uint32
  }

  export class ChangeTrustOp extends Struct<ChangeTrustOp> {
    line(): Asset
    limit(): Int64
  }


  export class AllowTrustOp extends Struct<AllowTrustOp> {
    trustor(): AccountId
    asset(): AllowTrustOpAsset
    authorize(): Bool
  }


  export class ManageDataOp extends Struct<ManageDataOp> {
    dataName(): String64
    dataValue(): DataValue
  }


  export class BumpSequenceOp extends Struct<BumpSequenceOp> {
    bumpTo(): SequenceNumber
  }

  export enum OperationType {
    createAccount = 0,
    payment = 1,
    pathPayment = 2,
    manageSellOffer = 3,
    createPassiveSellOffer = 4,
    setOption = 5,
    changeTrust = 6,
    allowTrust = 7,
    accountMerge = 8,
    inflation = 9,
    manageDatum = 10,
    bumpSequence = 11,
    manageBuyOffer = 12,
  }
  export class OperationBody<T extends OperationType = OperationType> extends UnionWithFunctions<typeof OperationBody> {
    static createAccount(op: CreateAccountOp): OperationBody<OperationType.createAccount>
    static payment(op: PaymentOp): OperationBody<OperationType.payment>
    static pathPayment(op: PathPaymentOp): OperationBody<OperationType.pathPayment>
    static manageSellOffer(op: ManageSellOfferOp): OperationBody<OperationType.manageSellOffer>
    static createPassiveSellOffer(op: CreatePassiveSellOfferOp): OperationBody<OperationType.createPassiveSellOffer>
    static setOption(op: SetOptionsOp): OperationBody<OperationType.setOption>
    static changeTrust(op: ChangeTrustOp): OperationBody<OperationType.changeTrust>
    static allowTrust(op: AllowTrustOp): OperationBody<OperationType.allowTrust>
    static accountMerge(op: AccountId): OperationBody<OperationType.accountMerge>
    static inflation(): OperationBody<OperationType.inflation>
    static manageDatum(op: ManageDataOp): OperationBody<OperationType.manageDatum>
    static bumpSequence(op: BumpSequenceOp): OperationBody<OperationType.bumpSequence>
    static manageBuyOffer(op: ManageBuyOfferOp): OperationBody<OperationType.manageBuyOffer>
    createAccountOp(): T extends OperationType.createAccount ? CreateAccountOp : never
    paymentOp(): T extends OperationType.payment ? PaymentOp : never
    pathPaymentOp(): T extends OperationType.pathPayment ? PathPaymentOp : never
    manageSellOfferOp(): T extends OperationType.manageSellOffer ? ManageSellOfferOp : never
    createPassiveSellOfferOp(): T extends OperationType.createPassiveSellOffer ? CreatePassiveSellOfferOp : never
    setOptionsOp(): T extends OperationType.setOption ? SetOptionsOp : never
    changeTrustOp(): T extends OperationType.changeTrust ? ChangeTrustOp : never
    allowTrustOp(): T extends OperationType.allowTrust ? AllowTrustOp : never
    destination(): T extends OperationType.accountMerge ? AccountId : never
    manageDataOp(): T extends OperationType.manageDatum ? ManageDataOp : never
    bumpSequenceOp(): T extends OperationType.bumpSequence ? BumpSequenceOp : never
    manageBuyOfferOp(): T extends OperationType.manageBuyOffer ? ManageBuyOfferOp : never
  }

}




export default xdr
// export as namespace xdr
