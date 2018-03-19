var Node = require("../dist/index.js").Node;
var Tree = require("../dist/index.js").Tree;

exports['insert'] = function(test) {
  var t0 = Tree.parse('');
  Tree.insert(t0, 0, {value:'A'});
  test.equals(Tree.stringify(t0), '[A]');
  test.doesNotThrow(function(){Tree.validate(t0)});

  var t1 = Tree.parse('[A,B]');
  Tree.insert(t1, 1, {value: 'AB'});
  test.equals(Tree.stringify(t1), '[A,AB,B]');
  test.doesNotThrow(function(){Tree.validate(t1)});

  var t1b = Tree.parse('[A,B]');
  t1b.insert(1, {value: 'AB'});
  test.equals(Tree.stringify(t1b), '[A,AB,B]');
  test.doesNotThrow(function(){Tree.validate(t1b)});

  test.done();
}
