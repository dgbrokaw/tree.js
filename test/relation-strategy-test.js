var relationBetweenTrees = require("../dist/tree.cjs.js").relationBetweenTrees;
var oneToOneRelationBetweenTrees = require("../dist/tree.cjs.js").oneToOneRelationBetweenTrees;
var Tree = require("../dist/tree.cjs.js").Tree;

function set_ids(nodes) {
  Tree.forEach(function(node) { node.id = node.value }, nodes);
  return nodes;
}

exports["relations: same structure"] = function(test) {
  var n1 = Tree.parse('O[A,B[1,2],C]');
  var c1 = Tree.parse('O[A,B[1,2],C]');

  var mappings = n1.map(function(node) {
    return {id: node.id, target: Tree.getChild(Tree.getPath(node), c1)};
  });

  var relation = relationBetweenTrees(n1, c1);
  mappings.forEach(function(mapping) {
    test.strictEqual(relation[mapping.id][0], mapping.target);
    test.equals(relation[mapping.id].length, 1);
  });

  test.done();
}

exports["relations: target is a leaf"] = function(test) {
  var n1 = Tree.parse('A[b,c]');
  var c1 = Tree.parse('A');

  var relation = relationBetweenTrees(n1, c1);
  test.strictEqual(relation[n1.id][0], c1);
  test.strictEqual(relation[n1.getChild([0]).id][0], c1);
  test.strictEqual(relation[n1.getChild([1]).id][0], c1);

  test.done();
}

exports["relations: source is a leaf"] = function(test) {
  var n1 = Tree.parse("A");
  var c1 = Tree.parse("A[b,c]");

  var relation = relationBetweenTrees(n1, c1);
  test.equal(relation[n1.id].length, 3);

  test.done();
}

// exports["one-to-one relations"] = function(test) {
//
// }
