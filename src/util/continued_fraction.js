import BigNumber from 'bignumber.js';

const MAX_INT = (1 << 31 >>> 0) - 1;

/**
 * Calculates and returns the best rational approximation of the given real number.
 * @private
 * @param {string|number|BigNumber} number
 * @throws Error Throws `Error` when the best rational approximation cannot be found.
 * @returns {array} first element is n (numerator), second element is d (denominator)
 */
export function best_r(number) {
  number = new BigNumber(number);
  var a;
  var f;
  var fractions = [
    [new BigNumber(0), new BigNumber(1)],
    [new BigNumber(1), new BigNumber(0)]
  ];
  var i = 2;
  while (true) {
    if (number.gt(MAX_INT)) {
      break;
    }
    a = number.floor();
    f = number.sub(a);
    var h = a.mul(fractions[i - 1][0]).add(fractions[i - 2][0]);
    var k = a.mul(fractions[i - 1][1]).add(fractions[i - 2][1]);
    if (h.gt(MAX_INT) || k.gt(MAX_INT)) {
      break;
    }
    fractions.push([h, k]);
    if (f.eq(0)) {
      break;
    }
    number = new BigNumber(1).div(f);
    i++;
  }
  let [n, d] = fractions[fractions.length - 1];

  if (n.isZero() || d.isZero()) {
    throw new Error("Couldn't find approximation");
  }

  return [n.toNumber(), d.toNumber()];
}
