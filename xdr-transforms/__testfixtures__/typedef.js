import * as XDR from 'js-xdr';

var types = XDR.config((xdr) => {
  xdr.typedef('Uint32', xdr.uint());
  xdr.typedef('Int32', xdr.int());
  xdr.typedef('Uint64', xdr.uhyper());
  xdr.typedef('Int64', xdr.hyper());
  xdr.typedef('String32', xdr.string(32));
  xdr.typedef('String64', xdr.string(64));
  // xdr.typedef("EncryptedBody", xdr.varOpaque(64000));
  // xdr.typedef("PeerStatList", xdr.varArray(xdr.lookup("PeerStats"), 25));
  // xdr.typedef("Hash", xdr.opaque(32));
  // xdr.typedef("Uint256", xdr.opaque(32));
  // xdr.typedef("Signature", xdr.varOpaque(64));
  // xdr.typedef("SignatureHint", xdr.opaque(4));
  // xdr.typedef("NodeId", xdr.lookup("PublicKey"));
  // xdr.typedef("Value", xdr.varOpaque());
  // xdr.typedef("AccountId", xdr.lookup("PublicKey"));
  // xdr.typedef("Thresholds", xdr.opaque(4));
  // xdr.typedef("SequenceNumber", xdr.lookup("Int64"));
  // xdr.typedef("TimePoint", xdr.lookup("Uint64"));
  // xdr.typedef("DataValue", xdr.varOpaque(64));
  // xdr.typedef("AssetCode4", xdr.opaque(4));
  // xdr.typedef("AssetCode12", xdr.opaque(12));
  // xdr.typedef("UpgradeType", xdr.varOpaque(128));
  // xdr.typedef("LedgerEntryChanges", xdr.varArray(xdr.lookup("LedgerEntryChange"), 2147483647));
});

export default types;
