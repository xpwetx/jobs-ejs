// utils/get_chai.js
let chaiObj = null;

const getChai = async () => {
  if (!chaiObj) {
    // Import ESM-only modules dynamically
    const { expect, use } = await import("chai");
    const chaiHttp = await import("chai-http");

    // Call use() once, globally
    const chai = use(chaiHttp.default);

    // Save the references
    chaiObj = { expect, request: chai.request };
  }
  return chaiObj;
};

module.exports = getChai;