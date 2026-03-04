import { Asset } from "./asset.js";
export declare namespace LiquidityPoolType {
    type constantProduct = "constant_product";
}
export type LiquidityPoolType = LiquidityPoolType.constantProduct;
export declare namespace LiquidityPoolParameters {
    interface ConstantProduct {
        assetA: Asset;
        assetB: Asset;
        fee: number;
    }
}
export type LiquidityPoolParameters = LiquidityPoolParameters.ConstantProduct;
export declare const LiquidityPoolFeeV18 = 30;
/**
 * getLiquidityPoolId computes the Pool ID for the given assets, fee and pool type.
 *
 * @see [stellar-core getPoolID](https://github.com/stellar/stellar-core/blob/9f3a48c6a8f1aa77b6043a055d0638661f718080/src/ledger/test/LedgerTxnTests.cpp#L3746-L3751)
 *
 * @export
 * @param {string} liquidityPoolType – A string representing the liquidity pool type.
 * @param {object} liquidityPoolParameters        – The liquidity pool parameters.
 * @param {Asset}  liquidityPoolParameters.assetA – The first asset in the Pool, it must respect the rule assetA < assetB.
 * @param {Asset}  liquidityPoolParameters.assetB – The second asset in the Pool, it must respect the rule assetA < assetB.
 * @param {number} liquidityPoolParameters.fee    – The liquidity pool fee. For now the only fee supported is `30`.
 *
 * @return {Buffer} the raw Pool ID buffer, which can be stringfied with `toString('hex')`
 */
export declare function getLiquidityPoolId(liquidityPoolType: LiquidityPoolType, liquidityPoolParameters: LiquidityPoolParameters): Buffer<ArrayBufferLike>;
