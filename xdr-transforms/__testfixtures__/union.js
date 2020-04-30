var types = XDR.config((xdr) => {
  xdr.enum('ErrorCode', {
    errMisc: 0,
    errDatum: 1,
    errConf: 2,
    errAuth: 3,
    errLoad: 4
  });

  xdr.struct('Error', [
    ['code', xdr.lookup('ErrorCode')],
    ['msg', xdr.string(100)]
  ]);

  xdr.union('StellarMessage', {
    switchOn: xdr.lookup('MessageType'),
    switchName: 'type',
    switches: [['errorMsg', 'error']],
    arms: {
      error: xdr.lookup('Error')
    }
  });
});
