// The type definitions inside the namespace xdr were automatically generated on 2020-11-13T19:52:42Z
// using https://github.com/stellar/dts-xdr.
// DO NOT EDIT definitions inside the xdr namespace or your changes may be overwritten

import { Operation } from './index';

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

    static read(io: Buffer): xdr.Operation;

    static write(value: xdr.Operation, io: Buffer): void;

    static isValid(value: xdr.Operation): boolean;

    static toXDR(value: xdr.Operation): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): xdr.Operation;

    static fromXDR(input: string, format: 'hex' | 'base64'): xdr.Operation;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }
}

declare namespace xdr {
  export import Operation = xdrHidden.Operation2; // tslint:disable-line:strict-export-declare-modifiers

  interface SignedInt {
    readonly MAX_VALUE: 2147483647;
    readonly MIN_VALUE: -2147483648;
    read(io: Buffer): number;
    write(value: number, io: Buffer): void;
    isValid(value: number): boolean;
    toXDR(value: number): Buffer;
    fromXDR(input: Buffer, format?: 'raw'): number;
    fromXDR(input: string, format: 'hex' | 'base64'): number;
    validateXDR(input: Buffer, format?: 'raw'): boolean;
    validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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
    validateXDR(input: Buffer, format?: 'raw'): boolean;
    validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;

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

    validateXDR(input: Buffer, format?: 'raw'): boolean;

    validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class XDRArray<T> {
    read(io: Buffer): Buffer;

    write(value: T[], io: Buffer): void;

    isValid(value: T[]): boolean;

    toXDR(value: T[]): Buffer;

    fromXDR(input: Buffer, format?: 'raw'): T[];

    fromXDR(input: string, format: 'hex' | 'base64'): T[];

    validateXDR(input: Buffer, format?: 'raw'): boolean;

    validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class Opaque {
    constructor(length: number);

    read(io: Buffer): Buffer;

    write(value: Buffer, io: Buffer): void;

    isValid(value: Buffer): boolean;

    toXDR(value: Buffer): Buffer;

    fromXDR(input: Buffer, format?: 'raw'): Buffer;

    fromXDR(input: string, format: 'hex' | 'base64'): Buffer;

    validateXDR(input: Buffer, format?: 'raw'): boolean;

    validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class VarOpaque extends Opaque {}

  class Option {
    constructor(childType: {
      read(io: any): any;
      write(value: any, io: Buffer): void;
      isValid(value: any): boolean;
    });

    read(io: Buffer): any;

    write(value: any, io: Buffer): void;

    isValid(value: any): boolean;

    toXDR(value: any): Buffer;

    fromXDR(input: Buffer, format?: 'raw'): any;

    fromXDR(input: string, format: 'hex' | 'base64'): any;

    validateXDR(input: Buffer, format?: 'raw'): boolean;

    validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ErrorCode {
    readonly name: 'errMisc' | 'errData' | 'errConf' | 'errAuth' | 'errLoad';

    readonly value: 0 | 1 | 2 | 3 | 4;

    static errMisc(): ErrorCode;

    static errData(): ErrorCode;

    static errConf(): ErrorCode;

    static errAuth(): ErrorCode;

    static errLoad(): ErrorCode;
  }

  class IpAddrType {
    readonly name: 'iPv4' | 'iPv6';

    readonly value: 0 | 1;

    static iPv4(): IpAddrType;

    static iPv6(): IpAddrType;
  }

  class MessageType {
    readonly name:
      | 'errorMsg'
      | 'auth'
      | 'dontHave'
      | 'getPeers'
      | 'peers'
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

    static getPeers(): MessageType;

    static peers(): MessageType;

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

  class SurveyMessageCommandType {
    readonly name: 'surveyTopology';

    readonly value: 0;

    static surveyTopology(): SurveyMessageCommandType;
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

  class OperationType {
    readonly name:
      | 'createAccount'
      | 'payment'
      | 'pathPaymentStrictReceive'
      | 'manageSellOffer'
      | 'createPassiveSellOffer'
      | 'setOptions'
      | 'changeTrust'
      | 'allowTrust'
      | 'accountMerge'
      | 'inflation'
      | 'manageData'
      | 'bumpSequence'
      | 'manageBuyOffer'
      | 'pathPaymentStrictSend'
      | 'createClaimableBalance'
      | 'claimClaimableBalance'
      | 'beginSponsoringFutureReserves'
      | 'endSponsoringFutureReserves'
      | 'revokeSponsorship';

    readonly value:
      | 0
      | 1
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
      | 15
      | 16
      | 17
      | 18;

    static createAccount(): OperationType;

    static payment(): OperationType;

    static pathPaymentStrictReceive(): OperationType;

    static manageSellOffer(): OperationType;

    static createPassiveSellOffer(): OperationType;

    static setOptions(): OperationType;

    static changeTrust(): OperationType;

    static allowTrust(): OperationType;

    static accountMerge(): OperationType;

    static inflation(): OperationType;

    static manageData(): OperationType;

    static bumpSequence(): OperationType;

    static manageBuyOffer(): OperationType;

    static pathPaymentStrictSend(): OperationType;

    static createClaimableBalance(): OperationType;

    static claimClaimableBalance(): OperationType;

    static beginSponsoringFutureReserves(): OperationType;

    static endSponsoringFutureReserves(): OperationType;

    static revokeSponsorship(): OperationType;
  }

  class RevokeSponsorshipType {
    readonly name: 'revokeSponsorshipLedgerEntry' | 'revokeSponsorshipSigner';

    readonly value: 0 | 1;

    static revokeSponsorshipLedgerEntry(): RevokeSponsorshipType;

    static revokeSponsorshipSigner(): RevokeSponsorshipType;
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
      | 'pathPaymentStrictReceiveTooFewOffers'
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

    static pathPaymentStrictReceiveTooFewOffers(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveOfferCrossSelf(): PathPaymentStrictReceiveResultCode;

    static pathPaymentStrictReceiveOverSendmax(): PathPaymentStrictReceiveResultCode;
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
      | 'pathPaymentStrictSendTooFewOffers'
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

    static pathPaymentStrictSendTooFewOffers(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendOfferCrossSelf(): PathPaymentStrictSendResultCode;

    static pathPaymentStrictSendUnderDestmin(): PathPaymentStrictSendResultCode;
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

  class SetOptionsResultCode {
    readonly name:
      | 'setOptionsSuccess'
      | 'setOptionsLowReserve'
      | 'setOptionsTooManySigners'
      | 'setOptionsBadFlags'
      | 'setOptionsInvalidInflation'
      | 'setOptionsCantChange'
      | 'setOptionsUnknownFlag'
      | 'setOptionsThresholdOutOfRange'
      | 'setOptionsBadSigner'
      | 'setOptionsInvalidHomeDomain';

    readonly value: 0 | -1 | -2 | -3 | -4 | -5 | -6 | -7 | -8 | -9;

    static setOptionsSuccess(): SetOptionsResultCode;

    static setOptionsLowReserve(): SetOptionsResultCode;

    static setOptionsTooManySigners(): SetOptionsResultCode;

    static setOptionsBadFlags(): SetOptionsResultCode;

    static setOptionsInvalidInflation(): SetOptionsResultCode;

    static setOptionsCantChange(): SetOptionsResultCode;

    static setOptionsUnknownFlag(): SetOptionsResultCode;

    static setOptionsThresholdOutOfRange(): SetOptionsResultCode;

    static setOptionsBadSigner(): SetOptionsResultCode;

    static setOptionsInvalidHomeDomain(): SetOptionsResultCode;
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

  class AccountMergeResultCode {
    readonly name:
      | 'accountMergeSuccess'
      | 'accountMergeMalformed'
      | 'accountMergeNoAccount'
      | 'accountMergeImmutableSet'
      | 'accountMergeHasSubEntries'
      | 'accountMergeSeqnumTooFar'
      | 'accountMergeDestFull'
      | 'accountMergeIsSponsor';

    readonly value: 0 | -1 | -2 | -3 | -4 | -5 | -6 | -7;

    static accountMergeSuccess(): AccountMergeResultCode;

    static accountMergeMalformed(): AccountMergeResultCode;

    static accountMergeNoAccount(): AccountMergeResultCode;

    static accountMergeImmutableSet(): AccountMergeResultCode;

    static accountMergeHasSubEntries(): AccountMergeResultCode;

    static accountMergeSeqnumTooFar(): AccountMergeResultCode;

    static accountMergeDestFull(): AccountMergeResultCode;

    static accountMergeIsSponsor(): AccountMergeResultCode;
  }

  class InflationResultCode {
    readonly name: 'inflationSuccess' | 'inflationNotTime';

    readonly value: 0 | -1;

    static inflationSuccess(): InflationResultCode;

    static inflationNotTime(): InflationResultCode;
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

  class BumpSequenceResultCode {
    readonly name: 'bumpSequenceSuccess' | 'bumpSequenceBadSeq';

    readonly value: 0 | -1;

    static bumpSequenceSuccess(): BumpSequenceResultCode;

    static bumpSequenceBadSeq(): BumpSequenceResultCode;
  }

  class CreateClaimableBalanceResultCode {
    readonly name:
      | 'createClaimableBalanceSuccess'
      | 'createClaimableBalanceMalformed'
      | 'createClaimableBalanceLowReserve'
      | 'createClaimableBalanceNoTrust'
      | 'createClaimableBalanceNotAuthorized'
      | 'createClaimableBalanceUnderfunded';

    readonly value: 0 | -1 | -2 | -3 | -4 | -5;

    static createClaimableBalanceSuccess(): CreateClaimableBalanceResultCode;

    static createClaimableBalanceMalformed(): CreateClaimableBalanceResultCode;

    static createClaimableBalanceLowReserve(): CreateClaimableBalanceResultCode;

    static createClaimableBalanceNoTrust(): CreateClaimableBalanceResultCode;

    static createClaimableBalanceNotAuthorized(): CreateClaimableBalanceResultCode;

    static createClaimableBalanceUnderfunded(): CreateClaimableBalanceResultCode;
  }

  class ClaimClaimableBalanceResultCode {
    readonly name:
      | 'claimClaimableBalanceSuccess'
      | 'claimClaimableBalanceDoesNotExist'
      | 'claimClaimableBalanceCannotClaim'
      | 'claimClaimableBalanceLineFull'
      | 'claimClaimableBalanceNoTrust'
      | 'claimClaimableBalanceNotAuthorized';

    readonly value: 0 | -1 | -2 | -3 | -4 | -5;

    static claimClaimableBalanceSuccess(): ClaimClaimableBalanceResultCode;

    static claimClaimableBalanceDoesNotExist(): ClaimClaimableBalanceResultCode;

    static claimClaimableBalanceCannotClaim(): ClaimClaimableBalanceResultCode;

    static claimClaimableBalanceLineFull(): ClaimClaimableBalanceResultCode;

    static claimClaimableBalanceNoTrust(): ClaimClaimableBalanceResultCode;

    static claimClaimableBalanceNotAuthorized(): ClaimClaimableBalanceResultCode;
  }

  class BeginSponsoringFutureReservesResultCode {
    readonly name:
      | 'beginSponsoringFutureReservesSuccess'
      | 'beginSponsoringFutureReservesMalformed'
      | 'beginSponsoringFutureReservesAlreadySponsored'
      | 'beginSponsoringFutureReservesRecursive';

    readonly value: 0 | -1 | -2 | -3;

    static beginSponsoringFutureReservesSuccess(): BeginSponsoringFutureReservesResultCode;

    static beginSponsoringFutureReservesMalformed(): BeginSponsoringFutureReservesResultCode;

    static beginSponsoringFutureReservesAlreadySponsored(): BeginSponsoringFutureReservesResultCode;

    static beginSponsoringFutureReservesRecursive(): BeginSponsoringFutureReservesResultCode;
  }

  class EndSponsoringFutureReservesResultCode {
    readonly name:
      | 'endSponsoringFutureReservesSuccess'
      | 'endSponsoringFutureReservesNotSponsored';

    readonly value: 0 | -1;

    static endSponsoringFutureReservesSuccess(): EndSponsoringFutureReservesResultCode;

    static endSponsoringFutureReservesNotSponsored(): EndSponsoringFutureReservesResultCode;
  }

  class RevokeSponsorshipResultCode {
    readonly name:
      | 'revokeSponsorshipSuccess'
      | 'revokeSponsorshipDoesNotExist'
      | 'revokeSponsorshipNotSponsor'
      | 'revokeSponsorshipLowReserve'
      | 'revokeSponsorshipOnlyTransferable';

    readonly value: 0 | -1 | -2 | -3 | -4;

    static revokeSponsorshipSuccess(): RevokeSponsorshipResultCode;

    static revokeSponsorshipDoesNotExist(): RevokeSponsorshipResultCode;

    static revokeSponsorshipNotSponsor(): RevokeSponsorshipResultCode;

    static revokeSponsorshipLowReserve(): RevokeSponsorshipResultCode;

    static revokeSponsorshipOnlyTransferable(): RevokeSponsorshipResultCode;
  }

  class OperationResultCode {
    readonly name:
      | 'opInner'
      | 'opBadAuth'
      | 'opNoAccount'
      | 'opNotSupported'
      | 'opTooManySubentries'
      | 'opExceededWorkLimit'
      | 'opTooManySponsoring';

    readonly value: 0 | -1 | -2 | -3 | -4 | -5 | -6;

    static opInner(): OperationResultCode;

    static opBadAuth(): OperationResultCode;

    static opNoAccount(): OperationResultCode;

    static opNotSupported(): OperationResultCode;

    static opTooManySubentries(): OperationResultCode;

    static opExceededWorkLimit(): OperationResultCode;

    static opTooManySponsoring(): OperationResultCode;
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
      | 'txFeeBumpInnerFailed'
      | 'txBadSponsorship';

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
      | -13
      | -14;

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

    static txBadSponsorship(): TransactionResultCode;
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
    readonly name:
      | 'account'
      | 'trustline'
      | 'offer'
      | 'data'
      | 'claimableBalance';

    readonly value: 0 | 1 | 2 | 3 | 4;

    static account(): LedgerEntryType;

    static trustline(): LedgerEntryType;

    static offer(): LedgerEntryType;

    static data(): LedgerEntryType;

    static claimableBalance(): LedgerEntryType;
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

  class TrustLineFlags {
    readonly name: 'authorizedFlag' | 'authorizedToMaintainLiabilitiesFlag';

    readonly value: 1 | 2;

    static authorizedFlag(): TrustLineFlags;

    static authorizedToMaintainLiabilitiesFlag(): TrustLineFlags;
  }

  class OfferEntryFlags {
    readonly name: 'passiveFlag';

    readonly value: 1;

    static passiveFlag(): OfferEntryFlags;
  }

  class ClaimPredicateType {
    readonly name:
      | 'claimPredicateUnconditional'
      | 'claimPredicateAnd'
      | 'claimPredicateOr'
      | 'claimPredicateNot'
      | 'claimPredicateBeforeAbsoluteTime'
      | 'claimPredicateBeforeRelativeTime';

    readonly value: 0 | 1 | 2 | 3 | 4 | 5;

    static claimPredicateUnconditional(): ClaimPredicateType;

    static claimPredicateAnd(): ClaimPredicateType;

    static claimPredicateOr(): ClaimPredicateType;

    static claimPredicateNot(): ClaimPredicateType;

    static claimPredicateBeforeAbsoluteTime(): ClaimPredicateType;

    static claimPredicateBeforeRelativeTime(): ClaimPredicateType;
  }

  class ClaimantType {
    readonly name: 'claimantTypeV0';

    readonly value: 0;

    static claimantTypeV0(): ClaimantType;
  }

  class ClaimableBalanceIdType {
    readonly name: 'claimableBalanceIdTypeV0';

    readonly value: 0;

    static claimableBalanceIdTypeV0(): ClaimableBalanceIdType;
  }

  class EnvelopeType {
    readonly name:
      | 'envelopeTypeTxV0'
      | 'envelopeTypeScp'
      | 'envelopeTypeTx'
      | 'envelopeTypeAuth'
      | 'envelopeTypeScpvalue'
      | 'envelopeTypeTxFeeBump'
      | 'envelopeTypeOpId';

    readonly value: 0 | 1 | 2 | 3 | 4 | 5 | 6;

    static envelopeTypeTxV0(): EnvelopeType;

    static envelopeTypeScp(): EnvelopeType;

    static envelopeTypeTx(): EnvelopeType;

    static envelopeTypeAuth(): EnvelopeType;

    static envelopeTypeScpvalue(): EnvelopeType;

    static envelopeTypeTxFeeBump(): EnvelopeType;

    static envelopeTypeOpId(): EnvelopeType;
  }

  class StellarValueType {
    readonly name: 'stellarValueBasic' | 'stellarValueSigned';

    readonly value: 0 | 1;

    static stellarValueBasic(): StellarValueType;

    static stellarValueSigned(): StellarValueType;
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

  class BucketEntryType {
    readonly name: 'metaentry' | 'liveentry' | 'deadentry' | 'initentry';

    readonly value: -1 | 0 | 1 | 2;

    static metaentry(): BucketEntryType;

    static liveentry(): BucketEntryType;

    static deadentry(): BucketEntryType;

    static initentry(): BucketEntryType;
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

  const EncryptedBody: VarOpaque;

  const PeerStatList: XDRArray<PeerStats>;

  const Hash: Opaque;

  const Uint256: Opaque;

  const Uint32: UnsignedInt;

  const Int32: SignedInt;

  class Uint64 extends UnsignedHyper {}

  class Int64 extends Hyper {}

  const Signature: VarOpaque;

  const SignatureHint: Opaque;

  type NodeId = PublicKey;

  const Value: VarOpaque;

  type AccountId = PublicKey;

  const Thresholds: Opaque;

  const String32: XDRString;

  const String64: XDRString;

  type SequenceNumber = Int64;

  type TimePoint = Uint64;

  const DataValue: VarOpaque;

  const AssetCode4: Opaque;

  const AssetCode12: Opaque;

  type SponsorshipDescriptor = undefined | AccountId;

  const UpgradeType: VarOpaque;

  const LedgerEntryChanges: XDRArray<LedgerEntryChange>;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AuthCert {
    constructor(attributes: {
      pubkey: Curve25519Public;
      expiration: Uint64;
      sig: Buffer;
    });

    pubkey(value?: Curve25519Public): Curve25519Public;

    expiration(value?: Uint64): Uint64;

    sig(value?: Buffer): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AuthCert;

    static write(value: AuthCert, io: Buffer): void;

    static isValid(value: AuthCert): boolean;

    static toXDR(value: AuthCert): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AuthCert;

    static fromXDR(input: string, format: 'hex' | 'base64'): AuthCert;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class Hello {
    constructor(attributes: {
      ledgerVersion: number;
      overlayVersion: number;
      overlayMinVersion: number;
      networkId: Buffer;
      versionStr: string | Buffer;
      listeningPort: number;
      peerId: NodeId;
      cert: AuthCert;
      nonce: Buffer;
    });

    ledgerVersion(value?: number): number;

    overlayVersion(value?: number): number;

    overlayMinVersion(value?: number): number;

    networkId(value?: Buffer): Buffer;

    versionStr(value?: string | Buffer): string | Buffer;

    listeningPort(value?: number): number;

    peerId(value?: NodeId): NodeId;

    cert(value?: AuthCert): AuthCert;

    nonce(value?: Buffer): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Hello;

    static write(value: Hello, io: Buffer): void;

    static isValid(value: Hello): boolean;

    static toXDR(value: Hello): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Hello;

    static fromXDR(input: string, format: 'hex' | 'base64'): Hello;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class PeerAddress {
    constructor(attributes: {
      ip: PeerAddressIp;
      port: number;
      numFailures: number;
    });

    ip(value?: PeerAddressIp): PeerAddressIp;

    port(value?: number): number;

    numFailures(value?: number): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PeerAddress;

    static write(value: PeerAddress, io: Buffer): void;

    static isValid(value: PeerAddress): boolean;

    static toXDR(value: PeerAddress): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PeerAddress;

    static fromXDR(input: string, format: 'hex' | 'base64'): PeerAddress;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class DontHave {
    constructor(attributes: { type: MessageType; reqHash: Buffer });

    type(value?: MessageType): MessageType;

    reqHash(value?: Buffer): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): DontHave;

    static write(value: DontHave, io: Buffer): void;

    static isValid(value: DontHave): boolean;

    static toXDR(value: DontHave): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): DontHave;

    static fromXDR(input: string, format: 'hex' | 'base64'): DontHave;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class SurveyRequestMessage {
    constructor(attributes: {
      surveyorPeerId: NodeId;
      surveyedPeerId: NodeId;
      ledgerNum: number;
      encryptionKey: Curve25519Public;
      commandType: SurveyMessageCommandType;
    });

    surveyorPeerId(value?: NodeId): NodeId;

    surveyedPeerId(value?: NodeId): NodeId;

    ledgerNum(value?: number): number;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class SignedSurveyRequestMessage {
    constructor(attributes: {
      requestSignature: Buffer;
      request: SurveyRequestMessage;
    });

    requestSignature(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class SurveyResponseMessage {
    constructor(attributes: {
      surveyorPeerId: NodeId;
      surveyedPeerId: NodeId;
      ledgerNum: number;
      commandType: SurveyMessageCommandType;
      encryptedBody: Buffer;
    });

    surveyorPeerId(value?: NodeId): NodeId;

    surveyedPeerId(value?: NodeId): NodeId;

    ledgerNum(value?: number): number;

    commandType(value?: SurveyMessageCommandType): SurveyMessageCommandType;

    encryptedBody(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class SignedSurveyResponseMessage {
    constructor(attributes: {
      responseSignature: Buffer;
      response: SurveyResponseMessage;
    });

    responseSignature(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TopologyResponseBody {
    constructor(attributes: {
      inboundPeers: PeerStats[];
      outboundPeers: PeerStats[];
      totalInboundPeerCount: number;
      totalOutboundPeerCount: number;
    });

    inboundPeers(value?: PeerStats[]): PeerStats[];

    outboundPeers(value?: PeerStats[]): PeerStats[];

    totalInboundPeerCount(value?: number): number;

    totalOutboundPeerCount(value?: number): number;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class MuxedAccountMed25519 {
    constructor(attributes: { id: Uint64; ed25519: Buffer });

    id(value?: Uint64): Uint64;

    ed25519(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class DecoratedSignature {
    constructor(attributes: { hint: Buffer; signature: Buffer });

    hint(value?: Buffer): Buffer;

    signature(value?: Buffer): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): DecoratedSignature;

    static write(value: DecoratedSignature, io: Buffer): void;

    static isValid(value: DecoratedSignature): boolean;

    static toXDR(value: DecoratedSignature): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): DecoratedSignature;

    static fromXDR(input: string, format: 'hex' | 'base64'): DecoratedSignature;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class SetOptionsOp {
    constructor(attributes: {
      inflationDest: null | AccountId;
      clearFlags: null | number;
      setFlags: null | number;
      masterWeight: null | number;
      lowThreshold: null | number;
      medThreshold: null | number;
      highThreshold: null | number;
      homeDomain: null | string | Buffer;
      signer: null | Signer;
    });

    inflationDest(value?: null | AccountId): null | AccountId;

    clearFlags(value?: null | number): null | number;

    setFlags(value?: null | number): null | number;

    masterWeight(value?: null | number): null | number;

    lowThreshold(value?: null | number): null | number;

    medThreshold(value?: null | number): null | number;

    highThreshold(value?: null | number): null | number;

    homeDomain(value?: null | string | Buffer): null | string | Buffer;

    signer(value?: null | Signer): null | Signer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SetOptionsOp;

    static write(value: SetOptionsOp, io: Buffer): void;

    static isValid(value: SetOptionsOp): boolean;

    static toXDR(value: SetOptionsOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SetOptionsOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): SetOptionsOp;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AllowTrustOp {
    constructor(attributes: {
      trustor: AccountId;
      asset: AllowTrustOpAsset;
      authorize: number;
    });

    trustor(value?: AccountId): AccountId;

    asset(value?: AllowTrustOpAsset): AllowTrustOpAsset;

    authorize(value?: number): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AllowTrustOp;

    static write(value: AllowTrustOp, io: Buffer): void;

    static isValid(value: AllowTrustOp): boolean;

    static toXDR(value: AllowTrustOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AllowTrustOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): AllowTrustOp;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ManageDataOp {
    constructor(attributes: {
      dataName: string | Buffer;
      dataValue: null | Buffer;
    });

    dataName(value?: string | Buffer): string | Buffer;

    dataValue(value?: null | Buffer): null | Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ManageDataOp;

    static write(value: ManageDataOp, io: Buffer): void;

    static isValid(value: ManageDataOp): boolean;

    static toXDR(value: ManageDataOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ManageDataOp;

    static fromXDR(input: string, format: 'hex' | 'base64'): ManageDataOp;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class CreateClaimableBalanceOp {
    constructor(attributes: {
      asset: Asset;
      amount: Int64;
      claimants: Claimant[];
    });

    asset(value?: Asset): Asset;

    amount(value?: Int64): Int64;

    claimants(value?: Claimant[]): Claimant[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): CreateClaimableBalanceOp;

    static write(value: CreateClaimableBalanceOp, io: Buffer): void;

    static isValid(value: CreateClaimableBalanceOp): boolean;

    static toXDR(value: CreateClaimableBalanceOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): CreateClaimableBalanceOp;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): CreateClaimableBalanceOp;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ClaimClaimableBalanceOp {
    constructor(attributes: { balanceId: ClaimableBalanceId });

    balanceId(value?: ClaimableBalanceId): ClaimableBalanceId;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ClaimClaimableBalanceOp;

    static write(value: ClaimClaimableBalanceOp, io: Buffer): void;

    static isValid(value: ClaimClaimableBalanceOp): boolean;

    static toXDR(value: ClaimClaimableBalanceOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ClaimClaimableBalanceOp;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ClaimClaimableBalanceOp;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class BeginSponsoringFutureReservesOp {
    constructor(attributes: { sponsoredId: AccountId });

    sponsoredId(value?: AccountId): AccountId;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): BeginSponsoringFutureReservesOp;

    static write(value: BeginSponsoringFutureReservesOp, io: Buffer): void;

    static isValid(value: BeginSponsoringFutureReservesOp): boolean;

    static toXDR(value: BeginSponsoringFutureReservesOp): Buffer;

    static fromXDR(
      input: Buffer,
      format?: 'raw'
    ): BeginSponsoringFutureReservesOp;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): BeginSponsoringFutureReservesOp;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class RevokeSponsorshipOpSigner {
    constructor(attributes: { accountId: AccountId; signerKey: SignerKey });

    accountId(value?: AccountId): AccountId;

    signerKey(value?: SignerKey): SignerKey;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): RevokeSponsorshipOpSigner;

    static write(value: RevokeSponsorshipOpSigner, io: Buffer): void;

    static isValid(value: RevokeSponsorshipOpSigner): boolean;

    static toXDR(value: RevokeSponsorshipOpSigner): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): RevokeSponsorshipOpSigner;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): RevokeSponsorshipOpSigner;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class OperationIdId {
    constructor(attributes: {
      sourceAccount: MuxedAccount;
      seqNum: SequenceNumber;
      opNum: number;
    });

    sourceAccount(value?: MuxedAccount): MuxedAccount;

    seqNum(value?: SequenceNumber): SequenceNumber;

    opNum(value?: number): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OperationIdId;

    static write(value: OperationIdId, io: Buffer): void;

    static isValid(value: OperationIdId): boolean;

    static toXDR(value: OperationIdId): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OperationIdId;

    static fromXDR(input: string, format: 'hex' | 'base64'): OperationIdId;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionV0 {
    constructor(attributes: {
      sourceAccountEd25519: Buffer;
      fee: number;
      seqNum: SequenceNumber;
      timeBounds: null | TimeBounds;
      memo: Memo;
      operations: Operation[];
      ext: TransactionV0Ext;
    });

    sourceAccountEd25519(value?: Buffer): Buffer;

    fee(value?: number): number;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class Transaction {
    constructor(attributes: {
      sourceAccount: MuxedAccount;
      fee: number;
      seqNum: SequenceNumber;
      timeBounds: null | TimeBounds;
      memo: Memo;
      operations: Operation[];
      ext: TransactionExt;
    });

    sourceAccount(value?: MuxedAccount): MuxedAccount;

    fee(value?: number): number;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionSignaturePayload {
    constructor(attributes: {
      networkId: Buffer;
      taggedTransaction: TransactionSignaturePayloadTaggedTransaction;
    });

    networkId(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class InnerTransactionResultPair {
    constructor(attributes: {
      transactionHash: Buffer;
      result: InnerTransactionResult;
    });

    transactionHash(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ScpBallot {
    constructor(attributes: { counter: number; value: Buffer });

    counter(value?: number): number;

    value(value?: Buffer): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpBallot;

    static write(value: ScpBallot, io: Buffer): void;

    static isValid(value: ScpBallot): boolean;

    static toXDR(value: ScpBallot): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpBallot;

    static fromXDR(input: string, format: 'hex' | 'base64'): ScpBallot;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ScpNomination {
    constructor(attributes: {
      quorumSetHash: Buffer;
      votes: Buffer[];
      accepted: Buffer[];
    });

    quorumSetHash(value?: Buffer): Buffer;

    votes(value?: Buffer[]): Buffer[];

    accepted(value?: Buffer[]): Buffer[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpNomination;

    static write(value: ScpNomination, io: Buffer): void;

    static isValid(value: ScpNomination): boolean;

    static toXDR(value: ScpNomination): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpNomination;

    static fromXDR(input: string, format: 'hex' | 'base64'): ScpNomination;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ScpStatementPrepare {
    constructor(attributes: {
      quorumSetHash: Buffer;
      ballot: ScpBallot;
      prepared: null | ScpBallot;
      preparedPrime: null | ScpBallot;
      nC: number;
      nH: number;
    });

    quorumSetHash(value?: Buffer): Buffer;

    ballot(value?: ScpBallot): ScpBallot;

    prepared(value?: null | ScpBallot): null | ScpBallot;

    preparedPrime(value?: null | ScpBallot): null | ScpBallot;

    nC(value?: number): number;

    nH(value?: number): number;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ScpStatementConfirm {
    constructor(attributes: {
      ballot: ScpBallot;
      nPrepared: number;
      nCommit: number;
      nH: number;
      quorumSetHash: Buffer;
    });

    ballot(value?: ScpBallot): ScpBallot;

    nPrepared(value?: number): number;

    nCommit(value?: number): number;

    nH(value?: number): number;

    quorumSetHash(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ScpStatementExternalize {
    constructor(attributes: {
      commit: ScpBallot;
      nH: number;
      commitQuorumSetHash: Buffer;
    });

    commit(value?: ScpBallot): ScpBallot;

    nH(value?: number): number;

    commitQuorumSetHash(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ScpEnvelope {
    constructor(attributes: { statement: ScpStatement; signature: Buffer });

    statement(value?: ScpStatement): ScpStatement;

    signature(value?: Buffer): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpEnvelope;

    static write(value: ScpEnvelope, io: Buffer): void;

    static isValid(value: ScpEnvelope): boolean;

    static toXDR(value: ScpEnvelope): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpEnvelope;

    static fromXDR(input: string, format: 'hex' | 'base64'): ScpEnvelope;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ScpQuorumSet {
    constructor(attributes: {
      threshold: number;
      validators: PublicKey[];
      innerSets: ScpQuorumSet[];
    });

    threshold(value?: number): number;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AssetAlphaNum4 {
    constructor(attributes: { assetCode: Buffer; issuer: AccountId });

    assetCode(value?: Buffer): Buffer;

    issuer(value?: AccountId): AccountId;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AssetAlphaNum4;

    static write(value: AssetAlphaNum4, io: Buffer): void;

    static isValid(value: AssetAlphaNum4): boolean;

    static toXDR(value: AssetAlphaNum4): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AssetAlphaNum4;

    static fromXDR(input: string, format: 'hex' | 'base64'): AssetAlphaNum4;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AssetAlphaNum12 {
    constructor(attributes: { assetCode: Buffer; issuer: AccountId });

    assetCode(value?: Buffer): Buffer;

    issuer(value?: AccountId): AccountId;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AssetAlphaNum12;

    static write(value: AssetAlphaNum12, io: Buffer): void;

    static isValid(value: AssetAlphaNum12): boolean;

    static toXDR(value: AssetAlphaNum12): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AssetAlphaNum12;

    static fromXDR(input: string, format: 'hex' | 'base64'): AssetAlphaNum12;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class Price {
    constructor(attributes: { n: number; d: number });

    n(value?: number): number;

    d(value?: number): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Price;

    static write(value: Price, io: Buffer): void;

    static isValid(value: Price): boolean;

    static toXDR(value: Price): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Price;

    static fromXDR(input: string, format: 'hex' | 'base64'): Price;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class Signer {
    constructor(attributes: { key: SignerKey; weight: number });

    key(value?: SignerKey): SignerKey;

    weight(value?: number): number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Signer;

    static write(value: Signer, io: Buffer): void;

    static isValid(value: Signer): boolean;

    static toXDR(value: Signer): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Signer;

    static fromXDR(input: string, format: 'hex' | 'base64'): Signer;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AccountEntryExtensionV2 {
    constructor(attributes: {
      numSponsored: number;
      numSponsoring: number;
      signerSponsoringIDs: SponsorshipDescriptor[];
      ext: AccountEntryExtensionV2Ext;
    });

    numSponsored(value?: number): number;

    numSponsoring(value?: number): number;

    signerSponsoringIDs(
      value?: SponsorshipDescriptor[]
    ): SponsorshipDescriptor[];

    ext(value?: AccountEntryExtensionV2Ext): AccountEntryExtensionV2Ext;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AccountEntryExtensionV2;

    static write(value: AccountEntryExtensionV2, io: Buffer): void;

    static isValid(value: AccountEntryExtensionV2): boolean;

    static toXDR(value: AccountEntryExtensionV2): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AccountEntryExtensionV2;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): AccountEntryExtensionV2;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AccountEntryExtensionV1 {
    constructor(attributes: {
      liabilities: Liabilities;
      ext: AccountEntryExtensionV1Ext;
    });

    liabilities(value?: Liabilities): Liabilities;

    ext(value?: AccountEntryExtensionV1Ext): AccountEntryExtensionV1Ext;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AccountEntryExtensionV1;

    static write(value: AccountEntryExtensionV1, io: Buffer): void;

    static isValid(value: AccountEntryExtensionV1): boolean;

    static toXDR(value: AccountEntryExtensionV1): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AccountEntryExtensionV1;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): AccountEntryExtensionV1;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AccountEntry {
    constructor(attributes: {
      accountId: AccountId;
      balance: Int64;
      seqNum: SequenceNumber;
      numSubEntries: number;
      inflationDest: null | AccountId;
      flags: number;
      homeDomain: string | Buffer;
      thresholds: Buffer;
      signers: Signer[];
      ext: AccountEntryExt;
    });

    accountId(value?: AccountId): AccountId;

    balance(value?: Int64): Int64;

    seqNum(value?: SequenceNumber): SequenceNumber;

    numSubEntries(value?: number): number;

    inflationDest(value?: null | AccountId): null | AccountId;

    flags(value?: number): number;

    homeDomain(value?: string | Buffer): string | Buffer;

    thresholds(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TrustLineEntry {
    constructor(attributes: {
      accountId: AccountId;
      asset: Asset;
      balance: Int64;
      limit: Int64;
      flags: number;
      ext: TrustLineEntryExt;
    });

    accountId(value?: AccountId): AccountId;

    asset(value?: Asset): Asset;

    balance(value?: Int64): Int64;

    limit(value?: Int64): Int64;

    flags(value?: number): number;

    ext(value?: TrustLineEntryExt): TrustLineEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TrustLineEntry;

    static write(value: TrustLineEntry, io: Buffer): void;

    static isValid(value: TrustLineEntry): boolean;

    static toXDR(value: TrustLineEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TrustLineEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): TrustLineEntry;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class OfferEntry {
    constructor(attributes: {
      sellerId: AccountId;
      offerId: Int64;
      selling: Asset;
      buying: Asset;
      amount: Int64;
      price: Price;
      flags: number;
      ext: OfferEntryExt;
    });

    sellerId(value?: AccountId): AccountId;

    offerId(value?: Int64): Int64;

    selling(value?: Asset): Asset;

    buying(value?: Asset): Asset;

    amount(value?: Int64): Int64;

    price(value?: Price): Price;

    flags(value?: number): number;

    ext(value?: OfferEntryExt): OfferEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OfferEntry;

    static write(value: OfferEntry, io: Buffer): void;

    static isValid(value: OfferEntry): boolean;

    static toXDR(value: OfferEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OfferEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): OfferEntry;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class DataEntry {
    constructor(attributes: {
      accountId: AccountId;
      dataName: string | Buffer;
      dataValue: Buffer;
      ext: DataEntryExt;
    });

    accountId(value?: AccountId): AccountId;

    dataName(value?: string | Buffer): string | Buffer;

    dataValue(value?: Buffer): Buffer;

    ext(value?: DataEntryExt): DataEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): DataEntry;

    static write(value: DataEntry, io: Buffer): void;

    static isValid(value: DataEntry): boolean;

    static toXDR(value: DataEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): DataEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): DataEntry;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ClaimantV0 {
    constructor(attributes: {
      destination: AccountId;
      predicate: ClaimPredicate;
    });

    destination(value?: AccountId): AccountId;

    predicate(value?: ClaimPredicate): ClaimPredicate;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ClaimantV0;

    static write(value: ClaimantV0, io: Buffer): void;

    static isValid(value: ClaimantV0): boolean;

    static toXDR(value: ClaimantV0): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ClaimantV0;

    static fromXDR(input: string, format: 'hex' | 'base64'): ClaimantV0;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ClaimableBalanceEntry {
    constructor(attributes: {
      balanceId: ClaimableBalanceId;
      claimants: Claimant[];
      asset: Asset;
      amount: Int64;
      ext: ClaimableBalanceEntryExt;
    });

    balanceId(value?: ClaimableBalanceId): ClaimableBalanceId;

    claimants(value?: Claimant[]): Claimant[];

    asset(value?: Asset): Asset;

    amount(value?: Int64): Int64;

    ext(value?: ClaimableBalanceEntryExt): ClaimableBalanceEntryExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ClaimableBalanceEntry;

    static write(value: ClaimableBalanceEntry, io: Buffer): void;

    static isValid(value: ClaimableBalanceEntry): boolean;

    static toXDR(value: ClaimableBalanceEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ClaimableBalanceEntry;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ClaimableBalanceEntry;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerEntryExtensionV1 {
    constructor(attributes: {
      sponsoringId: SponsorshipDescriptor;
      ext: LedgerEntryExtensionV1Ext;
    });

    sponsoringId(value?: SponsorshipDescriptor): SponsorshipDescriptor;

    ext(value?: LedgerEntryExtensionV1Ext): LedgerEntryExtensionV1Ext;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerEntryExtensionV1;

    static write(value: LedgerEntryExtensionV1, io: Buffer): void;

    static isValid(value: LedgerEntryExtensionV1): boolean;

    static toXDR(value: LedgerEntryExtensionV1): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerEntryExtensionV1;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): LedgerEntryExtensionV1;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerEntry {
    constructor(attributes: {
      lastModifiedLedgerSeq: number;
      data: LedgerEntryData;
      ext: LedgerEntryExt;
    });

    lastModifiedLedgerSeq(value?: number): number;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerKeyData {
    constructor(attributes: {
      accountId: AccountId;
      dataName: string | Buffer;
    });

    accountId(value?: AccountId): AccountId;

    dataName(value?: string | Buffer): string | Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerKeyData;

    static write(value: LedgerKeyData, io: Buffer): void;

    static isValid(value: LedgerKeyData): boolean;

    static toXDR(value: LedgerKeyData): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerKeyData;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerKeyData;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerKeyClaimableBalance {
    constructor(attributes: { balanceId: ClaimableBalanceId });

    balanceId(value?: ClaimableBalanceId): ClaimableBalanceId;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerKeyClaimableBalance;

    static write(value: LedgerKeyClaimableBalance, io: Buffer): void;

    static isValid(value: LedgerKeyClaimableBalance): boolean;

    static toXDR(value: LedgerKeyClaimableBalance): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerKeyClaimableBalance;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): LedgerKeyClaimableBalance;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerCloseValueSignature {
    constructor(attributes: { nodeId: NodeId; signature: Buffer });

    nodeId(value?: NodeId): NodeId;

    signature(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class StellarValue {
    constructor(attributes: {
      txSetHash: Buffer;
      closeTime: TimePoint;
      upgrades: Buffer[];
      ext: StellarValueExt;
    });

    txSetHash(value?: Buffer): Buffer;

    closeTime(value?: TimePoint): TimePoint;

    upgrades(value?: Buffer[]): Buffer[];

    ext(value?: StellarValueExt): StellarValueExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): StellarValue;

    static write(value: StellarValue, io: Buffer): void;

    static isValid(value: StellarValue): boolean;

    static toXDR(value: StellarValue): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): StellarValue;

    static fromXDR(input: string, format: 'hex' | 'base64'): StellarValue;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerHeader {
    constructor(attributes: {
      ledgerVersion: number;
      previousLedgerHash: Buffer;
      scpValue: StellarValue;
      txSetResultHash: Buffer;
      bucketListHash: Buffer;
      ledgerSeq: number;
      totalCoins: Int64;
      feePool: Int64;
      inflationSeq: number;
      idPool: Uint64;
      baseFee: number;
      baseReserve: number;
      maxTxSetSize: number;
      skipList: Buffer[];
      ext: LedgerHeaderExt;
    });

    ledgerVersion(value?: number): number;

    previousLedgerHash(value?: Buffer): Buffer;

    scpValue(value?: StellarValue): StellarValue;

    txSetResultHash(value?: Buffer): Buffer;

    bucketListHash(value?: Buffer): Buffer;

    ledgerSeq(value?: number): number;

    totalCoins(value?: Int64): Int64;

    feePool(value?: Int64): Int64;

    inflationSeq(value?: number): number;

    idPool(value?: Uint64): Uint64;

    baseFee(value?: number): number;

    baseReserve(value?: number): number;

    maxTxSetSize(value?: number): number;

    skipList(value?: Buffer[]): Buffer[];

    ext(value?: LedgerHeaderExt): LedgerHeaderExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerHeader;

    static write(value: LedgerHeader, io: Buffer): void;

    static isValid(value: LedgerHeader): boolean;

    static toXDR(value: LedgerHeader): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerHeader;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerHeader;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class BucketMetadata {
    constructor(attributes: { ledgerVersion: number; ext: BucketMetadataExt });

    ledgerVersion(value?: number): number;

    ext(value?: BucketMetadataExt): BucketMetadataExt;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): BucketMetadata;

    static write(value: BucketMetadata, io: Buffer): void;

    static isValid(value: BucketMetadata): boolean;

    static toXDR(value: BucketMetadata): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): BucketMetadata;

    static fromXDR(input: string, format: 'hex' | 'base64'): BucketMetadata;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionSet {
    constructor(attributes: {
      previousLedgerHash: Buffer;
      txes: TransactionEnvelope[];
    });

    previousLedgerHash(value?: Buffer): Buffer;

    txes(value?: TransactionEnvelope[]): TransactionEnvelope[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionSet;

    static write(value: TransactionSet, io: Buffer): void;

    static isValid(value: TransactionSet): boolean;

    static toXDR(value: TransactionSet): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionSet;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionSet;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionResultPair {
    constructor(attributes: {
      transactionHash: Buffer;
      result: TransactionResult;
    });

    transactionHash(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionHistoryEntry {
    constructor(attributes: {
      ledgerSeq: number;
      txSet: TransactionSet;
      ext: TransactionHistoryEntryExt;
    });

    ledgerSeq(value?: number): number;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionHistoryResultEntry {
    constructor(attributes: {
      ledgerSeq: number;
      txResultSet: TransactionResultSet;
      ext: TransactionHistoryResultEntryExt;
    });

    ledgerSeq(value?: number): number;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerHeaderHistoryEntry {
    constructor(attributes: {
      hash: Buffer;
      header: LedgerHeader;
      ext: LedgerHeaderHistoryEntryExt;
    });

    hash(value?: Buffer): Buffer;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerScpMessages {
    constructor(attributes: { ledgerSeq: number; messages: ScpEnvelope[] });

    ledgerSeq(value?: number): number;

    messages(value?: ScpEnvelope[]): ScpEnvelope[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerScpMessages;

    static write(value: LedgerScpMessages, io: Buffer): void;

    static isValid(value: LedgerScpMessages): boolean;

    static toXDR(value: LedgerScpMessages): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerScpMessages;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerScpMessages;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class OperationMeta {
    constructor(attributes: { changes: LedgerEntryChange[] });

    changes(value?: LedgerEntryChange[]): LedgerEntryChange[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OperationMeta;

    static write(value: OperationMeta, io: Buffer): void;

    static isValid(value: OperationMeta): boolean;

    static toXDR(value: OperationMeta): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OperationMeta;

    static fromXDR(input: string, format: 'hex' | 'base64'): OperationMeta;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionMetaV1 {
    constructor(attributes: {
      txChanges: LedgerEntryChange[];
      operations: OperationMeta[];
    });

    txChanges(value?: LedgerEntryChange[]): LedgerEntryChange[];

    operations(value?: OperationMeta[]): OperationMeta[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionMetaV1;

    static write(value: TransactionMetaV1, io: Buffer): void;

    static isValid(value: TransactionMetaV1): boolean;

    static toXDR(value: TransactionMetaV1): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionMetaV1;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionMetaV1;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionMetaV2 {
    constructor(attributes: {
      txChangesBefore: LedgerEntryChange[];
      operations: OperationMeta[];
      txChangesAfter: LedgerEntryChange[];
    });

    txChangesBefore(value?: LedgerEntryChange[]): LedgerEntryChange[];

    operations(value?: OperationMeta[]): OperationMeta[];

    txChangesAfter(value?: LedgerEntryChange[]): LedgerEntryChange[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionMetaV2;

    static write(value: TransactionMetaV2, io: Buffer): void;

    static isValid(value: TransactionMetaV2): boolean;

    static toXDR(value: TransactionMetaV2): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionMetaV2;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionMetaV2;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionResultMeta {
    constructor(attributes: {
      result: TransactionResultPair;
      feeProcessing: LedgerEntryChange[];
      txApplyProcessing: TransactionMeta;
    });

    result(value?: TransactionResultPair): TransactionResultPair;

    feeProcessing(value?: LedgerEntryChange[]): LedgerEntryChange[];

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class UpgradeEntryMeta {
    constructor(attributes: {
      upgrade: LedgerUpgrade;
      changes: LedgerEntryChange[];
    });

    upgrade(value?: LedgerUpgrade): LedgerUpgrade;

    changes(value?: LedgerEntryChange[]): LedgerEntryChange[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): UpgradeEntryMeta;

    static write(value: UpgradeEntryMeta, io: Buffer): void;

    static isValid(value: UpgradeEntryMeta): boolean;

    static toXDR(value: UpgradeEntryMeta): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): UpgradeEntryMeta;

    static fromXDR(input: string, format: 'hex' | 'base64'): UpgradeEntryMeta;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class PeerAddressIp {
    switch(): IpAddrType;

    ipv4(value?: Buffer): Buffer;

    ipv6(value?: Buffer): Buffer;

    static iPv4(value: Buffer): PeerAddressIp;

    static iPv6(value: Buffer): PeerAddressIp;

    value(): Buffer | Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PeerAddressIp;

    static write(value: PeerAddressIp, io: Buffer): void;

    static isValid(value: PeerAddressIp): boolean;

    static toXDR(value: PeerAddressIp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PeerAddressIp;

    static fromXDR(input: string, format: 'hex' | 'base64'): PeerAddressIp;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class SurveyResponseBody {
    switch(): SurveyMessageCommandType;

    topologyResponseBody(value?: TopologyResponseBody): TopologyResponseBody;

    static surveyTopology(value: TopologyResponseBody): SurveyResponseBody;

    value(): TopologyResponseBody;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SurveyResponseBody;

    static write(value: SurveyResponseBody, io: Buffer): void;

    static isValid(value: SurveyResponseBody): boolean;

    static toXDR(value: SurveyResponseBody): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SurveyResponseBody;

    static fromXDR(input: string, format: 'hex' | 'base64'): SurveyResponseBody;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class StellarMessage {
    switch(): MessageType;

    error(value?: Error): Error;

    hello(value?: Hello): Hello;

    auth(value?: Auth): Auth;

    dontHave(value?: DontHave): DontHave;

    peers(value?: PeerAddress[]): PeerAddress[];

    txSetHash(value?: Buffer): Buffer;

    txSet(value?: TransactionSet): TransactionSet;

    transaction(value?: TransactionEnvelope): TransactionEnvelope;

    signedSurveyRequestMessage(
      value?: SignedSurveyRequestMessage
    ): SignedSurveyRequestMessage;

    signedSurveyResponseMessage(
      value?: SignedSurveyResponseMessage
    ): SignedSurveyResponseMessage;

    qSetHash(value?: Buffer): Buffer;

    qSet(value?: ScpQuorumSet): ScpQuorumSet;

    envelope(value?: ScpEnvelope): ScpEnvelope;

    getScpLedgerSeq(value?: number): number;

    static errorMsg(value: Error): StellarMessage;

    static hello(value: Hello): StellarMessage;

    static auth(value: Auth): StellarMessage;

    static dontHave(value: DontHave): StellarMessage;

    static getPeers(): StellarMessage;

    static peers(value: PeerAddress[]): StellarMessage;

    static getTxSet(value: Buffer): StellarMessage;

    static txSet(value: TransactionSet): StellarMessage;

    static transaction(value: TransactionEnvelope): StellarMessage;

    static surveyRequest(value: SignedSurveyRequestMessage): StellarMessage;

    static surveyResponse(value: SignedSurveyResponseMessage): StellarMessage;

    static getScpQuorumset(value: Buffer): StellarMessage;

    static scpQuorumset(value: ScpQuorumSet): StellarMessage;

    static scpMessage(value: ScpEnvelope): StellarMessage;

    static getScpState(value: number): StellarMessage;

    value():
      | Error
      | Hello
      | Auth
      | DontHave
      | PeerAddress[]
      | Buffer
      | TransactionSet
      | TransactionEnvelope
      | SignedSurveyRequestMessage
      | SignedSurveyResponseMessage
      | Buffer
      | ScpQuorumSet
      | ScpEnvelope
      | number
      | void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): StellarMessage;

    static write(value: StellarMessage, io: Buffer): void;

    static isValid(value: StellarMessage): boolean;

    static toXDR(value: StellarMessage): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): StellarMessage;

    static fromXDR(input: string, format: 'hex' | 'base64'): StellarMessage;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AuthenticatedMessage {
    switch(): number;

    v0(value?: AuthenticatedMessageV0): AuthenticatedMessageV0;

    static 0(value: AuthenticatedMessageV0): AuthenticatedMessage;

    value(): AuthenticatedMessageV0;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class PublicKey {
    switch(): PublicKeyType;

    ed25519(value?: Buffer): Buffer;

    static publicKeyTypeEd25519(value: Buffer): PublicKey;

    value(): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PublicKey;

    static write(value: PublicKey, io: Buffer): void;

    static isValid(value: PublicKey): boolean;

    static toXDR(value: PublicKey): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PublicKey;

    static fromXDR(input: string, format: 'hex' | 'base64'): PublicKey;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class SignerKey {
    switch(): SignerKeyType;

    ed25519(value?: Buffer): Buffer;

    preAuthTx(value?: Buffer): Buffer;

    hashX(value?: Buffer): Buffer;

    static signerKeyTypeEd25519(value: Buffer): SignerKey;

    static signerKeyTypePreAuthTx(value: Buffer): SignerKey;

    static signerKeyTypeHashX(value: Buffer): SignerKey;

    value(): Buffer | Buffer | Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SignerKey;

    static write(value: SignerKey, io: Buffer): void;

    static isValid(value: SignerKey): boolean;

    static toXDR(value: SignerKey): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SignerKey;

    static fromXDR(input: string, format: 'hex' | 'base64'): SignerKey;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class MuxedAccount {
    switch(): CryptoKeyType;

    ed25519(value?: Buffer): Buffer;

    med25519(value?: MuxedAccountMed25519): MuxedAccountMed25519;

    static keyTypeEd25519(value: Buffer): MuxedAccount;

    static keyTypeMuxedEd25519(value: MuxedAccountMed25519): MuxedAccount;

    value(): Buffer | MuxedAccountMed25519;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): MuxedAccount;

    static write(value: MuxedAccount, io: Buffer): void;

    static isValid(value: MuxedAccount): boolean;

    static toXDR(value: MuxedAccount): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): MuxedAccount;

    static fromXDR(input: string, format: 'hex' | 'base64'): MuxedAccount;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AllowTrustOpAsset {
    switch(): AssetType;

    assetCode4(value?: Buffer): Buffer;

    assetCode12(value?: Buffer): Buffer;

    static assetTypeCreditAlphanum4(value: Buffer): AllowTrustOpAsset;

    static assetTypeCreditAlphanum12(value: Buffer): AllowTrustOpAsset;

    value(): Buffer | Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AllowTrustOpAsset;

    static write(value: AllowTrustOpAsset, io: Buffer): void;

    static isValid(value: AllowTrustOpAsset): boolean;

    static toXDR(value: AllowTrustOpAsset): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AllowTrustOpAsset;

    static fromXDR(input: string, format: 'hex' | 'base64'): AllowTrustOpAsset;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class RevokeSponsorshipOp {
    switch(): RevokeSponsorshipType;

    ledgerKey(value?: LedgerKey): LedgerKey;

    signer(value?: RevokeSponsorshipOpSigner): RevokeSponsorshipOpSigner;

    static revokeSponsorshipLedgerEntry(value: LedgerKey): RevokeSponsorshipOp;

    static revokeSponsorshipSigner(
      value: RevokeSponsorshipOpSigner
    ): RevokeSponsorshipOp;

    value(): LedgerKey | RevokeSponsorshipOpSigner;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): RevokeSponsorshipOp;

    static write(value: RevokeSponsorshipOp, io: Buffer): void;

    static isValid(value: RevokeSponsorshipOp): boolean;

    static toXDR(value: RevokeSponsorshipOp): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): RevokeSponsorshipOp;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): RevokeSponsorshipOp;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    createClaimableBalanceOp(
      value?: CreateClaimableBalanceOp
    ): CreateClaimableBalanceOp;

    claimClaimableBalanceOp(
      value?: ClaimClaimableBalanceOp
    ): ClaimClaimableBalanceOp;

    beginSponsoringFutureReservesOp(
      value?: BeginSponsoringFutureReservesOp
    ): BeginSponsoringFutureReservesOp;

    revokeSponsorshipOp(value?: RevokeSponsorshipOp): RevokeSponsorshipOp;

    static createAccount(value: CreateAccountOp): OperationBody;

    static payment(value: PaymentOp): OperationBody;

    static pathPaymentStrictReceive(
      value: PathPaymentStrictReceiveOp
    ): OperationBody;

    static manageSellOffer(value: ManageSellOfferOp): OperationBody;

    static createPassiveSellOffer(
      value: CreatePassiveSellOfferOp
    ): OperationBody;

    static setOptions(value: SetOptionsOp): OperationBody;

    static changeTrust(value: ChangeTrustOp): OperationBody;

    static allowTrust(value: AllowTrustOp): OperationBody;

    static accountMerge(value: MuxedAccount): OperationBody;

    static inflation(): OperationBody;

    static manageData(value: ManageDataOp): OperationBody;

    static bumpSequence(value: BumpSequenceOp): OperationBody;

    static manageBuyOffer(value: ManageBuyOfferOp): OperationBody;

    static pathPaymentStrictSend(value: PathPaymentStrictSendOp): OperationBody;

    static createClaimableBalance(
      value: CreateClaimableBalanceOp
    ): OperationBody;

    static claimClaimableBalance(value: ClaimClaimableBalanceOp): OperationBody;

    static beginSponsoringFutureReserves(
      value: BeginSponsoringFutureReservesOp
    ): OperationBody;

    static endSponsoringFutureReserves(): OperationBody;

    static revokeSponsorship(value: RevokeSponsorshipOp): OperationBody;

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
      | PathPaymentStrictSendOp
      | CreateClaimableBalanceOp
      | ClaimClaimableBalanceOp
      | BeginSponsoringFutureReservesOp
      | RevokeSponsorshipOp
      | void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OperationBody;

    static write(value: OperationBody, io: Buffer): void;

    static isValid(value: OperationBody): boolean;

    static toXDR(value: OperationBody): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OperationBody;

    static fromXDR(input: string, format: 'hex' | 'base64'): OperationBody;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class OperationId {
    switch(): EnvelopeType;

    id(value?: OperationIdId): OperationIdId;

    static envelopeTypeOpId(value: OperationIdId): OperationId;

    value(): OperationIdId;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OperationId;

    static write(value: OperationId, io: Buffer): void;

    static isValid(value: OperationId): boolean;

    static toXDR(value: OperationId): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OperationId;

    static fromXDR(input: string, format: 'hex' | 'base64'): OperationId;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class Memo {
    switch(): MemoType;

    text(value?: string | Buffer): string | Buffer;

    id(value?: Uint64): Uint64;

    hash(value?: Buffer): Buffer;

    retHash(value?: Buffer): Buffer;

    static memoNone(): Memo;

    static memoText(value: string | Buffer): Memo;

    static memoId(value: Uint64): Memo;

    static memoHash(value: Buffer): Memo;

    static memoReturn(value: Buffer): Memo;

    value(): string | Buffer | Uint64 | Buffer | Buffer | void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Memo;

    static write(value: Memo, io: Buffer): void;

    static isValid(value: Memo): boolean;

    static toXDR(value: Memo): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Memo;

    static fromXDR(input: string, format: 'hex' | 'base64'): Memo;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionV0Ext {
    switch(): number;

    static 0(): TransactionV0Ext;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionV0Ext;

    static write(value: TransactionV0Ext, io: Buffer): void;

    static isValid(value: TransactionV0Ext): boolean;

    static toXDR(value: TransactionV0Ext): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionV0Ext;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionV0Ext;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionExt {
    switch(): number;

    static 0(): TransactionExt;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionExt;

    static write(value: TransactionExt, io: Buffer): void;

    static isValid(value: TransactionExt): boolean;

    static toXDR(value: TransactionExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionExt;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class FeeBumpTransactionInnerTx {
    switch(): EnvelopeType;

    v1(value?: TransactionV1Envelope): TransactionV1Envelope;

    static envelopeTypeTx(
      value: TransactionV1Envelope
    ): FeeBumpTransactionInnerTx;

    value(): TransactionV1Envelope;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class FeeBumpTransactionExt {
    switch(): number;

    static 0(): FeeBumpTransactionExt;

    value(): void;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionEnvelope {
    switch(): EnvelopeType;

    v0(value?: TransactionV0Envelope): TransactionV0Envelope;

    v1(value?: TransactionV1Envelope): TransactionV1Envelope;

    feeBump(value?: FeeBumpTransactionEnvelope): FeeBumpTransactionEnvelope;

    static envelopeTypeTxV0(value: TransactionV0Envelope): TransactionEnvelope;

    static envelopeTypeTx(value: TransactionV1Envelope): TransactionEnvelope;

    static envelopeTypeTxFeeBump(
      value: FeeBumpTransactionEnvelope
    ): TransactionEnvelope;

    value():
      | TransactionV0Envelope
      | TransactionV1Envelope
      | FeeBumpTransactionEnvelope;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionSignaturePayloadTaggedTransaction {
    switch(): EnvelopeType;

    tx(value?: Transaction): Transaction;

    feeBump(value?: FeeBumpTransaction): FeeBumpTransaction;

    static envelopeTypeTx(
      value: Transaction
    ): TransactionSignaturePayloadTaggedTransaction;

    static envelopeTypeTxFeeBump(
      value: FeeBumpTransaction
    ): TransactionSignaturePayloadTaggedTransaction;

    value(): Transaction | FeeBumpTransaction;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class CreateAccountResult {
    switch(): CreateAccountResultCode;

    static createAccountSuccess(): CreateAccountResult;

    value(): void;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class PaymentResult {
    switch(): PaymentResultCode;

    static paymentSuccess(): PaymentResult;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): PaymentResult;

    static write(value: PaymentResult, io: Buffer): void;

    static isValid(value: PaymentResult): boolean;

    static toXDR(value: PaymentResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): PaymentResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): PaymentResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class PathPaymentStrictReceiveResult {
    switch(): PathPaymentStrictReceiveResultCode;

    success(
      value?: PathPaymentStrictReceiveResultSuccess
    ): PathPaymentStrictReceiveResultSuccess;

    noIssuer(value?: Asset): Asset;

    static pathPaymentStrictReceiveSuccess(
      value: PathPaymentStrictReceiveResultSuccess
    ): PathPaymentStrictReceiveResult;

    static pathPaymentStrictReceiveNoIssuer(
      value: Asset
    ): PathPaymentStrictReceiveResult;

    value(): PathPaymentStrictReceiveResultSuccess | Asset;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class PathPaymentStrictSendResult {
    switch(): PathPaymentStrictSendResultCode;

    success(
      value?: PathPaymentStrictSendResultSuccess
    ): PathPaymentStrictSendResultSuccess;

    noIssuer(value?: Asset): Asset;

    static pathPaymentStrictSendSuccess(
      value: PathPaymentStrictSendResultSuccess
    ): PathPaymentStrictSendResult;

    static pathPaymentStrictSendNoIssuer(
      value: Asset
    ): PathPaymentStrictSendResult;

    value(): PathPaymentStrictSendResultSuccess | Asset;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ManageOfferSuccessResultOffer {
    switch(): ManageOfferEffect;

    offer(value?: OfferEntry): OfferEntry;

    static manageOfferCreated(value: OfferEntry): ManageOfferSuccessResultOffer;

    static manageOfferUpdated(value: OfferEntry): ManageOfferSuccessResultOffer;

    value(): OfferEntry;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ManageSellOfferResult {
    switch(): ManageSellOfferResultCode;

    success(value?: ManageOfferSuccessResult): ManageOfferSuccessResult;

    static manageSellOfferSuccess(
      value: ManageOfferSuccessResult
    ): ManageSellOfferResult;

    value(): ManageOfferSuccessResult;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ManageBuyOfferResult {
    switch(): ManageBuyOfferResultCode;

    success(value?: ManageOfferSuccessResult): ManageOfferSuccessResult;

    static manageBuyOfferSuccess(
      value: ManageOfferSuccessResult
    ): ManageBuyOfferResult;

    value(): ManageOfferSuccessResult;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class SetOptionsResult {
    switch(): SetOptionsResultCode;

    static setOptionsSuccess(): SetOptionsResult;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): SetOptionsResult;

    static write(value: SetOptionsResult, io: Buffer): void;

    static isValid(value: SetOptionsResult): boolean;

    static toXDR(value: SetOptionsResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): SetOptionsResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): SetOptionsResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ChangeTrustResult {
    switch(): ChangeTrustResultCode;

    static changeTrustSuccess(): ChangeTrustResult;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ChangeTrustResult;

    static write(value: ChangeTrustResult, io: Buffer): void;

    static isValid(value: ChangeTrustResult): boolean;

    static toXDR(value: ChangeTrustResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ChangeTrustResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): ChangeTrustResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AllowTrustResult {
    switch(): AllowTrustResultCode;

    static allowTrustSuccess(): AllowTrustResult;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AllowTrustResult;

    static write(value: AllowTrustResult, io: Buffer): void;

    static isValid(value: AllowTrustResult): boolean;

    static toXDR(value: AllowTrustResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AllowTrustResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): AllowTrustResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AccountMergeResult {
    switch(): AccountMergeResultCode;

    sourceAccountBalance(value?: Int64): Int64;

    static accountMergeSuccess(value: Int64): AccountMergeResult;

    value(): Int64;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AccountMergeResult;

    static write(value: AccountMergeResult, io: Buffer): void;

    static isValid(value: AccountMergeResult): boolean;

    static toXDR(value: AccountMergeResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AccountMergeResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): AccountMergeResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class InflationResult {
    switch(): InflationResultCode;

    payouts(value?: InflationPayout[]): InflationPayout[];

    static inflationSuccess(value: InflationPayout[]): InflationResult;

    value(): InflationPayout[];

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): InflationResult;

    static write(value: InflationResult, io: Buffer): void;

    static isValid(value: InflationResult): boolean;

    static toXDR(value: InflationResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): InflationResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): InflationResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ManageDataResult {
    switch(): ManageDataResultCode;

    static manageDataSuccess(): ManageDataResult;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ManageDataResult;

    static write(value: ManageDataResult, io: Buffer): void;

    static isValid(value: ManageDataResult): boolean;

    static toXDR(value: ManageDataResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ManageDataResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): ManageDataResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class BumpSequenceResult {
    switch(): BumpSequenceResultCode;

    static bumpSequenceSuccess(): BumpSequenceResult;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): BumpSequenceResult;

    static write(value: BumpSequenceResult, io: Buffer): void;

    static isValid(value: BumpSequenceResult): boolean;

    static toXDR(value: BumpSequenceResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): BumpSequenceResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): BumpSequenceResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class CreateClaimableBalanceResult {
    switch(): CreateClaimableBalanceResultCode;

    balanceId(value?: ClaimableBalanceId): ClaimableBalanceId;

    static createClaimableBalanceSuccess(
      value: ClaimableBalanceId
    ): CreateClaimableBalanceResult;

    value(): ClaimableBalanceId;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): CreateClaimableBalanceResult;

    static write(value: CreateClaimableBalanceResult, io: Buffer): void;

    static isValid(value: CreateClaimableBalanceResult): boolean;

    static toXDR(value: CreateClaimableBalanceResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): CreateClaimableBalanceResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): CreateClaimableBalanceResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ClaimClaimableBalanceResult {
    switch(): ClaimClaimableBalanceResultCode;

    static claimClaimableBalanceSuccess(): ClaimClaimableBalanceResult;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ClaimClaimableBalanceResult;

    static write(value: ClaimClaimableBalanceResult, io: Buffer): void;

    static isValid(value: ClaimClaimableBalanceResult): boolean;

    static toXDR(value: ClaimClaimableBalanceResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ClaimClaimableBalanceResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ClaimClaimableBalanceResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class BeginSponsoringFutureReservesResult {
    switch(): BeginSponsoringFutureReservesResultCode;

    static beginSponsoringFutureReservesSuccess(): BeginSponsoringFutureReservesResult;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): BeginSponsoringFutureReservesResult;

    static write(value: BeginSponsoringFutureReservesResult, io: Buffer): void;

    static isValid(value: BeginSponsoringFutureReservesResult): boolean;

    static toXDR(value: BeginSponsoringFutureReservesResult): Buffer;

    static fromXDR(
      input: Buffer,
      format?: 'raw'
    ): BeginSponsoringFutureReservesResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): BeginSponsoringFutureReservesResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class EndSponsoringFutureReservesResult {
    switch(): EndSponsoringFutureReservesResultCode;

    static endSponsoringFutureReservesSuccess(): EndSponsoringFutureReservesResult;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): EndSponsoringFutureReservesResult;

    static write(value: EndSponsoringFutureReservesResult, io: Buffer): void;

    static isValid(value: EndSponsoringFutureReservesResult): boolean;

    static toXDR(value: EndSponsoringFutureReservesResult): Buffer;

    static fromXDR(
      input: Buffer,
      format?: 'raw'
    ): EndSponsoringFutureReservesResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): EndSponsoringFutureReservesResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class RevokeSponsorshipResult {
    switch(): RevokeSponsorshipResultCode;

    static revokeSponsorshipSuccess(): RevokeSponsorshipResult;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): RevokeSponsorshipResult;

    static write(value: RevokeSponsorshipResult, io: Buffer): void;

    static isValid(value: RevokeSponsorshipResult): boolean;

    static toXDR(value: RevokeSponsorshipResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): RevokeSponsorshipResult;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): RevokeSponsorshipResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
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

    createClaimableBalanceResult(
      value?: CreateClaimableBalanceResult
    ): CreateClaimableBalanceResult;

    claimClaimableBalanceResult(
      value?: ClaimClaimableBalanceResult
    ): ClaimClaimableBalanceResult;

    beginSponsoringFutureReservesResult(
      value?: BeginSponsoringFutureReservesResult
    ): BeginSponsoringFutureReservesResult;

    endSponsoringFutureReservesResult(
      value?: EndSponsoringFutureReservesResult
    ): EndSponsoringFutureReservesResult;

    revokeSponsorshipResult(
      value?: RevokeSponsorshipResult
    ): RevokeSponsorshipResult;

    static createAccount(value: CreateAccountResult): OperationResultTr;

    static payment(value: PaymentResult): OperationResultTr;

    static pathPaymentStrictReceive(
      value: PathPaymentStrictReceiveResult
    ): OperationResultTr;

    static manageSellOffer(value: ManageSellOfferResult): OperationResultTr;

    static createPassiveSellOffer(
      value: ManageSellOfferResult
    ): OperationResultTr;

    static setOptions(value: SetOptionsResult): OperationResultTr;

    static changeTrust(value: ChangeTrustResult): OperationResultTr;

    static allowTrust(value: AllowTrustResult): OperationResultTr;

    static accountMerge(value: AccountMergeResult): OperationResultTr;

    static inflation(value: InflationResult): OperationResultTr;

    static manageData(value: ManageDataResult): OperationResultTr;

    static bumpSequence(value: BumpSequenceResult): OperationResultTr;

    static manageBuyOffer(value: ManageBuyOfferResult): OperationResultTr;

    static pathPaymentStrictSend(
      value: PathPaymentStrictSendResult
    ): OperationResultTr;

    static createClaimableBalance(
      value: CreateClaimableBalanceResult
    ): OperationResultTr;

    static claimClaimableBalance(
      value: ClaimClaimableBalanceResult
    ): OperationResultTr;

    static beginSponsoringFutureReserves(
      value: BeginSponsoringFutureReservesResult
    ): OperationResultTr;

    static endSponsoringFutureReserves(
      value: EndSponsoringFutureReservesResult
    ): OperationResultTr;

    static revokeSponsorship(value: RevokeSponsorshipResult): OperationResultTr;

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
      | PathPaymentStrictSendResult
      | CreateClaimableBalanceResult
      | ClaimClaimableBalanceResult
      | BeginSponsoringFutureReservesResult
      | EndSponsoringFutureReservesResult
      | RevokeSponsorshipResult;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OperationResultTr;

    static write(value: OperationResultTr, io: Buffer): void;

    static isValid(value: OperationResultTr): boolean;

    static toXDR(value: OperationResultTr): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OperationResultTr;

    static fromXDR(input: string, format: 'hex' | 'base64'): OperationResultTr;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class OperationResult {
    switch(): OperationResultCode;

    tr(value?: OperationResultTr): OperationResultTr;

    static opInner(value: OperationResultTr): OperationResult;

    value(): OperationResultTr;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OperationResult;

    static write(value: OperationResult, io: Buffer): void;

    static isValid(value: OperationResult): boolean;

    static toXDR(value: OperationResult): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OperationResult;

    static fromXDR(input: string, format: 'hex' | 'base64'): OperationResult;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class InnerTransactionResultResult {
    switch(): TransactionResultCode;

    results(value?: OperationResult[]): OperationResult[];

    static txSuccess(value: OperationResult[]): InnerTransactionResultResult;

    static txFailed(value: OperationResult[]): InnerTransactionResultResult;

    static txTooEarly(): InnerTransactionResultResult;

    static txTooLate(): InnerTransactionResultResult;

    static txMissingOperation(): InnerTransactionResultResult;

    static txBadSeq(): InnerTransactionResultResult;

    static txBadAuth(): InnerTransactionResultResult;

    static txInsufficientBalance(): InnerTransactionResultResult;

    static txNoAccount(): InnerTransactionResultResult;

    static txInsufficientFee(): InnerTransactionResultResult;

    static txBadAuthExtra(): InnerTransactionResultResult;

    static txInternalError(): InnerTransactionResultResult;

    static txNotSupported(): InnerTransactionResultResult;

    static txBadSponsorship(): InnerTransactionResultResult;

    value(): OperationResult[] | void;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class InnerTransactionResultExt {
    switch(): number;

    static 0(): InnerTransactionResultExt;

    value(): void;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionResultResult {
    switch(): TransactionResultCode;

    innerResultPair(
      value?: InnerTransactionResultPair
    ): InnerTransactionResultPair;

    results(value?: OperationResult[]): OperationResult[];

    static txFeeBumpInnerSuccess(
      value: InnerTransactionResultPair
    ): TransactionResultResult;

    static txFeeBumpInnerFailed(
      value: InnerTransactionResultPair
    ): TransactionResultResult;

    static txSuccess(value: OperationResult[]): TransactionResultResult;

    static txFailed(value: OperationResult[]): TransactionResultResult;

    value(): InnerTransactionResultPair | OperationResult[];

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionResultExt {
    switch(): number;

    static 0(): TransactionResultExt;

    value(): void;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ScpStatementPledges {
    switch(): ScpStatementType;

    prepare(value?: ScpStatementPrepare): ScpStatementPrepare;

    confirm(value?: ScpStatementConfirm): ScpStatementConfirm;

    externalize(value?: ScpStatementExternalize): ScpStatementExternalize;

    nominate(value?: ScpNomination): ScpNomination;

    static scpStPrepare(value: ScpStatementPrepare): ScpStatementPledges;

    static scpStConfirm(value: ScpStatementConfirm): ScpStatementPledges;

    static scpStExternalize(
      value: ScpStatementExternalize
    ): ScpStatementPledges;

    static scpStNominate(value: ScpNomination): ScpStatementPledges;

    value():
      | ScpStatementPrepare
      | ScpStatementConfirm
      | ScpStatementExternalize
      | ScpNomination;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class Asset {
    switch(): AssetType;

    alphaNum4(value?: AssetAlphaNum4): AssetAlphaNum4;

    alphaNum12(value?: AssetAlphaNum12): AssetAlphaNum12;

    static assetTypeNative(): Asset;

    static assetTypeCreditAlphanum4(value: AssetAlphaNum4): Asset;

    static assetTypeCreditAlphanum12(value: AssetAlphaNum12): Asset;

    value(): AssetAlphaNum4 | AssetAlphaNum12 | void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Asset;

    static write(value: Asset, io: Buffer): void;

    static isValid(value: Asset): boolean;

    static toXDR(value: Asset): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Asset;

    static fromXDR(input: string, format: 'hex' | 'base64'): Asset;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AccountEntryExtensionV2Ext {
    switch(): number;

    static 0(): AccountEntryExtensionV2Ext;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AccountEntryExtensionV2Ext;

    static write(value: AccountEntryExtensionV2Ext, io: Buffer): void;

    static isValid(value: AccountEntryExtensionV2Ext): boolean;

    static toXDR(value: AccountEntryExtensionV2Ext): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AccountEntryExtensionV2Ext;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): AccountEntryExtensionV2Ext;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AccountEntryExtensionV1Ext {
    switch(): number;

    v2(value?: AccountEntryExtensionV2): AccountEntryExtensionV2;

    static 0(): AccountEntryExtensionV1Ext;

    static 2(value: AccountEntryExtensionV2): AccountEntryExtensionV1Ext;

    value(): AccountEntryExtensionV2 | void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AccountEntryExtensionV1Ext;

    static write(value: AccountEntryExtensionV1Ext, io: Buffer): void;

    static isValid(value: AccountEntryExtensionV1Ext): boolean;

    static toXDR(value: AccountEntryExtensionV1Ext): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AccountEntryExtensionV1Ext;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): AccountEntryExtensionV1Ext;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class AccountEntryExt {
    switch(): number;

    v1(value?: AccountEntryExtensionV1): AccountEntryExtensionV1;

    static 0(): AccountEntryExt;

    static 1(value: AccountEntryExtensionV1): AccountEntryExt;

    value(): AccountEntryExtensionV1 | void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): AccountEntryExt;

    static write(value: AccountEntryExt, io: Buffer): void;

    static isValid(value: AccountEntryExt): boolean;

    static toXDR(value: AccountEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): AccountEntryExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): AccountEntryExt;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TrustLineEntryV1Ext {
    switch(): number;

    static 0(): TrustLineEntryV1Ext;

    value(): void;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TrustLineEntryExt {
    switch(): number;

    v1(value?: TrustLineEntryV1): TrustLineEntryV1;

    static 0(): TrustLineEntryExt;

    static 1(value: TrustLineEntryV1): TrustLineEntryExt;

    value(): TrustLineEntryV1 | void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TrustLineEntryExt;

    static write(value: TrustLineEntryExt, io: Buffer): void;

    static isValid(value: TrustLineEntryExt): boolean;

    static toXDR(value: TrustLineEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TrustLineEntryExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): TrustLineEntryExt;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class OfferEntryExt {
    switch(): number;

    static 0(): OfferEntryExt;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): OfferEntryExt;

    static write(value: OfferEntryExt, io: Buffer): void;

    static isValid(value: OfferEntryExt): boolean;

    static toXDR(value: OfferEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): OfferEntryExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): OfferEntryExt;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class DataEntryExt {
    switch(): number;

    static 0(): DataEntryExt;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): DataEntryExt;

    static write(value: DataEntryExt, io: Buffer): void;

    static isValid(value: DataEntryExt): boolean;

    static toXDR(value: DataEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): DataEntryExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): DataEntryExt;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ClaimPredicate {
    switch(): ClaimPredicateType;

    andPredicates(value?: ClaimPredicate[]): ClaimPredicate[];

    orPredicates(value?: ClaimPredicate[]): ClaimPredicate[];

    notPredicate(value?: null | ClaimPredicate): null | ClaimPredicate;

    absBefore(value?: Int64): Int64;

    relBefore(value?: Int64): Int64;

    static claimPredicateUnconditional(): ClaimPredicate;

    static claimPredicateAnd(value: ClaimPredicate[]): ClaimPredicate;

    static claimPredicateOr(value: ClaimPredicate[]): ClaimPredicate;

    static claimPredicateNot(value: null | ClaimPredicate): ClaimPredicate;

    static claimPredicateBeforeAbsoluteTime(value: Int64): ClaimPredicate;

    static claimPredicateBeforeRelativeTime(value: Int64): ClaimPredicate;

    value():
      | ClaimPredicate[]
      | ClaimPredicate[]
      | null
      | ClaimPredicate
      | Int64
      | Int64
      | void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ClaimPredicate;

    static write(value: ClaimPredicate, io: Buffer): void;

    static isValid(value: ClaimPredicate): boolean;

    static toXDR(value: ClaimPredicate): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ClaimPredicate;

    static fromXDR(input: string, format: 'hex' | 'base64'): ClaimPredicate;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class Claimant {
    switch(): ClaimantType;

    v0(value?: ClaimantV0): ClaimantV0;

    static claimantTypeV0(value: ClaimantV0): Claimant;

    value(): ClaimantV0;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): Claimant;

    static write(value: Claimant, io: Buffer): void;

    static isValid(value: Claimant): boolean;

    static toXDR(value: Claimant): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): Claimant;

    static fromXDR(input: string, format: 'hex' | 'base64'): Claimant;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ClaimableBalanceId {
    switch(): ClaimableBalanceIdType;

    v0(value?: Buffer): Buffer;

    static claimableBalanceIdTypeV0(value: Buffer): ClaimableBalanceId;

    value(): Buffer;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ClaimableBalanceId;

    static write(value: ClaimableBalanceId, io: Buffer): void;

    static isValid(value: ClaimableBalanceId): boolean;

    static toXDR(value: ClaimableBalanceId): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ClaimableBalanceId;

    static fromXDR(input: string, format: 'hex' | 'base64'): ClaimableBalanceId;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ClaimableBalanceEntryExt {
    switch(): number;

    static 0(): ClaimableBalanceEntryExt;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ClaimableBalanceEntryExt;

    static write(value: ClaimableBalanceEntryExt, io: Buffer): void;

    static isValid(value: ClaimableBalanceEntryExt): boolean;

    static toXDR(value: ClaimableBalanceEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ClaimableBalanceEntryExt;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): ClaimableBalanceEntryExt;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerEntryExtensionV1Ext {
    switch(): number;

    static 0(): LedgerEntryExtensionV1Ext;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerEntryExtensionV1Ext;

    static write(value: LedgerEntryExtensionV1Ext, io: Buffer): void;

    static isValid(value: LedgerEntryExtensionV1Ext): boolean;

    static toXDR(value: LedgerEntryExtensionV1Ext): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerEntryExtensionV1Ext;

    static fromXDR(
      input: string,
      format: 'hex' | 'base64'
    ): LedgerEntryExtensionV1Ext;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerEntryData {
    switch(): LedgerEntryType;

    account(value?: AccountEntry): AccountEntry;

    trustLine(value?: TrustLineEntry): TrustLineEntry;

    offer(value?: OfferEntry): OfferEntry;

    data(value?: DataEntry): DataEntry;

    claimableBalance(value?: ClaimableBalanceEntry): ClaimableBalanceEntry;

    static account(value: AccountEntry): LedgerEntryData;

    static trustline(value: TrustLineEntry): LedgerEntryData;

    static offer(value: OfferEntry): LedgerEntryData;

    static data(value: DataEntry): LedgerEntryData;

    static claimableBalance(value: ClaimableBalanceEntry): LedgerEntryData;

    value():
      | AccountEntry
      | TrustLineEntry
      | OfferEntry
      | DataEntry
      | ClaimableBalanceEntry;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerEntryData;

    static write(value: LedgerEntryData, io: Buffer): void;

    static isValid(value: LedgerEntryData): boolean;

    static toXDR(value: LedgerEntryData): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerEntryData;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerEntryData;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerEntryExt {
    switch(): number;

    v1(value?: LedgerEntryExtensionV1): LedgerEntryExtensionV1;

    static 0(): LedgerEntryExt;

    static 1(value: LedgerEntryExtensionV1): LedgerEntryExt;

    value(): LedgerEntryExtensionV1 | void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerEntryExt;

    static write(value: LedgerEntryExt, io: Buffer): void;

    static isValid(value: LedgerEntryExt): boolean;

    static toXDR(value: LedgerEntryExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerEntryExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerEntryExt;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerKey {
    switch(): LedgerEntryType;

    account(value?: LedgerKeyAccount): LedgerKeyAccount;

    trustLine(value?: LedgerKeyTrustLine): LedgerKeyTrustLine;

    offer(value?: LedgerKeyOffer): LedgerKeyOffer;

    data(value?: LedgerKeyData): LedgerKeyData;

    claimableBalance(
      value?: LedgerKeyClaimableBalance
    ): LedgerKeyClaimableBalance;

    static account(value: LedgerKeyAccount): LedgerKey;

    static trustline(value: LedgerKeyTrustLine): LedgerKey;

    static offer(value: LedgerKeyOffer): LedgerKey;

    static data(value: LedgerKeyData): LedgerKey;

    static claimableBalance(value: LedgerKeyClaimableBalance): LedgerKey;

    value():
      | LedgerKeyAccount
      | LedgerKeyTrustLine
      | LedgerKeyOffer
      | LedgerKeyData
      | LedgerKeyClaimableBalance;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerKey;

    static write(value: LedgerKey, io: Buffer): void;

    static isValid(value: LedgerKey): boolean;

    static toXDR(value: LedgerKey): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerKey;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerKey;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class StellarValueExt {
    switch(): StellarValueType;

    lcValueSignature(
      value?: LedgerCloseValueSignature
    ): LedgerCloseValueSignature;

    static stellarValueBasic(): StellarValueExt;

    static stellarValueSigned(
      value: LedgerCloseValueSignature
    ): StellarValueExt;

    value(): LedgerCloseValueSignature | void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): StellarValueExt;

    static write(value: StellarValueExt, io: Buffer): void;

    static isValid(value: StellarValueExt): boolean;

    static toXDR(value: StellarValueExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): StellarValueExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): StellarValueExt;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerHeaderExt {
    switch(): number;

    static 0(): LedgerHeaderExt;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerHeaderExt;

    static write(value: LedgerHeaderExt, io: Buffer): void;

    static isValid(value: LedgerHeaderExt): boolean;

    static toXDR(value: LedgerHeaderExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerHeaderExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerHeaderExt;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerUpgrade {
    switch(): LedgerUpgradeType;

    newLedgerVersion(value?: number): number;

    newBaseFee(value?: number): number;

    newMaxTxSetSize(value?: number): number;

    newBaseReserve(value?: number): number;

    static ledgerUpgradeVersion(value: number): LedgerUpgrade;

    static ledgerUpgradeBaseFee(value: number): LedgerUpgrade;

    static ledgerUpgradeMaxTxSetSize(value: number): LedgerUpgrade;

    static ledgerUpgradeBaseReserve(value: number): LedgerUpgrade;

    value(): number | number | number | number;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerUpgrade;

    static write(value: LedgerUpgrade, io: Buffer): void;

    static isValid(value: LedgerUpgrade): boolean;

    static toXDR(value: LedgerUpgrade): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerUpgrade;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerUpgrade;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class BucketMetadataExt {
    switch(): number;

    static 0(): BucketMetadataExt;

    value(): void;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): BucketMetadataExt;

    static write(value: BucketMetadataExt, io: Buffer): void;

    static isValid(value: BucketMetadataExt): boolean;

    static toXDR(value: BucketMetadataExt): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): BucketMetadataExt;

    static fromXDR(input: string, format: 'hex' | 'base64'): BucketMetadataExt;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class BucketEntry {
    switch(): BucketEntryType;

    liveEntry(value?: LedgerEntry): LedgerEntry;

    deadEntry(value?: LedgerKey): LedgerKey;

    metaEntry(value?: BucketMetadata): BucketMetadata;

    static liveentry(value: LedgerEntry): BucketEntry;

    static initentry(value: LedgerEntry): BucketEntry;

    static deadentry(value: LedgerKey): BucketEntry;

    static metaentry(value: BucketMetadata): BucketEntry;

    value(): LedgerEntry | LedgerKey | BucketMetadata;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): BucketEntry;

    static write(value: BucketEntry, io: Buffer): void;

    static isValid(value: BucketEntry): boolean;

    static toXDR(value: BucketEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): BucketEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): BucketEntry;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionHistoryEntryExt {
    switch(): number;

    static 0(): TransactionHistoryEntryExt;

    value(): void;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionHistoryResultEntryExt {
    switch(): number;

    static 0(): TransactionHistoryResultEntryExt;

    value(): void;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerHeaderHistoryEntryExt {
    switch(): number;

    static 0(): LedgerHeaderHistoryEntryExt;

    value(): void;

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

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class ScpHistoryEntry {
    switch(): number;

    v0(value?: ScpHistoryEntryV0): ScpHistoryEntryV0;

    static 0(value: ScpHistoryEntryV0): ScpHistoryEntry;

    value(): ScpHistoryEntryV0;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): ScpHistoryEntry;

    static write(value: ScpHistoryEntry, io: Buffer): void;

    static isValid(value: ScpHistoryEntry): boolean;

    static toXDR(value: ScpHistoryEntry): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): ScpHistoryEntry;

    static fromXDR(input: string, format: 'hex' | 'base64'): ScpHistoryEntry;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerEntryChange {
    switch(): LedgerEntryChangeType;

    created(value?: LedgerEntry): LedgerEntry;

    updated(value?: LedgerEntry): LedgerEntry;

    removed(value?: LedgerKey): LedgerKey;

    state(value?: LedgerEntry): LedgerEntry;

    static ledgerEntryCreated(value: LedgerEntry): LedgerEntryChange;

    static ledgerEntryUpdated(value: LedgerEntry): LedgerEntryChange;

    static ledgerEntryRemoved(value: LedgerKey): LedgerEntryChange;

    static ledgerEntryState(value: LedgerEntry): LedgerEntryChange;

    value(): LedgerEntry | LedgerEntry | LedgerKey | LedgerEntry;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerEntryChange;

    static write(value: LedgerEntryChange, io: Buffer): void;

    static isValid(value: LedgerEntryChange): boolean;

    static toXDR(value: LedgerEntryChange): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerEntryChange;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerEntryChange;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class TransactionMeta {
    switch(): number;

    operations(value?: OperationMeta[]): OperationMeta[];

    v1(value?: TransactionMetaV1): TransactionMetaV1;

    v2(value?: TransactionMetaV2): TransactionMetaV2;

    static 0(value: OperationMeta[]): TransactionMeta;

    static 1(value: TransactionMetaV1): TransactionMeta;

    static 2(value: TransactionMetaV2): TransactionMeta;

    value(): OperationMeta[] | TransactionMetaV1 | TransactionMetaV2;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): TransactionMeta;

    static write(value: TransactionMeta, io: Buffer): void;

    static isValid(value: TransactionMeta): boolean;

    static toXDR(value: TransactionMeta): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): TransactionMeta;

    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionMeta;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }

  class LedgerCloseMeta {
    switch(): number;

    v0(value?: LedgerCloseMetaV0): LedgerCloseMetaV0;

    static 0(value: LedgerCloseMetaV0): LedgerCloseMeta;

    value(): LedgerCloseMetaV0;

    toXDR(format?: 'raw'): Buffer;

    toXDR(format: 'hex' | 'base64'): string;

    static read(io: Buffer): LedgerCloseMeta;

    static write(value: LedgerCloseMeta, io: Buffer): void;

    static isValid(value: LedgerCloseMeta): boolean;

    static toXDR(value: LedgerCloseMeta): Buffer;

    static fromXDR(input: Buffer, format?: 'raw'): LedgerCloseMeta;

    static fromXDR(input: string, format: 'hex' | 'base64'): LedgerCloseMeta;

    static validateXDR(input: Buffer, format?: 'raw'): boolean;

    static validateXDR(input: string, format: 'hex' | 'base64'): boolean;
  }
}

export default xdr;
