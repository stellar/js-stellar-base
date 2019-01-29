import times from 'lodash/times';

function bufferToArray(buffer, length, offset = 0) {
  return times(length, (n) => buffer[offset + n]);
}

function cursorToArray(io) {
  return bufferToArray(io.buffer(), io.tell());
}

module.exports = {
  bufferToArray,
  cursorToArray
};
