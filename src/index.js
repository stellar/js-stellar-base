/* eslint-disable import/no-import-module-exports */
import BigNumber from 'bignumber.js';
import xdr from './xdr';

BigNumber.DEBUG = true; // gives us exceptions on bad constructor values

export { xdr };
export { hash } from './hashing';
export { sign, verify, FastSigning } from './signing';
export {
  getLiquidityPoolId,
  LiquidityPoolFeeV18
} from './get_liquidity_pool_id';
export { Keypair } from './keypair';
export { UnsignedHyper, Hyper } from 'js-xdr';
export { TransactionBase } from './transaction_base';
export { Transaction } from './transaction';
export { FeeBumpTransaction } from './fee_bump_transaction';
export {
  TransactionBuilder,
  TimeoutInfinite,
  BASE_FEE
} from './transaction_builder';
export { Asset } from './asset';
export { LiquidityPoolAsset } from './liquidity_pool_asset';
export { LiquidityPoolId } from './liquidity_pool_id';
export {
  Operation,
  AuthRequiredFlag,
  AuthRevocableFlag,
  AuthImmutableFlag,
  AuthClawbackEnabledFlag
} from './operation';
export * from './memo';
export { Account } from './account';
export * from './address';
export { Contract } from './contract';
export { MuxedAccount } from './muxed_account';
export { Claimant } from './claimant';
export { Networks } from './network';
export { StrKey } from './strkey';
export { SignerKey } from './signerkey';
export {
  decodeAddressToMuxedAccount,
  encodeMuxedAccountToAddress,
  extractBaseAddress,
  encodeMuxedAccount
} from './util/decode_encode_muxed_account';

export {
  ScInt,
  XdrLargeInt,
  scValToBigInt,
  Uint256,
  Int256,
  Uint128,
  Int128
} from './numbers/index';

export * from './scval';

export default module.exports;
