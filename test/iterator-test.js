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
  test.done();
}
