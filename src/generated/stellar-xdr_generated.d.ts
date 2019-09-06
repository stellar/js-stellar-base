import { Operation as BaseOperation } from '../operation';
import { Struct, Opaque, Void, Union, Hyper, UnsignedHyper, UnsignedInt, Int, VarOpaque, String as StringXDR, Bool, Option, Enum, VarArray } from 'js-xdr';

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

  export class Asset extends Union<typeof Asset> {
    static fromXDR(input: Buffer, format?: 'raw'): Asset
    static fromXDR(input: string, format: 'hex' | 'base64'): Asset
    constructor(xdrTypeString: 'assetTypeCreditAlphanum4' | 'assetTypeCreditAlphanum12', xdrType: AssetAlphaNum4 | AssetAlphaNum12)
    static assetTypeNative(): Asset;
    alphaNum12(): AssetAlphaNum12;
    alphaNum4(): AssetAlphaNum4;
    switch(): AssetType;
  }

  export class AssetAlphaNum4 extends AbstractAssetAlphaNum<AssetCode4> {}
  export class AssetAlphaNum12 extends AbstractAssetAlphaNum<AssetCode12> {}

  export type SignatureHint = Buffer;
  export type Signature = Buffer;

}

declare namespace xdr {  // Array and VarArray.

  // TS-TODO: Can someone double check this achieve the same as https://github.com/stellar/js-stellar-base/blob/typescript/types/index.d.ts#L530 ?
  export class Operation<T extends BaseOperation = BaseOperation> extends Struct {
    static fromXDR(input: Buffer, format?: 'raw'): Operation
    static fromXDR(input: string, format: 'hex' | 'base64'): Operation
    sourceAccount: Option<AccountId>
    body: OperationBody
  }

  export class AssetType extends Struct<AssetType> {
    static fromXDR(input: Buffer, format?: 'raw'): AssetType
    static fromXDR(input: string, format: 'hex' | 'base64'): AssetType
    static assetTypeNative(): AssetType;
    static assetTypeCreditAlphanum4(): AssetType;
    static assetTypeCreditAlphanum12(): AssetType;
    name: string;
  }
  export abstract class AbstractAssetAlphaNum<TAssetCode extends Void | AssetCode4 | AssetCode12 = Void | AssetCode4 | AssetCode12> extends Struct<AbstractAssetAlphaNum> {
    constructor(attributes: {
      assetCode: string,
      issuer: any,
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
  export class MemoType extends Enum<never, never> {
    static None(): Enum<'None', 0>
    static Text(): Enum<'Text', 1>
    static Id(): Enum<'Id', 2>
    static Hash(): Enum<'Hash', 3>
    static Return(): Enum<'Return', 4>
  }

  export class Memo extends Union<typeof Memo> {
    static fromXDR(input: Buffer, format?: 'raw'): Memo
    static fromXDR(input: string, format: 'hex' | 'base64'): Memo
    static memoNone(): Memo
    static memoText(value: StringXDR): Memo
    static memoId(value: Uint64): Memo
    static memoHash(value: Hash): Memo
    static memoReturn(value: Hash): Memo
    // switchOn: xdr.lookup("MemoType"),
    // switchName: "type",
    // switches: [
    //   ["memoNone", xdr.void()],
    //   ["memoText", "text"],
    //   ["memoId", "id"],
    //   ["memoHash", "hash"],
    //   ["memoReturn", "retHash"],
    // ],
    // arms: {
    //   text: xdr.string(28),
    //   id: xdr.lookup("Uint64"),
    //   hash: xdr.lookup("Hash"),
    //   retHash: xdr.lookup("Hash"),
    // },
  }

  export class TimeBounds extends Struct<TimeBounds> {
    static fromXDR(input: Buffer, format?: 'raw'): TimeBounds
    static fromXDR(input: string, format: 'hex' | 'base64'): TimeBounds
    minTime(): TimePoint
    maxTime(): TimePoint
  }

  export class TransactionExt extends Union<typeof TransactionExt> {}

  export class Transaction extends Struct<Transaction> {
    static fromXDR(input: Buffer, format?: 'raw'): Transaction
    static fromXDR(input: string, format: 'hex' | 'base64'): Transaction
    sourceAccount(): AccountId
    fee(): Uint32
    seqNum(): SequenceNumber
    timeBounds(): Option<TimeBounds>
    memo(): Memo
    operations(): VarArray<Operation>
    ext(): TransactionExt
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

  export class PublicKey extends Union<typeof PublicKey> {
    static publicKeyTypeEd25519: typeof PublicKeyTypeEd25519
    ed25519(): Uint256
  }
  export class AccountId extends PublicKey {}



  export class SignerKey extends Union<typeof SignerKey> {
    static signerKeyTypeEd25519(...args: ConstructorParameters<typeof Uint256>): Uint256
    static signerKeyTypePreAuthTx(...args: ConstructorParameters<typeof Uint256>): Uint256
    static signerKeyTypeHashX(...args: ConstructorParameters<typeof Uint256>): Uint256
    ed25519(): Uint256
    preAuthTx(): Uint256
    hashX(): Uint256
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

  export class AllowTrustOpAsset extends Union<typeof AllowTrustOpAsset> {
    static assetTypeCreditAlphanum4(...args: ConstructorParameters<typeof AssetCode4>): AssetCode4
    static assetTypeCreditAlphanum12(...args: ConstructorParameters<typeof AssetCode12>): AssetCode12
    assetCode4(): AssetCode4
    assetCode12(): AssetCode12
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


  export class OperationBody extends Union<typeof OperationBody> {
    // switchOn: xdr.lookup("OperationType"),
    // switchName: "type",
    static createAccount(...args: ConstructorParameters<typeof CreateAccountOp>): CreateAccountOp
    static payment(...args: ConstructorParameters<typeof PaymentOp>): PaymentOp
    static pathPayment(...args: ConstructorParameters<typeof PathPaymentOp>): PathPaymentOp
    static manageSellOffer(...args: ConstructorParameters<typeof ManageSellOfferOp>): ManageSellOfferOp
    static createPassiveSellOffer(...args: ConstructorParameters<typeof CreatePassiveSellOfferOp>): CreatePassiveSellOfferOp
    static setOption(...args: ConstructorParameters<typeof SetOptionsOp>): SetOptionsOp
    static changeTrust(...args: ConstructorParameters<typeof ChangeTrustOp>): ChangeTrustOp
    static allowTrust(...args: ConstructorParameters<typeof AllowTrustOp>): AllowTrustOp
    static accountMerge(...args: ConstructorParameters<typeof AccountId>): AccountId
    static inflation(...args: ConstructorParameters<typeof Void>): Void
    static manageDatum(...args: ConstructorParameters<typeof ManageDataOp>): ManageDataOp
    static bumpSequence(...args: ConstructorParameters<typeof BumpSequenceOp>): BumpSequenceOp
    static manageBuyOffer(...args: ConstructorParameters<typeof ManageBuyOfferOp>): ManageBuyOfferOp
    createAccountOp(): CreateAccountOp
    paymentOp(): PaymentOp
    pathPaymentOp(): PathPaymentOp
    manageSellOfferOp(): ManageSellOfferOp
    createPassiveSellOfferOp(): CreatePassiveSellOfferOp
    setOptionsOp(): SetOptionsOp
    changeTrustOp(): ChangeTrustOp
    allowTrustOp(): AllowTrustOp
    destination(): AccountId
    manageDataOp(): ManageDataOp
    bumpSequenceOp(): BumpSequenceOp
    manageBuyOfferOp(): ManageBuyOfferOp
  }

}




export default xdr
// export as namespace xdr
