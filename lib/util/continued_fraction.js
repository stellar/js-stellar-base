"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.best_r = best_r;

var _bignumber = require("bignumber.js");

var _bignumber2 = _interopRequireDefault(_bignumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-bitwise
var MAX_INT = (1 << 31 >>> 0) - 1;

/**
 * Calculates and returns the best rational approximation of the given real number.
 * @private
 * @param {string|number|BigNumber} rawNumber Real number
 * @throws Error Throws `Error` when the best rational approximation cannot be found.
 * @returns {array} first element is n (numerator), second element is d (denominator)
 */
function best_r(rawNumber) {
  var number = new _bignumber2.default(rawNumber);
  var a = void 0;
  var f = void 0;
  var fractions = [[new _bignumber2.default(0), new _bignumber2.default(1)], [new _bignumber2.default(1), new _bignumber2.default(0)]];
  var i = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (number.gt(MAX_INT)) {
      break;
    }
    a = number.floor();
    f = number.sub(a);
    var h = a.mul(fractions[i - 1][0]).add(fractions[i - 2][0]);
    var k = a.mul(fractions[i - 1][1]).add(fractions[i - 2][1]);
    if (h.gt(MAX_INT) || k.gt(MAX_INT)) {
      break;
    }
    fractions.push([h, k]);
    if (f.eq(0)) {
      break;
    }
    number = new _bignumber2.default(1).div(f);
    i += 1;
  }

  var _fractions = _slicedToArray(fractions[fractions.length - 1], 2),
      n = _fractions[0],
      d = _fractions[1];

  if (n.isZero() || d.isZero()) {
    throw new Error("Couldn't find approximation");
  }

  return [n.toNumber(), d.toNumber()];
}