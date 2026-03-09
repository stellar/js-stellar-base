import BigNumber from "bignumber.js";

const { encodeMuxedAccountToAddress, encodeMuxedAccount } = StellarBase;

describe("Operation", function () {
  describe("._checkUnsignedIntValue()", function () {
    it("returns true for valid values", function () {
      let values = [
        { value: 0, expected: 0 },
        { value: 10, expected: 10 },
        { value: "0", expected: 0 },
        { value: "10", expected: 10 },
        { value: undefined, expected: undefined }
      ];

      for (var i in values) {
        let { value, expected } = values[i];
        expect(
          StellarBase.Operation._checkUnsignedIntValue(value, value)
        ).to.be.equal(expected);
      }
    });

    it("throws error for invalid values", function () {
      let values = [
        {},
        [],
        "", // empty string
        "test", // string not representing a number
        "0.5",
        "-10",
        "-10.5",
        "Infinity",
        Infinity,
        "Nan",
        NaN
      ];

      for (var i in values) {
        let value = values[i];
        expect(() =>
          StellarBase.Operation._checkUnsignedIntValue(value, value)
        ).to.throw();
      }
    });

    it("return correct values when isValidFunction is set", function () {
      expect(
        StellarBase.Operation._checkUnsignedIntValue(
          "test",
          undefined,
          (value) => value < 10
        )
      ).to.equal(undefined);

      expect(
        StellarBase.Operation._checkUnsignedIntValue(
          "test",
          8,
          (value) => value < 10
        )
      ).to.equal(8);
      expect(
        StellarBase.Operation._checkUnsignedIntValue(
          "test",
          "8",
          (value) => value < 10
        )
      ).to.equal(8);

      expect(() => {
        StellarBase.Operation._checkUnsignedIntValue(
          "test",
          12,
          (value) => value < 10
        );
      }).to.throw();
      expect(() => {
        StellarBase.Operation._checkUnsignedIntValue(
          "test",
          "12",
          (value) => value < 10
        );
      }).to.throw();
    });
  });

  describe(".isValidAmount()", function () {
    it("returns true for valid amounts", function () {
      let amounts = [
        "10",
        "0.10",
        "0.1234567",
        "922337203685.4775807" // MAX
      ];

      for (var i in amounts) {
        expect(StellarBase.Operation.isValidAmount(amounts[i])).to.be.true;
      }
    });

    it("returns false for invalid amounts", function () {
      let amounts = [
        100, // integer
        100.5, // float
        "", // empty string
        "test", // string not representing a number
        "0",
        "-10",
        "-10.5",
        "0.12345678",
        "922337203685.4775808", // Overflow
        "Infinity",
        Infinity,
        "Nan",
        NaN
      ];

      for (var i in amounts) {
        expect(StellarBase.Operation.isValidAmount(amounts[i])).to.be.false;
      }
    });

    it("allows 0 only if allowZero argument is set to true", function () {
      expect(StellarBase.Operation.isValidAmount("0")).to.be.false;
      expect(StellarBase.Operation.isValidAmount("0", true)).to.be.true;
    });
  });

  describe("._fromXDRAmount()", function () {
    it("correctly parses the amount", function () {
      expect(StellarBase.Operation._fromXDRAmount(1)).to.be.equal("0.0000001");
      expect(StellarBase.Operation._fromXDRAmount(10000000)).to.be.equal(
        "1.0000000"
      );
      expect(StellarBase.Operation._fromXDRAmount(10000000000)).to.be.equal(
        "1000.0000000"
      );
      expect(
        StellarBase.Operation._fromXDRAmount(1000000000000000000)
      ).to.be.equal("100000000000.0000000");
    });
  });
});
