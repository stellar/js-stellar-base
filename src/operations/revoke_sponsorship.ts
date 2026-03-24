import xdr from "../xdr.js";
import { StrKey } from "../strkey.js";
import { Keypair } from "../keypair.js";
import { Asset } from "../asset.js";
import { LiquidityPoolId } from "../liquidity_pool_id.js";
import {
  RevokeAccountSponsorshipOpts,
  RevokeTrustlineSponsorshipOpts,
  RevokeOfferSponsorshipOpts,
  RevokeDataSponsorshipOpts,
  RevokeClaimableBalanceSponsorshipOpts,
  RevokeLiquidityPoolSponsorshipOpts,
  RevokeSignerSponsorshipOpts,
  OperationAttributes,
  OperationClass,
} from "./types.js";

/**
 * Create a "revoke sponsorship" operation for an account.
 *
 * @alias Operation.revokeAccountSponsorship
 * @param opts - Options object
 * @param opts.account - The sponsored account ID.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeAccountSponsorship({
 *   account: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
 * });
 */
export function revokeAccountSponsorship(
  this: OperationClass,
  opts: RevokeAccountSponsorshipOpts = {} as RevokeAccountSponsorshipOpts,
): xdr.Operation {
  if (!StrKey.isValidEd25519PublicKey(opts.account)) {
    throw new Error("account is invalid");
  }

  const ledgerKey = xdr.LedgerKey.account(
    new xdr.LedgerKeyAccount({
      accountId: Keypair.fromPublicKey(opts.account).xdrAccountId(),
    }),
  );
  const op = xdr.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(ledgerKey);

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.revokeSponsorship(op),
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}

/**
 * Create a "revoke sponsorship" operation for a trustline.
 *
 * @alias Operation.revokeTrustlineSponsorship
 * @param opts - Options object
 * @param opts.account - The account ID which owns the trustline.
 * @param opts.asset - The trustline asset.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeTrustlineSponsorship({
 *   account: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7',
 *   asset: new StellarBase.LiquidityPoolId(
 *     'USDUSD',
 *     'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
 *   )
 * });
 */
export function revokeTrustlineSponsorship(
  this: OperationClass,
  opts: RevokeTrustlineSponsorshipOpts = {} as RevokeTrustlineSponsorshipOpts,
): xdr.Operation {
  if (!StrKey.isValidEd25519PublicKey(opts.account)) {
    throw new Error("account is invalid");
  }

  let asset: xdr.TrustLineAsset;

  if (opts.asset instanceof Asset) {
    asset = opts.asset.toTrustLineXDRObject();
  } else if (opts.asset instanceof LiquidityPoolId) {
    asset = opts.asset.toXDRObject();
  } else {
    throw new TypeError("asset must be an Asset or LiquidityPoolId");
  }

  const ledgerKey = xdr.LedgerKey.trustline(
    new xdr.LedgerKeyTrustLine({
      accountId: Keypair.fromPublicKey(opts.account).xdrAccountId(),
      asset,
    }),
  );
  const op = xdr.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(ledgerKey);

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.revokeSponsorship(op),
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}

/**
 * Create a "revoke sponsorship" operation for an offer.
 *
 * @alias Operation.revokeOfferSponsorship
 * @param opts - Options object
 * @param opts.seller - The account ID which created the offer.
 * @param opts.offerId - The offer ID.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeOfferSponsorship({
 *   seller: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7',
 *   offerId: '1234'
 * });
 */
export function revokeOfferSponsorship(
  this: OperationClass,
  opts: RevokeOfferSponsorshipOpts = {} as RevokeOfferSponsorshipOpts,
): xdr.Operation {
  if (!StrKey.isValidEd25519PublicKey(opts.seller)) {
    throw new Error("seller is invalid");
  }

  if (typeof opts.offerId !== "string") {
    throw new Error("offerId is invalid");
  }

  const ledgerKey = xdr.LedgerKey.offer(
    new xdr.LedgerKeyOffer({
      sellerId: Keypair.fromPublicKey(opts.seller).xdrAccountId(),
      offerId: xdr.Int64.fromString(opts.offerId),
    }),
  );
  const op = xdr.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(ledgerKey);

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.revokeSponsorship(op),
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}

/**
 * Create a "revoke sponsorship" operation for a data entry.
 *
 * @alias Operation.revokeDataSponsorship
 * @param opts - Options object
 * @param opts.account - The account ID which owns the data entry.
 * @param opts.name - The name of the data entry.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeDataSponsorship({
 *   account: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7',
 *   name: 'foo'
 * });
 */
export function revokeDataSponsorship(
  this: OperationClass,
  opts: RevokeDataSponsorshipOpts = {} as RevokeDataSponsorshipOpts,
): xdr.Operation {
  if (!StrKey.isValidEd25519PublicKey(opts.account)) {
    throw new Error("account is invalid");
  }

  if (typeof opts.name !== "string" || opts.name.length > 64) {
    throw new Error("name must be a string, up to 64 characters");
  }

  const ledgerKey = xdr.LedgerKey.data(
    new xdr.LedgerKeyData({
      accountId: Keypair.fromPublicKey(opts.account).xdrAccountId(),
      dataName: opts.name,
    }),
  );
  const op = xdr.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(ledgerKey);

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.revokeSponsorship(op),
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}

/**
 * Create a "revoke sponsorship" operation for a claimable balance.
 *
 * @alias Operation.revokeClaimableBalanceSponsorship
 * @param opts - Options object
 * @param opts.balanceId - The sponsored claimable balance ID.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeClaimableBalanceSponsorship({
 *   balanceId: '00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be',
 * });
 */
export function revokeClaimableBalanceSponsorship(
  this: OperationClass,
  opts: RevokeClaimableBalanceSponsorshipOpts = {} as RevokeClaimableBalanceSponsorshipOpts,
): xdr.Operation {
  if (typeof opts.balanceId !== "string") {
    throw new Error("balanceId is invalid");
  }

  const ledgerKey = xdr.LedgerKey.claimableBalance(
    new xdr.LedgerKeyClaimableBalance({
      balanceId: xdr.ClaimableBalanceId.fromXDR(opts.balanceId, "hex"),
    }),
  );
  const op = xdr.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(ledgerKey);

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.revokeSponsorship(op),
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}

/**
 * Creates a "revoke sponsorship" operation for a liquidity pool.
 *
 * @alias Operation.revokeLiquidityPoolSponsorship
 * @param opts - Options object.
 * @param opts.liquidityPoolId - The sponsored liquidity pool ID in 'hex' string.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeLiquidityPoolSponsorship({
 *   liquidityPoolId: 'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7',
 * });
 */
export function revokeLiquidityPoolSponsorship(
  this: OperationClass,
  opts: RevokeLiquidityPoolSponsorshipOpts = {} as RevokeLiquidityPoolSponsorshipOpts,
): xdr.Operation {
  if (typeof opts.liquidityPoolId !== "string") {
    throw new Error("liquidityPoolId is invalid");
  }

  const ledgerKey = xdr.LedgerKey.liquidityPool(
    new xdr.LedgerKeyLiquidityPool({
      liquidityPoolId: Buffer.from(
        opts.liquidityPoolId,
        "hex",
      ) as unknown as xdr.PoolId,
    }),
  );
  const op = xdr.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(ledgerKey);

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.revokeSponsorship(op),
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}

/**
 * Create a "revoke sponsorship" operation for a signer.
 *
 * @alias Operation.revokeSignerSponsorship
 * @param opts - Options object
 * @param opts.account - The account ID where the signer sponsorship is being removed from.
 * @param opts.signer - The signer whose sponsorship is being removed. Exactly one of the following must be set:
 * @param opts.signer.ed25519PublicKey - (optional) The ed25519 public key of the signer.
 * @param opts.signer.sha256Hash - (optional) sha256 hash (Buffer or hex string).
 * @param opts.signer.preAuthTx - (optional) Hash (Buffer or hex string) of transaction.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeSignerSponsorship({
 *   account: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7',
 *   signer: {
 *     ed25519PublicKey: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
 *   }
 * })
 */
export function revokeSignerSponsorship(
  this: OperationClass,
  opts: RevokeSignerSponsorshipOpts = {} as RevokeSignerSponsorshipOpts,
): xdr.Operation {
  if (!StrKey.isValidEd25519PublicKey(opts.account)) {
    throw new Error("account is invalid");
  }

  let key: xdr.SignerKey;

  if (opts.signer.ed25519PublicKey) {
    if (!StrKey.isValidEd25519PublicKey(opts.signer.ed25519PublicKey)) {
      throw new Error("signer.ed25519PublicKey is invalid.");
    }
    const rawKey = StrKey.decodeEd25519PublicKey(opts.signer.ed25519PublicKey);
    key = xdr.SignerKey.signerKeyTypeEd25519(rawKey);
  } else if (opts.signer.preAuthTx) {
    let buffer: Buffer;

    if (typeof opts.signer.preAuthTx === "string") {
      buffer = Buffer.from(opts.signer.preAuthTx, "hex");
    } else {
      buffer = opts.signer.preAuthTx;
    }

    if (!(Buffer.isBuffer(buffer) && buffer.length === 32)) {
      throw new Error("signer.preAuthTx must be 32 bytes Buffer.");
    }

    key = xdr.SignerKey.signerKeyTypePreAuthTx(buffer);
  } else if (opts.signer.sha256Hash) {
    let buffer: Buffer;

    if (typeof opts.signer.sha256Hash === "string") {
      buffer = Buffer.from(opts.signer.sha256Hash, "hex");
    } else {
      buffer = opts.signer.sha256Hash;
    }

    if (!(Buffer.isBuffer(buffer) && buffer.length === 32)) {
      throw new Error("signer.sha256Hash must be 32 bytes Buffer.");
    }

    key = xdr.SignerKey.signerKeyTypeHashX(buffer);
  } else {
    throw new Error("signer is invalid");
  }

  const signer = new xdr.RevokeSponsorshipOpSigner({
    accountId: Keypair.fromPublicKey(opts.account).xdrAccountId(),
    signerKey: key,
  });

  const op = xdr.RevokeSponsorshipOp.revokeSponsorshipSigner(signer);

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.revokeSponsorship(op),
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
