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
 * Computes the Pool ID for the given assets, fee and pool type.
 *
 * Returns the raw Pool ID buffer, which can be stringified with
 * `toString('hex')`.
 *
 * @see [stellar-core getPoolID](https://github.com/stellar/stellar-core/blob/9f3a48c6a8f1aa77b6043a055d0638661f718080/src/ledger/test/LedgerTxnTests.cpp#L3746-L3751)
 *
 * @param liquidityPoolType - A string representing the liquidity pool type.
 * @param liquidityPoolParameters - The liquidity pool parameters.
 * @param liquidityPoolParameters.assetA - The first asset in the Pool, it must respect the rule assetA < assetB.
 * @param liquidityPoolParameters.assetB - The second asset in the Pool, it must respect the rule assetA < assetB.
 * @param liquidityPoolParameters.fee - The liquidity pool fee. For now the only fee supported is `30`.
 */
export declare function getLiquidityPoolId(liquidityPoolType: LiquidityPoolType, liquidityPoolParameters: LiquidityPoolParameters): Buffer<ArrayBufferLike>;
