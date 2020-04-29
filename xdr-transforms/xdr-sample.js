import * as XDR from 'js-xdr';

var types = XDR.config((xdr) => {
  xdr.enum('ChangeTrustResultCode', {
    changeTrustMalformed: -1,
    foo: 1
  });

  xdr.typedef('Uint32', xdr.uint());
  xdr.typedef('Int32', xdr.int());
});
export default bar;
