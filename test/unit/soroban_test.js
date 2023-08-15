describe('Soroban', function () {
  describe('formatTokenAmount', function () {
    it("returns '100.0000001' for '1000000001' of a token set to 7 decimals", function () {
      const amount = 1000000001;

      expect(StellarBase.Soroban.formatTokenAmount(amount, 7)).to.equal(
        '100.0000001'
      );
    });

    it("returns '100000.0001' for '10000000010' of a token set to 5 decimals", function () {
      const amount = '10000000010';

      expect(StellarBase.Soroban.formatTokenAmount(amount, 5)).to.equal(
        '100000.0001'
      );
    });

    it("returns '10000.00001' for '1000000001.' of a token set to 5 decimals", function () {
      const amount = '1000000001.';

      expect(StellarBase.Soroban.formatTokenAmount(amount, 5)).to.equal(
        '10000.00001'
      );
    });
  });

  describe('parseTokenAmount', function () {
    it("returns '10000' for '100' of a token set to 2 decimals", function () {
      const amount = '100';
      const parsedAmount = StellarBase.Soroban.parseTokenAmount(amount, 2);

      expect(parsedAmount.toString()).to.equal('10000');
    });

    it("returns '12345600' for '123.4560' of a token set to 5 decimals", function () {
      const amount = '123.4560';
      const parsedAmount = StellarBase.Soroban.parseTokenAmount(amount, 5);

      expect(parsedAmount.toString()).to.equal('12345600');
    });
  });
});
