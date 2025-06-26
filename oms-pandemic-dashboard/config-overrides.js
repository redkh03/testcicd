const { override } = require("customize-cra");
const { addBabelPlugin } = require("customize-cra");

module.exports = override(
  addBabelPlugin("babel-plugin-istanbul")
);
