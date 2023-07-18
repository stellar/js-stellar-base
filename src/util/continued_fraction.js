import BigNumber from 'bignumber.js';

// eslint-disable-next-line no-bitwise
const MAX_INT = ((1 << 31) >>> 0) - 1;

/**
 * Calculates and returns the best rational (fractional) approximation of the
 * given real number.
 *
 * @private
 *
 * This is used internally to convert real-number-like prices into fractions for
 * XDR to use as part of DEX offer & LP management.
 *
 * @param {string|number|BigInt} rawNumber  the "real" number to approximate
 *
 * @returns {number[]} the numerator and denominator of the fractional
 *  approximation, respectively, where neither value exceeds `MAX_INT32`
 *
 * @throws {Error} throws an `Error` when no good rational approximation can be
 *  found.
 */
export function best_r(rawNumber) {
  BigNumber.DEBUG = true; // gives us exceptions on bad constructor values

  // NOTE: We can't convert this to use BigInt because the rational component is
  // crucial to calculating the approximation.
  let number = BigNumber(rawNumber);
  let a;
  let f;

  // We start with 0/1 and 1/0 as our approximations (the latter is technically
  // undefined but we need it as a starting point)
  const fractions = [
    [new BigNumber(0), new BigNumber(1)],
    [new BigNumber(1), new BigNumber(0)]
  ];
  let i = 2;

  /*
  The algorithm is a form of the continued fraction expansion (hinted at by the
  filename):

  > A continued fraction is an expression obtained through an iterative process
  > of representing a number as the sum of its integer part and the reciprocal
  > of another number, then writing this other number as the sum of its integer
  > part and another reciprocal, and so on.

  https://en.wikipedia.org/wiki/Continued_fraction

  We run this loop until either:

   - any part of the fraction exceeds MAX_INT (though JS can handle bigger
     numbers just fine, the xdr.Price object uses int32 values), OR

   - the "remainder" (`f` in the below loop) is zero (this means we've gotten a
     perfect approximation)
   */
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Compare the delta between the rational `number` and its truncated integer
    // equivalent: `f` is everything after the decimal point.
    if (number.gt(MAX_INT)) {
      break;
    }
    a = number.integerValue(BigNumber.ROUND_FLOOR);
    f = number.minus(a);
    const h = a.times(fractions[i - 1][0]).plus(fractions[i - 2][0]);
    const k = a.times(fractions[i - 1][1]).plus(fractions[i - 2][1]);
    if (h.gt(MAX_INT) || k.gt(MAX_INT)) {
      break;
    }
    fractions.push([h, k]);
    if (f.eq(0)) {
      break;
    }
    number = new BigNumber(1).div(f);
    i += 1;
  }

  const [n, d] = fractions[fractions.length - 1];
  if (n.isZero() || d.isZero()) {
    throw new Error("Couldn't find approximation");
  }

  return [n.toNumber(), d.toNumber()];
}
