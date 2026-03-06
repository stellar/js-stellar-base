import xdr from "../xdr.js";
import { CreateAccountOpts, OperationClass } from "./types.js";
/**
 * Create and fund a non-existent account.
 *
 * @function
 * @alias Operation.createAccount
 * @param opts - Options object
 * @param opts.destination - Destination account ID to create an account for.
 * @param opts.startingBalance - Amount in XLM the account should be funded for. Must be greater
 *     than the {@link https://developers.stellar.org/docs/glossary/fees/ | reserve balance amount}.
 * @param opts.source - The source account for the payment. Defaults to the transaction's source account.
 * @returns Create account operation
 */
export declare function createAccount(this: OperationClass, opts: CreateAccountOpts): xdr.Operation;
