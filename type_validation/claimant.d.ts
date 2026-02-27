import xdr from "./xdr.js";
/**
 * Claimant class represents an xdr.Claimant
 *
 * The claim predicate is optional, it defaults to unconditional if none is specified.
 *
 * @constructor
 * @param destination - The destination account ID.
 * @param [predicate] - The claim predicate.
 */
export declare class Claimant {
    private _destination;
    private _predicate;
    constructor(destination: string, predicate?: xdr.ClaimPredicate);
    /**
     * Returns an unconditional claim predicate
     */
    static predicateUnconditional(): xdr.ClaimPredicate;
    /**
     * Returns an `and` claim predicate
     * @param left an xdr.ClaimPredicate
     * @param right an xdr.ClaimPredicate
     */
    static predicateAnd(left: xdr.ClaimPredicate, right: xdr.ClaimPredicate): xdr.ClaimPredicate;
    /**
     * Returns an `or` claim predicate
     * @param left an xdr.ClaimPredicate
     * @param right an xdr.ClaimPredicate
     */
    static predicateOr(left: xdr.ClaimPredicate, right: xdr.ClaimPredicate): xdr.ClaimPredicate;
    /**
     * Returns a `not` claim predicate
     * @param predicate an xdr.ClaimPredicate
     */
    static predicateNot(predicate: xdr.ClaimPredicate): xdr.ClaimPredicate;
    /**
     * Returns a `BeforeAbsoluteTime` claim predicate
     *
     * This predicate will be fulfilled if the closing time of the ledger that
     * includes the CreateClaimableBalance operation is less than this (absolute)
     * Unix timestamp (expressed in seconds).
     *
     * @param absBefore Unix epoch (in seconds) as a string
     */
    static predicateBeforeAbsoluteTime(absBefore: string): xdr.ClaimPredicate;
    /**
     * Returns a `BeforeRelativeTime` claim predicate
     *
     * This predicate will be fulfilled if the closing time of the ledger that
     * includes the CreateClaimableBalance operation plus this relative time delta
     * (in seconds) is less than the current time.
     *
     * @param seconds seconds since closeTime of the ledger in which the ClaimableBalanceEntry was created (as string)
     */
    static predicateBeforeRelativeTime(seconds: string): xdr.ClaimPredicate;
    /**
     * Returns a claimant object from its XDR object representation.
     * @param claimantXdr - The claimant xdr object.
     */
    static fromXDR(claimantXdr: xdr.Claimant): Claimant;
    /**
     * Returns the xdr object for this claimant.
     * @returns XDR Claimant object
     */
    toXDRObject(): xdr.Claimant;
    /**
     * @type {string}
     * @readonly
     */
    get destination(): string;
    set destination(_value: string);
    /**
     * @type {xdr.ClaimPredicate}
     * @readonly
     */
    get predicate(): xdr.ClaimPredicate;
    set predicate(_value: xdr.ClaimPredicate);
}
