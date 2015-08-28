import * as StellarBase from "../src"

var keypair = StellarBase.Keypair.random();
var data = 'data to sign';
var signature = StellarBase.sign(data, keypair.rawSecretKey());

console.log('Signature: '+signature.toString('hex'));

if (StellarBase.verify(data, signature, keypair.rawPublicKey())) {
  console.log('OK!');
} else {
  console.log('Bad signature!');
}
