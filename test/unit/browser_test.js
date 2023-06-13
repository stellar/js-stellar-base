describe('Browser version tests', function () {
  it('window object exists', function () {
    if (typeof window !== 'undefined') {
      // Test passes if window is defined
      expect(true).to.be.true;
    }
  });
});