// Automatically generated on 2020-04-16T16:15:58-05:00
// DO NOT EDIT or your changes may be overwritten

/* jshint maxstatements:2147483647  */
/* jshint esnext:true  */

import * as XDR from 'js-xdr';

var types = XDR.config((xdr) => {
  // === xdr source ============================================================
  //
  //   enum ErrorCode
  //   {
  //       ERR_MISC = 0, // Unspecific error
  //       ERR_DATA = 1, // Malformed data
  //       ERR_CONF = 2, // Misconfiguration error
  //       ERR_AUTH = 3, // Authentication failure
  //       ERR_LOAD = 4  // System overloaded
  //   };
  //
  // ===========================================================================
  xdr.enum('ErrorCode', {
    errMisc: 0,
    errDatum: 1,
    errConf: 2,
    errAuth: 3,
    errLoad: 4
  });
});
export default bar;
