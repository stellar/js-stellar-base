function bufferToArray(buffer, length, offset = 0) {
  return Array.from({ length }, (_, n) => buffer[offset + n]);
}

function cursorToArray(io) {
  return bufferToArray(io.buffer(), io.tell());
}

module.exports = {
  bufferToArray,
  cursorToArray
};
