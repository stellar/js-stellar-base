import {best_r} from '../../../src/util/continued_fraction.js';
import BigNumber from 'bignumber.js';

describe('best_r', function() {
  it("correctly calculates the best rational approximation", function() {
    var tests = [
      ['1,10', '0.1'],
      ['1,100', '0.01'],
      ['1,1000', '0.001'],
      ['54301793,100000', '543.017930'],
      ['31969983,100000', '319.69983'],
      ['93,100', '0.93'],
      ['1,2', '0.5'],
      ['173,100', '1.730'],
      ['5333399,6250000', '0.85334384'],
      ['11,2', '5.5'],
      ['272783,100000', '2.72783'],
      ['638082,1', '638082.0'],
      ['36731261,12500000', '2.93850088'],
      ['1451,25', '58.04'],
      ['8253,200', '41.265'],
      ['12869,2500', '5.1476'],
      ['4757,50', '95.14'],
      ['3729,5000', '0.74580'],
      ['4119,1', '4119.0'],
      ['118,37', new BigNumber(118).div(37)]
    ];

    for (var i in tests) {
      expect(best_r(tests[i][1]).toString()).to.be.equal(tests[i][0]);
    }
  });

  it("throws an error when best rational approximation cannot be found", function() {
    expect(() => best_r("0.0000000003")).to.throw(/Couldn't find approximation/);
    expect(() => best_r("2147483648")).to.throw(/Couldn't find approximation/);
  });
});
