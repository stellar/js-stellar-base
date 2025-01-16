import xdr from './generated/curr_generated';
import { scValToNative } from './scval';

xdr.scvMapSorted = (items) => {
    return xdr.ScVal.scvMap(items.sort((a, b) => {
        // Both a and b are `ScMapEntry`s, so we need to sort by underlying key.
        //
        // We couldn't possibly handle every combination of keys since Soroban
        // maps don't enforce consistent types, so we do a best-effort and try
        // sorting by "number-like" or "string-like."
        let nativeA = scValToNative(a.key()),
            nativeB = scValToNative(b.key());

        switch (typeof nativeA) {
            case "number":
            case "bigint":
                return nativeA < nativeB;

            default:
                return nativeA.toString().localeCompare(nativeB.toString());
        }
    }));
}

export default xdr;
