/**
 * Create a new Account object.
 *
 * `Account` represents a single account in the Stellar network and its sequence
 * number. Account tracks the sequence number as it is used by {@link
 * TransactionBuilder}. See
 * [Accounts](https://developers.stellar.org/docs/glossary/accounts/) for
 * more information about how accounts work in Stellar.
 *
 * @constructor
 *
 * @param accountId - ID of the account (ex.
 *     `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`). If you
 *     provide a muxed account address, this will throw; use {@link
 *     MuxedAccount} instead.
 * @param sequence  - current sequence number of the account
 */
export declare class Account {
    private _accountId;
    private sequence;
    constructor(accountId: string, sequence: string);
    /**
     * Returns Stellar account ID, ex.
     * `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`.
     */
    accountId(): string;
    /**
     * @returns sequence number for the account as a string
     */
    sequenceNumber(): string;
    /**
     * Increments sequence number in this object by one.
     */
    incrementSequenceNumber(): void;
}
