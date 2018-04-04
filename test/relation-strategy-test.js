var relationBetweenTrees = require("../dist/index.js").relationBetweenTrees;
var oneToOneRelationBetweenTrees = require("../dist/index.js").oneToOneRelationBetweenTrees;
var Tree = require("../dist/index.js").Tree;

exports["relations"] = function(test) {
  function set_ids(nodes) {
    Tree.forEach(function(node) { node.id = node.value }, nodes);
    return nodes;
  }
  var relation;
  var n0 = set_ids(Tree.parse('[A]').children[0]);
  var c0 = Tree.parse('[A]').children[0];
  relation = Tree.getRelationBetween(n0, c0);
  test.strictEqual(relation.A[0], c0);
  test.equals(relation.A.length, 1);

  var n1 = Tree.parse('O[A,B[1,2],C]');
  var c1 = Tree.parse('O[A,B[1,2],C]');
  var mappings = n1.map(function(node) {
    return {id: node.id, target: Tree.getChild(Tree.getPath(node), c1)};
  });
  relation = Tree.getRelationBetween(n1, c1);
  mappings.forEach(function(mapping) {
    test.strictEqual(relation[mapping.id][0], mapping.target);
    test.equals(relation[mapping.id].length, 1);
  });

  test.done();
}
