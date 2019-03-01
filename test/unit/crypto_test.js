import crypto from 'crypto';

function expectBuffersToBeEqual(left, right) {
  let leftHex = left.toString('hex');
  let rightHex = right.toString('hex');
  expect(leftHex).to.eql(rightHex);
}

/*
  We want to replace the crypto library (a Node built-in) with one
  that works on both server and browser.

  Before we do that, we should make sure the new library does the
  same thing as the old one. This is basically the only way crypto is
  used on the site.
*/

it('new hashing function behaves like crypto', () => {
  const input = 'I really hope this works';
  const cryptoHash = crypto
    .createHash('sha256')
    .update(input)
    .digest();

  const newHash = StellarBase.hash(input);

  expectBuffersToBeEqual(cryptoHash, newHash);
});
