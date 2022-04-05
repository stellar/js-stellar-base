import xdr from './generated/stellar-xdr_generated';
import { StrKey, encodeCheck, decodeCheck } from './strkey';

export class SignerKey {
  static decodeAddress(address) {
    const signerKeyMap = {
      ed25519PublicKey: xdr.SignerKey.signerKeyTypeEd25519,
      preAuthTx: xdr.SignerKey.signerKeyTypePreAuthTx,
      sha256Hash: xdr.SignerKey.signerKeyTypeHashX,
      signedPayload: xdr.SignerKey.signerKeyTypeEd25519SignedPayload
    };

    const vb = StrKey.getVersionByteForPrefix(address);
    const encoder = signerKeyMap[vb];
    if (!encoder) {
      throw new Error(`invalid signer key type (${vb})`);
    }

    const raw = decodeCheck(vb, address);
    switch (vb) {
      case 'signedPayload':
        return encoder(
          new xdr.SignerKeyEd25519SignedPayload({
            ed25519: raw.slice(0, 32),
            payload: raw.slice(32 + 4)
          })
        );

      case 'ed25519PublicKey': // falls through
      case 'preAuthTx': // falls through
      case 'sha256Hash': // falls through
      default:
        return encoder(raw);
    }
  }

  static encodeSignerKey(signerKey) {
    let strkeyType;

    switch (signerKey.switch()) {
      case xdr.SignerKeyType.signerKeyTypeEd25519():
        strkeyType = 'ed25519PublicKey';
        break;

      case xdr.SignerKeyType.signerKeyTypePreAuthTx():
        strkeyType = 'preAuthTx';
        break;

      case xdr.SignerKeyType.signerKeyTypeHashX():
        strkeyType = 'sha256Hash';
        break;

      case xdr.SignerKeyType.signerKeyTypeEd25519SignedPayload():
        strkeyType = 'signedPayload';
        break;

      default:
        throw new Error(`invalid SignerKey (type: ${signerKey.switch()})`);
    }

    let raw;
    switch (strkeyType) {
      case 'ed25519PublicKey': // falls through
      case 'preAuthTx': // falls through
      case 'sha256Hash':
        raw = signerKey.value();
        break;

      case 'signedPayload':
        raw = signerKey.ed25519SignedPayload().toXDR('raw');
        break;

      default:
        // shouldn't happen
        throw new Error(`invalid SignerKey (type: ${signerKey.switch()})`);
    }

    return encodeCheck(strkeyType, raw);
  }
}
