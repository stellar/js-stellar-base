import BigNumber from "bignumber.js";
import SDKBigNumber from "../../../src/util/bignumber";

describe("bignumber", function () {
  it("Debug mode has been enabled in the cloned bignumber.", function () {
    expect(SDKBigNumber.DEBUG).to.be.true;
  });

  it("Debug mode has been disabled (default setting) in the original bignumber.", function () {
    expect(BigNumber.DEBUG).to.be.undefined;
  });
});
