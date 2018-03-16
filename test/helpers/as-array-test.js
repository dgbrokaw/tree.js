var asArray = require("../../dist/helpers/as-array.js").default;

exports["asArray: no argument"] = function(test) {
  var arr = asArray();
  test.ok(Array.isArray(arr) && arr.length === 0);
  test.done();
}

exports["asArray: non-array argument"] = function(test) {
  var arr = asArray("x");
  test.ok(Array.isArray(arr) && arr.length === 1);
  test.done();
}

exports["asArray: array argument"] = function(test) {
  var arr = asArray(["x", "y"]);
  // If the length is 1, then the argument was wrapped in another array.
  test.ok(Array.isArray(arr) && arr.length === 2);
  test.done();
}
