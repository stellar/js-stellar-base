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
   * @param {string} amount - the token amount you want to display
   * @param {number} decimals - specify how many decimal places a token has
   * @returns {string} - display value
   */
  static formatTokenAmount(amount, decimals) {
    let formatted = amount;

    if (amount.includes('.')) {
      throw new Error('No decimal is allowed');
    }

    if (decimals > 0) {
      formatted = [
        formatted.slice(0, -decimals),
        formatted.slice(-decimals)
      ].join('.');
    }

    // remove trailing zero if any
    return formatted.replace(/\.?0+$/, '');
  }

  /**
   * parse token amount to use it on smart contract
   *
   * This function takes the display value and its decimals (if the token has 
   * any) and returns a string that'll be used within the smart contract.
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
