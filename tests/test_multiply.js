const multiply = require("../utils/multiply");
const get_chai = require("../utils/get_chai");

describe("testing multiply", function () {
  it("should give 7*6 = 42", async () => {
    const { expect } = await get_chai();
    expect(multiply(7, 6)).to.equal(42);
  });

  it("should give 5*3 = 15", async () => {
    const { expect } = await get_chai();
    expect(multiply(5, 3)).to.equal(15);
  });
});