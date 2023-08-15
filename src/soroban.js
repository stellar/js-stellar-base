/**
 * Soroban helper class
 * formatting, parsing, and etc
 * @class Soroban
 */
export class Soroban {
  /**
   * All arithmetic inside the contract is performed on integers to
   * avoid potential precision and consistency issues of floating-point
   *
   * This function takes the smart contract value and its decimals (if the token has any) and returns a display value
   * @param {bigint | number | string} amount - the token amount you want to display
   * @param {number} decimals - specify how many decimal places a token has
   * @returns {string} - display value
   */
  static formatTokenAmount(amount, decimals) {
    let formatted = amount.toString();

    if (decimals > 0) {
      formatted = (amount / 10 ** decimals).toFixed(decimals);
      formatted = formatted.replace(/\.?0+$/, '');
    }

    return formatted;
  }

  /**
   * parse token amount to use it on smart contract
   *
   * * This function takes the display value and its decimals (if the token has any) and returns an integer that'll be used it on smart contract
   * @param {string} value - the token amount you want to use it on smart contract
   * @param {number} decimals - specify how many decimal places a token has
   * @returns {string} - smart contract value
   *
   *
   * @example
   * const displayValueAmount = "123.4560"
   * const parsedAmountForSmartContract = parseTokenAmount("123.4560", 5);
   * parsedAmountForSmartContract === "12345600"
   */
  static parseTokenAmount(value, decimals) {
    const [whole, fraction, ...rest] = value.split('.').slice();

    if (rest.length) {
      throw new Error(`Invalid decimal value: ${value}`);
    }

    const shifted = BigInt(
      whole + (fraction?.padEnd(decimals, '0') ?? '0'.repeat(decimals))
    );

    return shifted.toString();
  }
}