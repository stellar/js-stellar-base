/**
 * Calculates and returns the best rational approximation of the given real
 * number as `[n, d]` where `n` is the numerator and `d` is the denominator.
 *
 * @param rawNumber - real number to approximate
 * @throws when the best rational approximation cannot be found
 */
export declare function best_r(rawNumber: BigNumber | number | string): [number, number];
