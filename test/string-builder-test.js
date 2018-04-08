var StringBuilder = require("../dist/tree.cjs.js").StringBuilder;

exports["StringBuilder: constructor"] = function(test) {
  var builder = new StringBuilder();
  test.strictEqual(builder.getResult(), null);
  test.done();
}

exports["StringBuilder: start"] = function(test) {
  var builder = new StringBuilder();
  builder.start();
  test.equal(builder.getResult(), "");
  test.done();
}

exports["StringBuilder: value & children"] = function(test) {
  var builder = new StringBuilder();
  builder.start();
  builder.createChild();
  builder.createSibling();
  builder.finishSiblings();
  builder.setValue({value: "A"});
  test.equal(builder.getResult(), "[,]A");
  test.done();
}
