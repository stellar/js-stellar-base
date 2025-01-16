import xdr from './generated/curr_generated';
import { scValToNative } from './scval';

xdr.scvMapSorted = (items) => {
  let sorted = Array.from(items).sort((a, b) => {
    // Both a and b are `ScMapEntry`s, so we need to sort by underlying key.
    //
    // We couldn't possibly handle every combination of keys since Soroban
    // maps don't enforce consistent types, so we do a best-effort and try
    // sorting by "number-like" or "string-like."
    let nativeA = scValToNative(a.key()),
      nativeB = scValToNative(b.key());

    switch (typeof nativeA) {
      case 'number':
      case 'bigint':
        return nativeA < nativeB ? -1 : 1;

      default:
        return nativeA.toString().localeCompare(nativeB.toString());
    }
  });

  return xdr.ScVal.scvMap(sorted);
};

export default xdr;
