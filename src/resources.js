import xdr from './xdr';

export function newSorobanData() {
  return sorobanDataFromFootprint([], []);
}

export function sorobanDataFromFootprint(readOnly, readWrite) {
  return new xdr.SorobanTransactionData({
    resources: new xdr.SorobanResources({
      footprint: new xdr.LedgerFootprint({ readOnly, readWrite }),
      instructions: 0,
      readBytes: 0,
      writeBytes: 0,
      extendedMetaDataSizeBytes: 0
    }),
    ext: new xdr.ExtensionPoint(),
    refundableFee: new xdr.Int64(0)
  });
}

export function readSorobanData(base64) {
  return xdr.SorobanTransactionData.fromXDR(base64, 'base64');
}
