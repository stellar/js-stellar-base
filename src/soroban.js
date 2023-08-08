import BigNumber from 'bignumber.js';

/**
 * Soroban helper class
 * formatting, parsing, and etc
 * @class Soroban
 */
export class Soroban {
  /**
   * format token amount to its ideal specific number of decimals
   *
   * @param {BigNumber} amount - the token amount you want to display
   * @param {number} decimals
   * @returns {string}
   */
  static formatTokenAmount(amount, decimals) {
    let formatted = amount.toString();

    if (decimals > 0) {
      formatted = amount.shiftedBy(-decimals).toFixed(decimals).toString();

      // Trim trailing zeros
      while (formatted[formatted.length - 1] === '0') {
        formatted = formatted.substring(0, formatted.length - 1);
      }

      if (formatted.endsWith('.')) {
        formatted = formatted.substring(0, formatted.length - 1);
      }
    }

    return formatted;
  }

  /**
   * parse token amount to use it on smart contract
   *
   * @param {string} value - the token amount you want to use it on smart contract
   * @param {number} decimals
   * @returns {string}
   */
  static parseTokenAmount(value, decimals) {
    const comps = value.split('.');

    let whole = comps[0];
    let fraction = comps[1];
    if (!whole) {
      whole = '0';
    }
    if (!fraction) {
      fraction = '0';
    }

    // Trim trailing zeros
    while (fraction[fraction.length - 1] === '0') {
      fraction = fraction.substring(0, fraction.length - 1);
    }

    // If decimals is 0, we have an empty string for fraction
    if (fraction === '') {
      fraction = '0';
    }

    // Fully pad the string with zeros to get to value
    while (fraction.length < decimals) {
      fraction += '0';
    }

    const wholeValue = new BigNumber(whole);
    const fractionValue = new BigNumber(fraction);

    return wholeValue.shiftedBy(decimals).plus(fractionValue);
  }
}
