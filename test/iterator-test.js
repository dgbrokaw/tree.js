var DepthFirstTreeIterator = require("../dist/index.js").DepthFirstTreeIterator;
var Node = require("../dist/index.js").Node;
var Tree = require("../dist/index.js").Tree;

exports["DepthFirstTreeIterator: constructor"] = function(test) {
  var iterator1 = new DepthFirstTreeIterator();
  test.ok(Array.isArray(iterator1.trees) && iterator1.trees.length === 0);
  var iterator2 = new DepthFirstTreeIterator(new Node());
  test.ok(Array.isArray(iterator2.trees) && iterator2.trees.length === 1);
  test.done();
}

exports["DepthFirstTreeIterator: isDone & start"] = function(test) {
  var iterator = new DepthFirstTreeIterator();
  test.ok(!iterator.isDone());
  iterator.start();
  test.ok(iterator.isDone());
  test.done();
}

exports["DepthFirstTreeIterator: traverse"] = function(test) {
  var iterator = new DepthFirstTreeIterator(Tree.parse('O[A[A1,A2],B,C[C1[C11]]]'));
  iterator.traverse(n => n.value);
  test.deepEqual(iterator.result, ['O','A','A1','A2','B','C','C1','C11']);
  iterator.traverse(function(n) {  });
  test.ok(Array.isArray(iterator.result) && iterator.result.length === 0);
  test.done();
}

exports["DepthFirstTreeIterator: traverse + test"] = function(test) {
  var iterator = new DepthFirstTreeIterator(Tree.parse('O[A[A1,A2],B,C[C1[C11]]]'));
  iterator.traverse(n => n.value, n => n.value[0] === "A");
  test.deepEqual(iterator.result, ["A", "A1", "A2"]);
  test.done();
}

exports["DepthFirstTreeIterator: select"] = function(test) {
  var iterator = new DepthFirstTreeIterator(Tree.parse('O[A[A1,A2],B,C[C1[C11]]]'));
  iterator.select(function(n) { return true });
  test.equal(iterator.result[0].value, "O");
  iterator.select(function(n) { return n.value === "B" });
  test.equal(iterator.result[0].value, "B");
  test.done();
}
