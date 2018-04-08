var TreeSerializeDirector = require("../dist/tree.cjs.js").TreeSerializeDirector;
var StringBuilder = require("../dist/tree.cjs.js").StringBuilder;
var Tree = require("../dist/tree.cjs.js").Tree;

exports["TreeSerializeDirector: constructor"] = function(test) {
  var director = new TreeSerializeDirector(new StringBuilder());
  test.ok(director.builder);
  test.done();
}

exports["TreeSerializeDirector: construct"] = function(test) {
  var director = new TreeSerializeDirector(new StringBuilder());

  test.equals(director.construct(Tree.parse('A')), 'A');
  test.equals(director.construct(Tree.parse('[]')), '[]');
  test.equals(Tree.stringify(Tree.parse('[A,B]')), '[A,B]');
  test.equals(director.construct(Tree.parse('[A[A1,A2],B,C[C1[C11]]]')), '[A[A1,A2],B,C[C1[C11]]]');

  test.done();
}
