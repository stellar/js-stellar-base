import { ContractAuth, HashIdPreimageContractAuth } from './xdr';

ContractAuth.prototype.canSign = (keypair) => {
  const address = this.addressWithNonce()?.address();
  if (!address || address.switch() !== 'scAddressTypeAccount') return false;
  return (
    keypair.publicKey() ===
    StellarSdk.StrKey.encodeEd25519PublicKey(address.accountId().ed25519())
  );
};

ContractAuth.prototype.sign = (keypair, networkId) => {
  const a = this.addressWithNonce();
  const sig = keypair.sign(
    new HashIdPreimageContractAuth({
      networkId,
      nonce: a.nonce(),
      invocation: this.rootInvocation()
    }).toXDR('raw')
  );
  this.signatureArgs.push(sig);
};
