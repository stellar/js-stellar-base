const { expect } = require('chai');

describe('Claimant', function() {
  describe('constructor', function() {
    it('throws an error when destination is invalid', function() {
      expect(() => new StellarBase.Claimant('GCEZWKCA5', null)).to.throw(
        /Destination is invalid/
      );
    });
    it('defaults to unconditional if predicate is undefined', function() {
      const claimant = new StellarBase.Claimant(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(claimant.predicate.switch()).to.equal(
        StellarBase.xdr.ClaimPredicateType.claimPredicateUnconditional()
      );
    });
    it('throws an error if predicate is not an xdr.ClaimPredicate', function() {
      expect(
        () =>
          new StellarBase.Claimant(
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
            3
          )
      ).to.throw(/Predicate should be an xdr.ClaimPredicate/);
    });
  });
  describe('claimPredicateUnconditional()', function() {
    it('returns an `unconditional` claim predicate', function() {
      const predicate = StellarBase.Claimant.claimPredicateUnconditional();
      expect(predicate.switch()).to.equal(
        StellarBase.xdr.ClaimPredicateType.claimPredicateUnconditional()
      );
    });
  });
  describe('claimPredicateBeforeAbsoluteTime()', function() {
    it('returns a `beforeAbsoluteTime` claim predicate', function() {
      const time = '4102444800000';
      const predicate = StellarBase.Claimant.claimPredicateBeforeAbsoluteTime(
        time
      );
      expect(predicate.switch()).to.equal(
        StellarBase.xdr.ClaimPredicateType.claimPredicateBeforeAbsoluteTime()
      );
      const value = predicate.absBefore();
      expect(value.toString()).to.equal(time);
    });
  });
  describe('claimPredicateBeforeRelativeTime()', function() {
    it('returns a `beforeRelativeTime` claim predicate', function() {
      const time = '86400';
      const predicate = StellarBase.Claimant.claimPredicateBeforeRelativeTime(
        time
      );
      expect(predicate.switch()).to.equal(
        StellarBase.xdr.ClaimPredicateType.claimPredicateBeforeRelativeTime()
      );
      const value = predicate.relBefore();
      expect(value.toString()).to.equal(time);
    });
  });
  describe('claimPredicateNot()', function() {
    it('returns a `not` claim predicate', function() {
      const time = '86400';
      const beforeRel = StellarBase.Claimant.claimPredicateBeforeRelativeTime(
        time
      );
      const predicate = StellarBase.Claimant.claimPredicateNot(beforeRel);
      expect(predicate.switch()).to.equal(
        StellarBase.xdr.ClaimPredicateType.claimPredicateNot()
      );
      const value = predicate.notPredicate().value();
      expect(value).to.not.be.null;
      expect(value.toString()).to.equal(time);
    });
  });
  describe('claimPredicateOr()', function() {
    it('returns an `or` claim predicate', function() {
      const left = StellarBase.Claimant.claimPredicateBeforeRelativeTime('800');
      const right = StellarBase.Claimant.claimPredicateBeforeRelativeTime(
        '1200'
      );
      const predicate = StellarBase.Claimant.claimPredicateOr(left, right);
      expect(predicate.switch()).to.equal(
        StellarBase.xdr.ClaimPredicateType.claimPredicateOr()
      );
      const predicates = predicate.orPredicates();
      expect(predicates[0].value().toString()).to.equal('800');
      expect(predicates[1].value().toString()).to.equal('1200');
    });
  });
  describe('claimPredicateAnd()', function() {
    it('returns an `and` predicate claim predicate', function() {
      const left = StellarBase.Claimant.claimPredicateBeforeRelativeTime('800');
      const right = StellarBase.Claimant.claimPredicateBeforeRelativeTime(
        '1200'
      );
      const predicate = StellarBase.Claimant.claimPredicateAnd(left, right);
      expect(predicate.switch()).to.equal(
        StellarBase.xdr.ClaimPredicateType.claimPredicateAnd()
      );
      const predicates = predicate.andPredicates();
      expect(predicates[0].value().toString()).to.equal('800');
      expect(predicates[1].value().toString()).to.equal('1200');
    });
  });
  describe('destination()', function() {
    it('returns the destination accountID', function() {
      const destination =
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const claimant = new StellarBase.Claimant(destination);
      expect(claimant.destination).to.equal(destination);
    });
    it('does not allow changes in accountID', function() {
      const destination =
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const claimant = new StellarBase.Claimant(destination);
      expect(() => (claimant.destination = '32323')).to.throw(
        /Claimant is immutable/
      );
    });
  });
  describe('predicate()', function() {
    it('returns the predicate', function() {
      const claimant = new StellarBase.Claimant(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(claimant.predicate.switch()).to.equal(
        StellarBase.Claimant.claimPredicateUnconditional().switch()
      );
    });
    it('does not allow changes in predicate', function() {
      const destination =
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const claimant = new StellarBase.Claimant(destination);
      expect(() => (claimant.predicate = null)).to.throw(
        /Claimant is immutable/
      );
    });
  });
  describe('toXDRObject()', function() {
    it('returns a xdr.Claimant', function() {
      const destination =
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const claimant = new StellarBase.Claimant(destination);
      const xdrClaimant = claimant.toXDRObject();
      expect(xdrClaimant).to.be.an.instanceof(StellarBase.xdr.Claimant);
      expect(xdrClaimant.switch()).to.equal(
        StellarBase.xdr.ClaimantType.claimantTypeV0()
      );
      const value = xdrClaimant.value();
      expect(
        StellarBase.StrKey.encodeEd25519PublicKey(value.destination().ed25519())
      ).to.equal(destination);
      expect(value.predicate().switch()).to.equal(
        StellarBase.Claimant.claimPredicateUnconditional().switch()
      );

      expect(() => xdrClaimant.toXDR()).to.not.throw();
    });
  });
  describe('fromXDR()', function() {
    it('returns a Claimant', function() {
      const destination =
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const claimant = new StellarBase.Claimant(destination);
      const hex = claimant.toXDRObject().toXDR('hex');
      const xdrClaimant = StellarBase.xdr.Claimant.fromXDR(hex, 'hex');
      const fromXDR = StellarBase.Claimant.fromXDR(xdrClaimant);
      expect(fromXDR.destination).to.equal(destination);
      expect(fromXDR.predicate.switch()).to.equal(
        StellarBase.Claimant.claimPredicateUnconditional().switch()
      );
    });
  });
});
