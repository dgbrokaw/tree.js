var id = require("../../dist/helpers/id.js").default;
var pushNew = require("../../dist/helpers/push-new.js").default;

exports["Id: create unique ids"] = function(test) {
  var results = [];
  for (var i=0; i<100; i++) {
    pushNew(results, [id()]);
  }
  test.equal(results.length, 100);
  test.done();
}
