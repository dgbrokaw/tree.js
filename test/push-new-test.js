var pushNew = require("../dist/helpers/push-new.js").default;
var Node = require("../dist/index.js").Node;

exports["pushNew: all different"] = function(test) {
  var arr1 = [new Node(), new Node()];
  var arr2 = [new Node(), new Node()];
  pushNew(arr1, arr2);
  test.ok(arr1.includes(arr2[0]) && arr2.includes(arr2[1]));
  test.done();
}

exports["pushNew: some different"] = function(test) {
  var arr1 = [new Node(), new Node()];
  var shared = arr1[0];
  var arr2 = [shared, new Node()];

  pushNew(arr1, arr2);
  test.ok(arr1.length === 3);
  test.ok(arr1.indexOf(shared) === 1);

  test.done();
}

exports["pushNew: none different"] = function(test) {
  var arr1 = [new Node(), new Node()];
  var arr2 = [arr1[0], arr1[1]];

  pushNew(arr1, arr2);
  test.ok(arr1.length === 2);

  test.done();
}
