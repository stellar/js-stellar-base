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

  describe("revokeAccountSponsorship()", function () {
    it("creates a revokeAccountSponsorshipOp", function () {
      const account =
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
      const op = StellarBase.Operation.revokeAccountSponsorship({
        account
      });
      var xdr = op.toXDR("hex");

      var operation = StellarBase.xdr.Operation.fromXDR(xdr, "hex");
      expect(operation.body().switch().name).to.equal("revokeSponsorship");
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("revokeAccountSponsorship");
      expect(obj.account).to.be.equal(account);
    });
    it("throws an error when account is invalid", function () {
      expect(() => StellarBase.Operation.revokeAccountSponsorship({})).to.throw(
        /account is invalid/
      );
      expect(() =>
        StellarBase.Operation.revokeAccountSponsorship({
          account: "GBAD"
        })
      ).to.throw(/account is invalid/);
    });
  });

  describe("revokeTrustlineSponsorship()", function () {
    it("creates a revokeTrustlineSponsorship", function () {
      const account =
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
      var asset = new StellarBase.Asset(
        "USDUSD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      const op = StellarBase.Operation.revokeTrustlineSponsorship({
        account,
        asset
      });
      var xdr = op.toXDR("hex");

      var operation = StellarBase.xdr.Operation.fromXDR(xdr, "hex");
      expect(operation.body().switch().name).to.equal("revokeSponsorship");
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("revokeTrustlineSponsorship");
    });
    it("creates a revokeTrustlineSponsorship for a liquidity pool", function () {
      const account =
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
      const asset = new StellarBase.LiquidityPoolId(
        "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7"
      );
      const op = StellarBase.Operation.revokeTrustlineSponsorship({
        account,
        asset
      });
      const xdr = op.toXDR("hex");

      const operation = StellarBase.xdr.Operation.fromXDR(xdr, "hex");
      expect(operation.body().switch().name).to.equal("revokeSponsorship");
      const obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("revokeTrustlineSponsorship");
    });
    it("throws an error when account is invalid", function () {
      expect(() =>
        StellarBase.Operation.revokeTrustlineSponsorship({})
      ).to.throw(/account is invalid/);
      expect(() =>
        StellarBase.Operation.revokeTrustlineSponsorship({
          account: "GBAD"
        })
      ).to.throw(/account is invalid/);
    });
    it("throws an error when asset is invalid", function () {
      expect(() =>
        StellarBase.Operation.revokeTrustlineSponsorship({
          account: "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        })
      ).to.throw(/asset must be an Asset or LiquidityPoolId/);
    });
  });

  describe("revokeOfferSponsorship()", function () {
    it("creates a revokeOfferSponsorship", function () {
      const seller = "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
      var offerId = "1234";
      const op = StellarBase.Operation.revokeOfferSponsorship({
        seller,
        offerId
      });
      var xdr = op.toXDR("hex");

      var operation = StellarBase.xdr.Operation.fromXDR(xdr, "hex");
      expect(operation.body().switch().name).to.equal("revokeSponsorship");
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("revokeOfferSponsorship");
      expect(obj.seller).to.be.equal(seller);
      expect(obj.offerId).to.be.equal(offerId);
    });
    it("throws an error when seller is invalid", function () {
      expect(() => StellarBase.Operation.revokeOfferSponsorship({})).to.throw(
        /seller is invalid/
      );
      expect(() =>
        StellarBase.Operation.revokeOfferSponsorship({
          seller: "GBAD"
        })
      ).to.throw(/seller is invalid/);
    });
    it("throws an error when asset offerId is not included", function () {
      expect(() =>
        StellarBase.Operation.revokeOfferSponsorship({
          seller: "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        })
      ).to.throw(/offerId is invalid/);
    });
  });

  describe("revokeDataSponsorship()", function () {
    it("creates a revokeDataSponsorship", function () {
      const account =
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
      var name = "foo";
      const op = StellarBase.Operation.revokeDataSponsorship({
        account,
        name
      });
      var xdr = op.toXDR("hex");

      var operation = StellarBase.xdr.Operation.fromXDR(xdr, "hex");
      expect(operation.body().switch().name).to.equal("revokeSponsorship");
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("revokeDataSponsorship");
      expect(obj.account).to.be.equal(account);
      expect(obj.name).to.be.equal(name);
    });
    it("throws an error when account is invalid", function () {
      expect(() => StellarBase.Operation.revokeDataSponsorship({})).to.throw(
        /account is invalid/
      );
      expect(() =>
        StellarBase.Operation.revokeDataSponsorship({
          account: "GBAD"
        })
      ).to.throw(/account is invalid/);
    });
    it("throws an error when data name is not included", function () {
      expect(() =>
        StellarBase.Operation.revokeDataSponsorship({
          account: "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        })
      ).to.throw(/name must be a string, up to 64 characters/);
    });
  });

  describe("revokeClaimableBalanceSponsorship()", function () {
    it("creates a revokeClaimableBalanceSponsorship", function () {
      const balanceId =
        "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be";
      const op = StellarBase.Operation.revokeClaimableBalanceSponsorship({
        balanceId
      });
      var xdr = op.toXDR("hex");

      var operation = StellarBase.xdr.Operation.fromXDR(xdr, "hex");
      expect(operation.body().switch().name).to.equal("revokeSponsorship");
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("revokeClaimableBalanceSponsorship");
      expect(obj.balanceId).to.be.equal(balanceId);
    });
    it("throws an error when balanceId is invalid", function () {
      expect(() =>
        StellarBase.Operation.revokeClaimableBalanceSponsorship({})
      ).to.throw(/balanceId is invalid/);
    });
  });

  describe("revokeLiquidityPoolSponsorship()", function () {
    it("creates a revokeLiquidityPoolSponsorship", function () {
      const liquidityPoolId =
        "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7";
      const op = StellarBase.Operation.revokeLiquidityPoolSponsorship({
        liquidityPoolId
      });
      const xdr = op.toXDR("hex");

      const operation = StellarBase.xdr.Operation.fromXDR(xdr, "hex");
      expect(operation.body().switch().name).to.equal("revokeSponsorship");

      const obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("revokeLiquidityPoolSponsorship");
      expect(obj.liquidityPoolId).to.be.equal(liquidityPoolId);
    });

    it("throws an error when liquidityPoolId is invalid", function () {
      expect(() =>
        StellarBase.Operation.revokeLiquidityPoolSponsorship({})
      ).to.throw(/liquidityPoolId is invalid/);
    });
  });

  describe("revokeSignerSponsorship()", function () {
    it("creates a revokeSignerSponsorship", function () {
      const account =
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
      let signer = {
        ed25519PublicKey:
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      };
      let op = StellarBase.Operation.revokeSignerSponsorship({
        account,
        signer
      });
      let xdr = op.toXDR("hex");

      let operation = StellarBase.xdr.Operation.fromXDR(xdr, "hex");
      expect(operation.body().switch().name).to.equal("revokeSponsorship");
      let obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("revokeSignerSponsorship");
      expect(obj.account).to.be.equal(account);
      expect(obj.signer.ed25519PublicKey).to.be.equal(signer.ed25519PublicKey);

      // preAuthTx signer
      signer = {
        preAuthTx: StellarBase.hash("Tx hash").toString("hex")
      };
      op = StellarBase.Operation.revokeSignerSponsorship({
        account,
        signer
      });
      operation = StellarBase.xdr.Operation.fromXDR(op.toXDR("hex"), "hex");
      obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("revokeSignerSponsorship");
      expect(obj.account).to.be.equal(account);
      expect(obj.signer.preAuthTx).to.be.equal(signer.preAuthTx);

      // sha256Hash signer
      signer = {
        sha256Hash: StellarBase.hash("Hash Preimage").toString("hex")
      };
      op = StellarBase.Operation.revokeSignerSponsorship({
        account,
        signer
      });
      operation = StellarBase.xdr.Operation.fromXDR(op.toXDR("hex"), "hex");
      obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("revokeSignerSponsorship");
      expect(obj.account).to.be.equal(account);
      expect(obj.signer.sha256Hash).to.be.equal(signer.sha256Hash);
    });
    it("throws an error when account is invalid", function () {
      const signer = {
        ed25519PublicKey:
          "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ"
      };
      expect(() =>
        StellarBase.Operation.revokeSignerSponsorship({
          signer
        })
      ).to.throw(/account is invalid/);
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
