import BigNumber from 'bignumber.js';

describe('Soroban', function () {
  describe('formatTokenAmount', function () {
    it("returns '100.0000001' for '1000000001' of a token set to 7 decimals", function () {
      const amount = new BigNumber(1000000001);

      expect(StellarBase.Soroban.formatTokenAmount(amount, 7)).to.equal(
        '100.0000001'
      );
    });

    it("returns '100000.0001' for '10000000010' of a token set to 5 decimals", function () {
      const amount = new BigNumber(10000000010);

      expect(StellarBase.Soroban.formatTokenAmount(amount, 5)).to.equal(
        '100000.0001'
      );
    });

    it("returns '10000.00001' for '1000000001.'.' of a token set to 5 decimals", function () {
      const amount = new BigNumber('1000000001.');

      expect(StellarBase.Soroban.formatTokenAmount(amount, 5)).to.equal(
        '10000.00001'
      );
    });
  });

  describe('parseTokenAmount', function () {
    it("returns '10000' for '100' of a token set to 2 decimals", function () {
      const amount = '100';
      const parsedAmount = StellarBase.Soroban.parseTokenAmount(amount, 2);

      expect(parsedAmount.toNumber()).to.equal(10000);
    });
  });
});
