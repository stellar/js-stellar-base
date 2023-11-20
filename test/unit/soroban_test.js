describe('Soroban', function () {
  describe('formatTokenAmount', function () {
    const SUCCESS_TEST_CASES = [
      { amount: '1000000001', decimals: 7, expected: '100.0000001' },
      { amount: '10000000010', decimals: 5, expected: '100000.0001' },
      { amount: '10000000010', decimals: 0, expected: '10000000010' },
      { amount: '10000', decimals: 10, expected: '0.000001' },
      { amount: '1567890', decimals: 10, expected: '0.000156789' },
      { amount: '1230', decimals: 0, expected: '1230' }
    ];

    const FAILED_TEST_CASES = [
      {
        amount: '1000000001.1',
        decimals: 7,
        expected: /No decimals are allowed/
      },
      {
        amount: '10000.00001.1',
        decimals: 4,
        expected: /No decimals are allowed/
      }
    ];

    SUCCESS_TEST_CASES.forEach((testCase) => {
      it(`returns ${testCase.expected} for ${testCase.amount} with ${testCase.decimals} decimals`, function () {
        expect(
          StellarBase.Soroban.formatTokenAmount(
            testCase.amount,
            testCase.decimals
          )
        ).to.equal(testCase.expected);
      });
    });

    FAILED_TEST_CASES.forEach((testCase) => {
      it(`fails on the input with decimals`, function () {
        expect(() =>
          StellarBase.Soroban.formatTokenAmount(
            testCase.amount,
            testCase.decimals
          )
        ).to.throw(testCase.expected);
      });
    });
  });

  describe('parseTokenAmount', function () {
    const SUCCESS_TEST_CASES = [
      { amount: '100', decimals: 2, expected: '10000' },
      { amount: '123.4560', decimals: 5, expected: '12345600' },
      { amount: '100', decimals: 5, expected: '10000000' }
    ];

    const FAILED_TEST_CASES = [
      {
        amount: '1000000.001.1',
        decimals: 7,
        expected: /Invalid decimal value/i
      }
    ];

    SUCCESS_TEST_CASES.forEach((testCase) => {
      it(`returns ${testCase.expected} for ${testCase.amount} of a token with ${testCase.decimals} decimals`, function () {
        expect(
          StellarBase.Soroban.parseTokenAmount(
            testCase.amount,
            testCase.decimals
          )
        ).to.equal(testCase.expected);
      });
    });

    FAILED_TEST_CASES.forEach((testCase) => {
      it(`fails on the input with more than one decimals`, function () {
        expect(() =>
          StellarBase.Soroban.parseTokenAmount(
            testCase.amount,
            testCase.decimals
          )
        ).to.throw(testCase.expected);
      });
    });
  });
});
