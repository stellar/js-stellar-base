import * as XDR from 'js-xdr';

var types = XDR.config((xdr) => {
  xdr.enum('ChangeTrustResultCode', {
    changeTrustMalformed: -1,
    foo: 1
  });
});

export default types;
