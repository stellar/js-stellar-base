import * as XDR from 'js-xdr';

var types = XDR.config((xdr) => {
  xdr.typedef('Uint32', xdr.uint());
  xdr.typedef('Int32', xdr.int());
  xdr.typedef('Uint64', xdr.uhyper());
  xdr.typedef('Int64', xdr.hyper());
  xdr.typedef('String32', xdr.string(32));
  xdr.typedef('String64', xdr.string(64));
  xdr.typedef('Hash', xdr.opaque(32));
  xdr.typedef('EncryptedBody', xdr.varOpaque(64000));
  xdr.typedef('Value', xdr.varOpaque());
  xdr.typedef(
    'LedgerEntryChanges',
    xdr.varArray(xdr.lookup('LedgerEntryChange'), 2147483647)
  );
  xdr.typedef('SequenceNumber', xdr.lookup('Int64'));
  xdr.typedef('NodeId', xdr.lookup('PublicKey'));
  xdr.typedef('AccountId', xdr.lookup('PublicKey'));
  xdr.typedef('ClearFlags', xdr.option(xdr.lookup('Uint32')));
});

export default types;
