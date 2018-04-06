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

exports["DepthFirstTreeIterator: traverse"] = function(test) {
  var iterator = new DepthFirstTreeIterator(Tree.parse('O[A[A1,A2],B,C[C1[C11]]]'));

  var result = iterator.traverse(n => n.value);
  test.deepEqual(result, ['O','A','A1','A2','B','C','C1','C11']);

  result = iterator.traverse(function(n) {  });
  test.ok(Array.isArray(result) && result.length === 0);

  test.done();
}

exports["DepthFirstTreeIterator: traverse + test"] = function(test) {
  var iterator = new DepthFirstTreeIterator(Tree.parse('O[A[A1,A2],B,C[C1[C11]]]'));

  var result = iterator.traverse(n => n.value, n => n.value[0] === "A");
  test.deepEqual(result, ["A", "A1", "A2"]);

  test.done();
}

exports["DepthFirstTreeIterator: select"] = function(test) {
  var iterator = new DepthFirstTreeIterator(Tree.parse('O[A[A1,A2],B,C[C1[C11]]]'));

  var result = iterator.select(function(n) { return true });
  test.equal(result.value, "O");

  result = iterator.select(function(n) { return n.value === "B" });
  test.equal(result.value, "B");

  test.done();
}

exports["DepthFirstTreeIterator: traverseRange"] = function(test) {
  var iterator = new DepthFirstTreeIterator(Tree.parse('O[A[A1,A2],B,C[C1[C11]]]'));

  var result = iterator.traverseRange(r => r.map(n => n.value), null, true);
  test.deepEqual(result, [['O']]);

  result = iterator.traverseRange(r => r.map(n => n.value), null);
  test.deepEqual(result, [ [ 'O' ],
    [ 'A' ],
    [ 'A', 'B' ],
    [ 'A', 'B', 'C' ],
    [ 'A1' ],
    [ 'A1', 'A2' ],
    [ 'A2' ],
    [ 'B' ],
    [ 'B', 'C' ],
    [ 'C' ],
    [ 'C1' ],
    [ 'C11' ] ]
  );

  result = iterator.traverse(function(n) {  });
  test.ok(Array.isArray(result) && result.length === 0);

  test.done();
}
