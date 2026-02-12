/**
 * Calculates and returns the best rational approximation of the given real number.
 * @private
 * @param rawNumber - Real number
 * @throws Error Throws `Error` when the best rational approximation cannot be found.
 * @returns first element is n (numerator), second element is d (denominator)
 */
export declare function best_r(rawNumber: BigNumber | number | string): [number, number];
