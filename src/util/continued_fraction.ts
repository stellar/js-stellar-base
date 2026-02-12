import BigNumber from "./bignumber.js";

const MAX_INT = ((1 << 31) >>> 0) - 1;

/**
 * Calculates and returns the best rational approximation of the given real number.
 * @private
 * @param rawNumber - Real number
 * @throws Error Throws `Error` when the best rational approximation cannot be found.
 * @returns first element is n (numerator), second element is d (denominator)
 */
export function best_r(
  rawNumber: BigNumber | number | string,
): [number, number] {
  let number = new BigNumber(rawNumber);
  let a;
  let f;
  const fractions: [BigNumber, BigNumber][] = [
    [new BigNumber(0), new BigNumber(1)],
    [new BigNumber(1), new BigNumber(0)],
  ];
  let i = 2;

  while (true) {
    if (number.gt(MAX_INT)) {
      break;
    }
    a = number.integerValue(BigNumber.ROUND_FLOOR);
    f = number.minus(a);
    const prev1 = fractions[i - 1];
    const prev2 = fractions[i - 2];
    if (!prev1 || !prev2) {
      throw new Error(
        `Continued fraction approximation failed: missing fraction elements at indices ${i - 1} and/or ${i - 2}`,
      );
    }
    const h = a.times(prev1[0]).plus(prev2[0]);
    const k = a.times(prev1[1]).plus(prev2[1]);
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
  const lastFraction = fractions[fractions.length - 1];
  if (!lastFraction) {
    throw new Error(
      "Missing last fraction element in continued fraction approximation",
    );
  }
  const [n, d] = lastFraction;

  if (n.isZero() || d.isZero()) {
    throw new Error("Couldn't find approximation");
  }

  return [n.toNumber(), d.toNumber()];
}
