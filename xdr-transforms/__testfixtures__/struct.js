import * as XDR from 'js-xdr';

var types = XDR.config((xdr) => {
  xdr.typedef('Int32', xdr.int());
  xdr.enum('ErrorCode', {
    errMisc: 0,
    errDatum: 1,
    errConf: 2,
    errAuth: 3,
    errLoad: 4
  });
  xdr.struct('Error', [
    ['code', xdr.lookup('ErrorCode')],
    ['msg', xdr.lookup('ErrorMsg')],
    ['extra', xdr.string(100)],
    ['age', xdr.lookup('Int32')],
    ['hash', xdr.lookup('Hash')],
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
    ],
    ['accountEntries', xdr.array(xdr.lookup('LedgerEntryChange'), 4)],
    ['ClearFlags', xdr.option(xdr.lookup('Uint32'))],
    ['changes', xdr.lookup('LedgerEntryChanges')],
    ['participants', xdr.lookup('Participants')]
  ]);
  xdr.typedef('Hash', xdr.opaque(32));
  xdr.typedef('ErrorMsg', xdr.string(100));
  xdr.typedef('Uint32', xdr.uint());
  xdr.typedef(
    'LedgerEntryChanges',
    xdr.varArray(xdr.lookup('LedgerEntryChange'), 2147483647)
  );
  xdr.typedef('Participants', xdr.array(xdr.lookup('Hash'), 4));
  xdr.union('LedgerEntryChange', {
    switchOn: xdr.lookup('ErrorCode'),
    switchName: 'type',
    switches: [
      ['ledgerEntryCreated', 'created'],
      ['ledgerEntryUpdated', 'updated']
    ],
    arms: {
      created: xdr.lookup('ErrorMsg'),
      updated: xdr.lookup('Uint32')
    }
  });
});

export default types;
