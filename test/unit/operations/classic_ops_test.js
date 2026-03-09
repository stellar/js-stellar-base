import BigNumber from "bignumber.js";

const { encodeMuxedAccountToAddress, encodeMuxedAccount } = StellarBase;

describe("Operation", function () {
  describe(".pathPaymentStrictSend()", function () {
    it("creates a pathPaymentStrictSendOp", function () {
      var sendAsset = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      var sendAmount = "3.0070000";
      var destination =
        "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
      var destAsset = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      var destMin = "3.1415000";
      var path = [
        new StellarBase.Asset(
          "USD",
          "GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB"
        ),
        new StellarBase.Asset(
          "EUR",
          "GDTNXRLOJD2YEBPKK7KCMR7J33AAG5VZXHAJTHIG736D6LVEFLLLKPDL"
        )
      ];
      let op = StellarBase.Operation.pathPaymentStrictSend({
        sendAsset,
        sendAmount,
        destination,
        destAsset,
        destMin,
        path
      });
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("pathPaymentStrictSend");
      expect(obj.sendAsset.equals(sendAsset)).to.be.true;
      expect(operation.body().value().sendAmount().toString()).to.be.equal(
        "30070000"
      );
      expect(obj.sendAmount).to.be.equal(sendAmount);
      expect(obj.destination).to.be.equal(destination);
      expect(obj.destAsset.equals(destAsset)).to.be.true;
      expect(operation.body().value().destMin().toString()).to.be.equal(
        "31415000"
      );
      expect(obj.destMin).to.be.equal(destMin);
      expect(obj.path[0].getCode()).to.be.equal("USD");
      expect(obj.path[0].getIssuer()).to.be.equal(
        "GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB"
      );
      expect(obj.path[1].getCode()).to.be.equal("EUR");
      expect(obj.path[1].getIssuer()).to.be.equal(
        "GDTNXRLOJD2YEBPKK7KCMR7J33AAG5VZXHAJTHIG736D6LVEFLLLKPDL"
      );
    });

    const base = "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ";
    const source = encodeMuxedAccountToAddress(encodeMuxedAccount(base, "1"));
    const destination = encodeMuxedAccountToAddress(
      encodeMuxedAccount(base, "2")
    );

    let opts = { source, destination };
    opts.sendAsset = opts.destAsset = new StellarBase.Asset(
      "USD",
      "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
    );
    opts.destMin = "3.1415000";
    opts.sendAmount = "3.0070000";
    opts.path = [
      new StellarBase.Asset(
        "USD",
        "GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB"
      )
    ];

    it("supports muxed accounts", function () {
      const packed = StellarBase.Operation.pathPaymentStrictSend(opts);

      // Ensure we can convert to and from the raw XDR:
      expect(() => {
        StellarBase.xdr.Operation.fromXDR(packed.toXDR("raw"), "raw");
        StellarBase.xdr.Operation.fromXDR(packed.toXDR("hex"), "hex");
      }).to.not.throw();

      const unpacked = StellarBase.Operation.fromXDRObject(packed);
      expect(unpacked.type).to.equal("pathPaymentStrictSend");
      expect(unpacked.source).to.equal(opts.source);
      expect(unpacked.destination).to.equal(opts.destination);
    });

    it("fails to create path payment operation with an invalid destination address", function () {
      let opts = {
        destination: "GCEZW",
        sendAmount: "20",
        destMin: "50",
        sendAsset: StellarBase.Asset.native(),
        destAsset: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.pathPaymentStrictSend(opts)).to.throw(
        /destination is invalid/
      );
    });

    it("fails to create path payment operation with an invalid sendAmount", function () {
      let opts = {
        destination: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
        sendAmount: 20,
        destMin: "50",
        sendAsset: StellarBase.Asset.native(),
        destAsset: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.pathPaymentStrictSend(opts)).to.throw(
        /sendAmount argument must be of type String/
      );
    });

    it("fails to create path payment operation with an invalid destMin", function () {
      let opts = {
        destination: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
        sendAmount: "20",
        destMin: 50,
        sendAsset: StellarBase.Asset.native(),
        destAsset: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.pathPaymentStrictSend(opts)).to.throw(
        /destMin argument must be of type String/
      );
    });
  });

  describe(".manageSellOffer", function () {
    it("creates a manageSellOfferOp (string price)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.amount = "3.1234560";
      opts.price = "8.141592";
      opts.offerId = "1";
      let op = StellarBase.Operation.manageSellOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("manageSellOffer");
      expect(obj.selling.equals(opts.selling)).to.be.true;
      expect(obj.buying.equals(opts.buying)).to.be.true;
      expect(operation.body().value().amount().toString()).to.be.equal(
        "31234560"
      );
      expect(obj.amount).to.be.equal(opts.amount);
      expect(obj.price).to.be.equal(opts.price);
      expect(obj.offerId).to.be.equal(opts.offerId);
    });

    it("creates a manageSellOfferOp (price fraction)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.amount = "3.123456";
      opts.price = {
        n: 11,
        d: 10
      };
      opts.offerId = "1";
      let op = StellarBase.Operation.manageSellOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.price).to.be.equal(
        new BigNumber(opts.price.n).div(opts.price.d).toString()
      );
    });

    it("creates an invalid manageSellOfferOp (price fraction)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.amount = "3.123456";
      opts.price = {
        n: 11,
        d: -1
      };
      opts.offerId = "1";
      expect(() => StellarBase.Operation.manageSellOffer(opts)).to.throw(
        /price must be positive/
      );
    });

    it("creates a manageSellOfferOp (number price)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.amount = "3.123456";
      opts.price = 3.07;
      opts.offerId = "1";
      let op = StellarBase.Operation.manageSellOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("manageSellOffer");
      expect(obj.price).to.be.equal(opts.price.toString());
    });

    it("creates a manageSellOfferOp (BigNumber price)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.amount = "3.123456";
      opts.price = new BigNumber(5).dividedBy(4);
      opts.offerId = "1";
      let op = StellarBase.Operation.manageSellOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("manageSellOffer");
      expect(obj.price).to.be.equal("1.25");
    });

    it("creates a manageSellOfferOp with no offerId", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.amount = "1000.0000000";
      opts.price = "3.141592";
      let op = StellarBase.Operation.manageSellOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("manageSellOffer");
      expect(obj.selling.equals(opts.selling)).to.be.true;
      expect(obj.buying.equals(opts.buying)).to.be.true;
      expect(operation.body().value().amount().toString()).to.be.equal(
        "10000000000"
      );
      expect(obj.amount).to.be.equal(opts.amount);
      expect(obj.price).to.be.equal(opts.price);
      expect(obj.offerId).to.be.equal("0"); // 0=create a new offer, otherwise edit an existing offer
    });

    it("cancels offer", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.amount = "0.0000000";
      opts.price = "3.141592";
      opts.offerId = "1";
      let op = StellarBase.Operation.manageSellOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("manageSellOffer");
      expect(obj.selling.equals(opts.selling)).to.be.true;
      expect(obj.buying.equals(opts.buying)).to.be.true;
      expect(operation.body().value().amount().toString()).to.be.equal("0");
      expect(obj.amount).to.be.equal(opts.amount);
      expect(obj.price).to.be.equal(opts.price);
      expect(obj.offerId).to.be.equal("1"); // 0=create a new offer, otherwise edit an existing offer
    });

    it("fails to create manageSellOffer operation with an invalid amount", function () {
      let opts = {
        amount: 20,
        price: "10",
        selling: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        ),
        buying: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.manageSellOffer(opts)).to.throw(
        /amount argument must be of type String/
      );
    });

    it("fails to create manageSellOffer operation with missing price", function () {
      let opts = {
        amount: "20",
        selling: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        ),
        buying: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.manageSellOffer(opts)).to.throw(
        /price argument is required/
      );
    });

    it("fails to create manageSellOffer operation with negative price", function () {
      let opts = {
        amount: "20",
        price: "-1",
        selling: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        ),
        buying: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.manageSellOffer(opts)).to.throw(
        /price must be positive/
      );
    });

    it("fails to create manageSellOffer operation with invalid price", function () {
      let opts = {
        amount: "20",
        price: "test",
        selling: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        ),
        buying: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.manageSellOffer(opts)).to.throw(
        /not a number/i
      );
    });
  });

  describe(".manageBuyOffer", function () {
    it("creates a manageBuyOfferOp (string price)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buyAmount = "3.1234560";
      opts.price = "8.141592";
      opts.offerId = "1";
      let op = StellarBase.Operation.manageBuyOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("manageBuyOffer");
      expect(obj.selling.equals(opts.selling)).to.be.true;
      expect(obj.buying.equals(opts.buying)).to.be.true;
      expect(operation.body().value().buyAmount().toString()).to.be.equal(
        "31234560"
      );
      expect(obj.buyAmount).to.be.equal(opts.buyAmount);
      expect(obj.price).to.be.equal(opts.price);
      expect(obj.offerId).to.be.equal(opts.offerId);
    });

    it("creates a manageBuyOfferOp (price fraction)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buyAmount = "3.123456";
      opts.price = {
        n: 11,
        d: 10
      };
      opts.offerId = "1";
      let op = StellarBase.Operation.manageBuyOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.price).to.be.equal(
        new BigNumber(opts.price.n).div(opts.price.d).toString()
      );
    });

    it("creates an invalid manageBuyOfferOp (price fraction)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buyAmount = "3.123456";
      opts.price = {
        n: 11,
        d: -1
      };
      opts.offerId = "1";
      expect(() => StellarBase.Operation.manageBuyOffer(opts)).to.throw(
        /price must be positive/
      );
    });

    it("creates a manageBuyOfferOp (number price)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buyAmount = "3.123456";
      opts.price = 3.07;
      opts.offerId = "1";
      let op = StellarBase.Operation.manageBuyOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("manageBuyOffer");
      expect(obj.price).to.be.equal(opts.price.toString());
    });

    it("creates a manageBuyOfferOp (BigNumber price)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buyAmount = "3.123456";
      opts.price = new BigNumber(5).dividedBy(4);
      opts.offerId = "1";
      let op = StellarBase.Operation.manageBuyOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("manageBuyOffer");
      expect(obj.price).to.be.equal("1.25");
    });

    it("creates a manageBuyOfferOp with no offerId", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buyAmount = "1000.0000000";
      opts.price = "3.141592";
      let op = StellarBase.Operation.manageBuyOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("manageBuyOffer");
      expect(obj.selling.equals(opts.selling)).to.be.true;
      expect(obj.buying.equals(opts.buying)).to.be.true;
      expect(operation.body().value().buyAmount().toString()).to.be.equal(
        "10000000000"
      );
      expect(obj.buyAmount).to.be.equal(opts.buyAmount);
      expect(obj.price).to.be.equal(opts.price);
      expect(obj.offerId).to.be.equal("0"); // 0=create a new offer, otherwise edit an existing offer
    });

    it("cancels offer", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buyAmount = "0.0000000";
      opts.price = "3.141592";
      opts.offerId = "1";
      let op = StellarBase.Operation.manageBuyOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("manageBuyOffer");
      expect(obj.selling.equals(opts.selling)).to.be.true;
      expect(obj.buying.equals(opts.buying)).to.be.true;
      expect(operation.body().value().buyAmount().toString()).to.be.equal("0");
      expect(obj.buyAmount).to.be.equal(opts.buyAmount);
      expect(obj.price).to.be.equal(opts.price);
      expect(obj.offerId).to.be.equal("1"); // 0=create a new offer, otherwise edit an existing offer
    });

    it("fails to create manageBuyOffer operation with an invalid amount", function () {
      let opts = {
        buyAmount: 20,
        price: "10",
        selling: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        ),
        buying: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.manageBuyOffer(opts)).to.throw(
        /buyAmount argument must be of type String/
      );
    });

    it("fails to create manageBuyOffer operation with missing price", function () {
      let opts = {
        buyAmount: "20",
        selling: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        ),
        buying: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.manageBuyOffer(opts)).to.throw(
        /price argument is required/
      );
    });

    it("fails to create manageBuyOffer operation with negative price", function () {
      let opts = {
        buyAmount: "20",
        price: "-1",
        selling: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        ),
        buying: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.manageBuyOffer(opts)).to.throw(
        /price must be positive/
      );
    });

    it("fails to create manageBuyOffer operation with invalid price", function () {
      let opts = {
        buyAmount: "20",
        price: "test",
        selling: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        ),
        buying: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.manageBuyOffer(opts)).to.throw(
        /not a number/i
      );
    });
  });

  describe(".createPassiveSellOffer", function () {
    it("creates a createPassiveSellOfferOp (string price)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.amount = "11.2782700";
      opts.price = "3.07";
      let op = StellarBase.Operation.createPassiveSellOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("createPassiveSellOffer");
      expect(obj.selling.equals(opts.selling)).to.be.true;
      expect(obj.buying.equals(opts.buying)).to.be.true;
      expect(operation.body().value().amount().toString()).to.be.equal(
        "112782700"
      );
      expect(obj.amount).to.be.equal(opts.amount);
      expect(obj.price).to.be.equal(opts.price);
    });

    it("creates a createPassiveSellOfferOp (number price)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.amount = "11.2782700";
      opts.price = 3.07;
      let op = StellarBase.Operation.createPassiveSellOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("createPassiveSellOffer");
      expect(obj.selling.equals(opts.selling)).to.be.true;
      expect(obj.buying.equals(opts.buying)).to.be.true;
      expect(operation.body().value().amount().toString()).to.be.equal(
        "112782700"
      );
      expect(obj.amount).to.be.equal(opts.amount);
      expect(obj.price).to.be.equal(opts.price.toString());
    });

    it("creates a createPassiveSellOfferOp (BigNumber price)", function () {
      var opts = {};
      opts.selling = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.buying = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      opts.amount = "11.2782700";
      opts.price = new BigNumber(5).dividedBy(4);
      let op = StellarBase.Operation.createPassiveSellOffer(opts);
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("createPassiveSellOffer");
      expect(obj.selling.equals(opts.selling)).to.be.true;
      expect(obj.buying.equals(opts.buying)).to.be.true;
      expect(operation.body().value().amount().toString()).to.be.equal(
        "112782700"
      );
      expect(obj.amount).to.be.equal(opts.amount);
      expect(obj.price).to.be.equal("1.25");
    });

    it("fails to create createPassiveSellOffer operation with an invalid amount", function () {
      let opts = {
        amount: 20,
        price: "10",
        selling: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        ),
        buying: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.createPassiveSellOffer(opts)).to.throw(
        /amount argument must be of type String/
      );
    });

    it("fails to create createPassiveSellOffer operation with missing price", function () {
      let opts = {
        amount: "20",
        selling: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        ),
        buying: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.createPassiveSellOffer(opts)).to.throw(
        /price argument is required/
      );
    });

    it("fails to create createPassiveSellOffer operation with negative price", function () {
      let opts = {
        amount: "20",
        price: "-2",
        selling: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        ),
        buying: new StellarBase.Asset(
          "USD",
          "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
        )
      };
      expect(() => StellarBase.Operation.createPassiveSellOffer(opts)).to.throw(
        /price must be positive/
      );
    });
  });

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

  describe("createClaimableBalance()", function () {
    it("creates a CreateClaimableBalanceOp", function () {
      const asset = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      const amount = "100.0000000";
      const claimants = [
        new StellarBase.Claimant(
          "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ"
        )
      ];

      const op = StellarBase.Operation.createClaimableBalance({
        asset,
        amount,
        claimants
      });
      var xdr = op.toXDR("hex");
      var operation = StellarBase.xdr.Operation.fromXDR(
        Buffer.from(xdr, "hex")
      );
      var obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal("createClaimableBalance");
      expect(obj.asset.toString()).to.equal(asset.toString());
      expect(obj.amount).to.be.equal(amount);
      expect(obj.claimants).to.have.lengthOf(1);
      expect(obj.claimants[0].toXDRObject().toXDR("hex")).to.equal(
        claimants[0].toXDRObject().toXDR("hex")
      );
    });
    it("throws an error when asset is not present", function () {
      const amount = "100.0000000";
      const claimants = [
        new StellarBase.Claimant(
          "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ"
        )
      ];

      const attrs = {
        amount,
        claimants
      };

      expect(() =>
        StellarBase.Operation.createClaimableBalance(attrs)
      ).to.throw(
        /must provide an asset for create claimable balance operation/
      );
    });
    it("throws an error when amount is not present", function () {
      const asset = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      const claimants = [
        new StellarBase.Claimant(
          "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ"
        )
      ];

      const attrs = {
        asset,
        claimants
      };

      expect(() =>
        StellarBase.Operation.createClaimableBalance(attrs)
      ).to.throw(
        /amount argument must be of type String, represent a positive number and have at most 7 digits after the decimal/
      );
    });
    it("throws an error when claimants is empty or not present", function () {
      const asset = new StellarBase.Asset(
        "USD",
        "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"
      );
      const amount = "100.0000";

      const attrs = {
        asset,
        amount
      };

      expect(() =>
        StellarBase.Operation.createClaimableBalance(attrs)
      ).to.throw(/must provide at least one claimant/);

      attrs.claimants = [];
      expect(() =>
        StellarBase.Operation.createClaimableBalance(attrs)
      ).to.throw(/must provide at least one claimant/);
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

  describe("liquidityPoolDeposit()", function () {
    it("throws an error if a required parameter is missing", function () {
      expect(() => StellarBase.Operation.liquidityPoolDeposit()).to.throw(
        /liquidityPoolId argument is required/
      );

      let opts = {};
      expect(() => StellarBase.Operation.liquidityPoolDeposit(opts)).to.throw(
        /liquidityPoolId argument is required/
      );

      opts.liquidityPoolId =
        "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7";
      expect(() => StellarBase.Operation.liquidityPoolDeposit(opts)).to.throw(
        /maxAmountA argument must be of type String, represent a positive number and have at most 7 digits after the decimal/
      );

      opts.maxAmountA = "10";
      expect(() => StellarBase.Operation.liquidityPoolDeposit(opts)).to.throw(
        /maxAmountB argument must be of type String, represent a positive number and have at most 7 digits after the decimal/
      );

      opts.maxAmountB = "20";
      expect(() => StellarBase.Operation.liquidityPoolDeposit(opts)).to.throw(
        /minPrice argument is required/
      );

      opts.minPrice = "0.45";
      expect(() => StellarBase.Operation.liquidityPoolDeposit(opts)).to.throw(
        /maxPrice argument is required/
      );

      opts.maxPrice = "0.55";
      expect(() =>
        StellarBase.Operation.liquidityPoolDeposit(opts)
      ).to.not.throw();
    });

    it("throws an error if prices are negative", function () {
      const opts = {
        liquidityPoolId:
          "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7",
        maxAmountA: "10.0000000",
        maxAmountB: "20.0000000",
        minPrice: "-0.45",
        maxPrice: "0.55"
      };
      expect(() => StellarBase.Operation.liquidityPoolDeposit(opts)).to.throw(
        /price must be positive/
      );
    });

    it("creates a liquidityPoolDeposit (string prices)", function () {
      const opts = {
        liquidityPoolId:
          "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7",
        maxAmountA: "10.0000000",
        maxAmountB: "20.0000000",
        minPrice: "0.45",
        maxPrice: "0.55"
      };
      const op = StellarBase.Operation.liquidityPoolDeposit(opts);
      const xdr = op.toXDR("hex");

      const xdrObj = StellarBase.xdr.Operation.fromXDR(Buffer.from(xdr, "hex"));
      expect(xdrObj.body().switch().name).to.equal("liquidityPoolDeposit");
      expect(xdrObj.body().value().maxAmountA().toString()).to.equal(
        "100000000"
      );
      expect(xdrObj.body().value().maxAmountB().toString()).to.equal(
        "200000000"
      );

      const operation = StellarBase.Operation.fromXDRObject(xdrObj);
      expect(operation.type).to.be.equal("liquidityPoolDeposit");
      expect(operation.liquidityPoolId).to.be.equals(opts.liquidityPoolId);
      expect(operation.maxAmountA).to.be.equals(opts.maxAmountA);
      expect(operation.maxAmountB).to.be.equals(opts.maxAmountB);
      expect(operation.minPrice).to.be.equals(opts.minPrice);
      expect(operation.maxPrice).to.be.equals(opts.maxPrice);
    });

    it("creates a liquidityPoolDeposit (fraction prices)", function () {
      const opts = {
        liquidityPoolId:
          "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7",
        maxAmountA: "10.0000000",
        maxAmountB: "20.0000000",
        minPrice: {
          n: 9,
          d: 20
        },
        maxPrice: {
          n: 11,
          d: 20
        }
      };
      const op = StellarBase.Operation.liquidityPoolDeposit(opts);
      const xdr = op.toXDR("hex");

      const xdrObj = StellarBase.xdr.Operation.fromXDR(Buffer.from(xdr, "hex"));
      expect(xdrObj.body().switch().name).to.equal("liquidityPoolDeposit");
      expect(xdrObj.body().value().maxAmountA().toString()).to.equal(
        "100000000"
      );
      expect(xdrObj.body().value().maxAmountB().toString()).to.equal(
        "200000000"
      );

      const operation = StellarBase.Operation.fromXDRObject(xdrObj);
      expect(operation.type).to.be.equal("liquidityPoolDeposit");
      expect(operation.liquidityPoolId).to.be.equals(opts.liquidityPoolId);
      expect(operation.maxAmountA).to.be.equals(opts.maxAmountA);
      expect(operation.maxAmountB).to.be.equals(opts.maxAmountB);
      expect(operation.minPrice).to.be.equals(
        new BigNumber(opts.minPrice.n).div(opts.minPrice.d).toString()
      );
      expect(operation.maxPrice).to.be.equals(
        new BigNumber(opts.maxPrice.n).div(opts.maxPrice.d).toString()
      );
    });

    it("creates a liquidityPoolDeposit (number prices)", function () {
      const opts = {
        liquidityPoolId:
          "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7",
        maxAmountA: "10.0000000",
        maxAmountB: "20.0000000",
        minPrice: 0.45,
        maxPrice: 0.55
      };
      const op = StellarBase.Operation.liquidityPoolDeposit(opts);
      const xdr = op.toXDR("hex");

      const xdrObj = StellarBase.xdr.Operation.fromXDR(Buffer.from(xdr, "hex"));
      expect(xdrObj.body().switch().name).to.equal("liquidityPoolDeposit");
      expect(xdrObj.body().value().maxAmountA().toString()).to.equal(
        "100000000"
      );
      expect(xdrObj.body().value().maxAmountB().toString()).to.equal(
        "200000000"
      );

      const operation = StellarBase.Operation.fromXDRObject(xdrObj);
      expect(operation.type).to.be.equal("liquidityPoolDeposit");
      expect(operation.liquidityPoolId).to.be.equals(opts.liquidityPoolId);
      expect(operation.maxAmountA).to.be.equals(opts.maxAmountA);
      expect(operation.maxAmountB).to.be.equals(opts.maxAmountB);
      expect(operation.minPrice).to.be.equals(opts.minPrice.toString());
      expect(operation.maxPrice).to.be.equals(opts.maxPrice.toString());
    });

    it("creates a liquidityPoolDeposit (BigNumber prices)", function () {
      const opts = {
        liquidityPoolId:
          "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7",
        maxAmountA: "10.0000000",
        maxAmountB: "20.0000000",
        minPrice: new BigNumber(9).dividedBy(20),
        maxPrice: new BigNumber(11).dividedBy(20)
      };
      const op = StellarBase.Operation.liquidityPoolDeposit(opts);
      const xdr = op.toXDR("hex");

      const xdrObj = StellarBase.xdr.Operation.fromXDR(Buffer.from(xdr, "hex"));
      expect(xdrObj.body().switch().name).to.equal("liquidityPoolDeposit");
      expect(xdrObj.body().value().maxAmountA().toString()).to.equal(
        "100000000"
      );
      expect(xdrObj.body().value().maxAmountB().toString()).to.equal(
        "200000000"
      );

      const operation = StellarBase.Operation.fromXDRObject(xdrObj);
      expect(operation.type).to.be.equal("liquidityPoolDeposit");
      expect(operation.liquidityPoolId).to.be.equals(opts.liquidityPoolId);
      expect(operation.maxAmountA).to.be.equals(opts.maxAmountA);
      expect(operation.maxAmountB).to.be.equals(opts.maxAmountB);
      expect(operation.minPrice).to.be.equals(opts.minPrice.toString());
      expect(operation.maxPrice).to.be.equals(opts.maxPrice.toString());
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
