describe('Browser version tests', function () {
  it('window object exists', function () {
    // Test passes if window is defined
    expect(typeof window).to.not.equal('undefined');
  });
});
