import { Asset } from '../asset';
import { SignerOptions, Signer } from './signer'
import { AuthFlag } from './auth';
import { xdr } from './xdr';

export namespace OperationType {
  export type CreateAccount = 'createAccount';
  export type Payment = 'payment';
  export type PathPayment = 'pathPayment';
  export type CreatePassiveSellOffer = 'createPassiveSellOffer';
  export type ManageSellOffer = 'manageSellOffer';
  export type ManageBuyOffer = 'manageBuyOffer';
  export type SetOptions = 'setOptions';
  export type ChangeTrust = 'changeTrust';
  export type AllowTrust = 'allowTrust';
  export type AccountMerge = 'accountMerge';
  export type Inflation = 'inflation';
  export type ManageData = 'manageData';
  export type BumpSequence = 'bumpSequence';
}

export type OperationType =
  | OperationType.CreateAccount
  | OperationType.Payment
  | OperationType.PathPayment
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
  export interface BaseOptions {
    source?: string;
  }
  export interface AccountMerge extends BaseOptions {
    destination: string;
  }
  export interface AllowTrust extends BaseOptions {
    trustor: string;
    assetCode: string;
    authorize?: boolean;
  }
  export interface ChangeTrust extends BaseOptions {
    asset: Asset;
    limit?: string;
  }
  export interface CreateAccount extends BaseOptions {
    destination: string;
    startingBalance: string;
  }
  export interface CreatePassiveSellOffer extends BaseOptions {
    selling: Asset;
    buying: Asset;
    amount: string;
    price: number | string | object /* bignumber.js */;
  }
  export interface ManageSellOffer extends CreatePassiveSellOffer {
    offerId?: number | string;
  }
  export interface ManageBuyOffer {
    selling: Asset;
    buying: Asset;
    buyAmount: string;
    price: number | string | object /* bignumber.js */;
    offerId?: number | string;
  }
  // tslint:disable-next-line
  export interface Inflation extends BaseOptions {
    // tslint:disable-line
  }
  export interface ManageData extends BaseOptions {
    name: string;
    value: string | Buffer;
  }
  export interface PathPayment extends BaseOptions {
    sendAsset: Asset;
    sendMax: string;
    destination: string;
    destAsset: Asset;
    destAmount: string;
    path?: Asset[];
  }
  export interface Payment extends BaseOptions {
    amount: string;
    asset: Asset;
    destination: string;
  }
  export interface SetOptions<T extends SignerOptions = never> extends BaseOptions {
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
  export interface BumpSequence extends BaseOptions {
    bumpTo: string;
  }
}

export type OperationOptions =
  | OperationOptions.CreateAccount
  | OperationOptions.Payment
  | OperationOptions.PathPayment
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
  export interface BaseOperation<T extends OperationType = OperationType> {
    type: T;
    source?: string;
  }

  export interface AccountMerge extends BaseOperation<OperationType.AccountMerge> {
    destination: string;
  }

  export interface AllowTrust extends BaseOperation<OperationType.AllowTrust> {
    trustor: string;
    assetCode: string;
    authorize: boolean | undefined;
  }

  export interface ChangeTrust extends BaseOperation<OperationType.ChangeTrust> {
    line: Asset;
    limit: string;
  }

  export interface CreateAccount extends BaseOperation<OperationType.CreateAccount> {
    destination: string;
    startingBalance: string;
  }

  export interface CreatePassiveSellOffer
    extends BaseOperation<OperationType.CreatePassiveSellOffer> {
    selling: Asset;
    buying: Asset;
    amount: string;
    price: string;
  }

  export interface Inflation extends BaseOperation<OperationType.Inflation> { }

  export interface ManageData extends BaseOperation<OperationType.ManageData> {
    name: string;
    value: Buffer;
  }

  export interface ManageSellOffer
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

  export interface ManageBuyOffer extends BaseOperation<OperationType.ManageBuyOffer> {
    selling: Asset;
    buying: Asset;
    buyAmount: string;
    price: string;
    offerId: string;
  }

  export interface PathPayment extends BaseOperation<OperationType.PathPayment> {
    sendAsset: Asset;
    sendMax: string;
    destination: string;
    destAsset: Asset;
    destAmount: string;
    path: Asset[];
  }

  function pathPayment(
    options: OperationOptions.PathPayment
  ): xdr.Operation<PathPayment>;

  export interface Payment extends BaseOperation<OperationType.Payment> {
    amount: string;
    asset: Asset;
    destination: string;
  }

  function payment(options: OperationOptions.Payment): xdr.Operation<Payment>;

  export interface SetOptions<T extends SignerOptions = SignerOptions>
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

  export interface BumpSequence extends BaseOperation<OperationType.BumpSequence> {
    bumpTo: string;
  }

  function fromXDRObject<T extends Operation = Operation>(
    xdrOperation: xdr.Operation<T>
  ): T;
}

export type Operation =
  | Operation.CreateAccount
  | Operation.Payment
  | Operation.PathPayment
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
