var id = require("../dist/tree.cjs.js").uid;
var pushNew = require("../dist/tree.cjs.js").pushNew;

exports["Id: create unique ids"] = function(test) {
  var results = [];
  for (var i=0; i<100; i++) {
    pushNew(results, [id()]);
  }
  test.equal(results.length, 100);
  test.done();
}
