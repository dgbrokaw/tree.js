var TreeSerializeDirector = require("../dist/index.js").TreeSerializeDirector;
var StringBuilder = require("../dist/index.js").StringBuilder;
var Tree = require("../dist/index.js").Tree;

exports["TreeSerializeDirector: constructor"] = function(test) {
  var director = new TreeSerializeDirector(new StringBuilder());
  test.ok(director.builder);
  test.done();
}

exports["TreeSerializeDirector: construct"] = function(test) {
  var director = new TreeSerializeDirector(new StringBuilder());

  test.equals(director.construct(Tree.parse('A')), 'A');
  test.equals(director.construct(Tree.parse('[]')), '[]');
  test.equals(director.construct(Tree.parse('A,B')), 'A,B');
  test.equals(director.construct(Tree.parse('[A[A1,A2],B,C[C1[C11]]]')), '[A[A1,A2],B,C[C1[C11]]]');

  test.done();
}
