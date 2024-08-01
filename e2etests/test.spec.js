describe("A suite is just a function", function() {
  let a;

  it("and so is a spec", function() {
    a = false;

    expect(a).toBe(true);
  });
});
