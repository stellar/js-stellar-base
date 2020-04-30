import * as XDR from 'js-xdr';

var types = XDR.config((xdr) => {
  xdr.enum('ErrorCode', {
    errMisc: 0,
    errDatum: 1,
    errConf: 2,
    errAuth: 3,
    errLoad: 4
  });
  xdr.typedef('ErrorMsg', xdr.string(100));
  xdr.struct('Error', [
    ['code', xdr.lookup('ErrorCode')],
    ['msg', xdr.lookup('ErrorMsg')],
    ['extra', xdr.string(100)],
    ['int32', xdr.int()],
    ['uint32', xdr.uint()],
    ['int64', xdr.uhyper()],
    ['int64', xdr.hyper()],
    ['string32', xdr.string(32)],
    ['hash', xdr.opaque(32)],
    ['encryptedBody', xdr.varOpaque(64000)],
    ['value', xdr.varOpaque()],
    [
      'ledgerEntryChanges',
      xdr.varArray(xdr.lookup('LedgerEntryChange'), 2147483647)
    ]
  ]);
});

export default types;
