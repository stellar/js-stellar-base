import { XdrWriter, XdrReader } from "@stellar/js-xdr";
export { XdrWriter, XdrReader };
declare const cereal: {
    XdrWriter: typeof XdrWriter;
    XdrReader: typeof XdrReader;
};
export default cereal;
