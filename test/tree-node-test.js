var Node = require("../dist/index.js").Node;
var Tree = require("../dist/index.js").Tree;

exports["Node: constructor"] = function(test) {
  var node = new Node();
  test.ok(Array.isArray(node.children) && node.children.length === 0);
  test.equals(node.parent, null);
  test.equals(node.ls, null);
  test.equals(node.rs, null);
  test.ok(typeof(node.id) === "string");

  test.done();
}

exports['Node: single-child insertion'] = function(test) {
  var t0 = Tree.parse('');
  t0.insert(0, {value:'A'});
  test.equals(t0.stringify(), '[A]');
  test.doesNotThrow(function(){Tree.validate(t0)});

  var t1 = Tree.parse('[A,B]');
  t1.insert(1, {value: 'AB'});
  test.equals(t1.stringify(), '[A,AB,B]');
  test.doesNotThrow(function(){Tree.validate(t1)});

  var t2 = Tree.parse('');
  t2.append({value:'A'});
  test.equals(t2.stringify(), '[A]');
  test.doesNotThrow(function(){Tree.validate(t2)});

  var t3 = Tree.parse('[A[a,b],B]');
  t3.children[0].append({value: 'c'});
  test.equals(t3.stringify(), '[A[a,b,c],B]');
  test.doesNotThrow(function(){Tree.validate(t3)});

  var t4 = Tree.parse('[A[a,b],B]');
  t4.children[0].prepend({value: 'c'});
  test.equals(t4.stringify(), '[A[c,a,b],B]');
  test.doesNotThrow(function(){Tree.validate(t4)});

  test.done();
}

exports['Node: single-node remove'] = function(test) {
  var idx;

  var t0 = Tree.parse('[A,B,C]');
  var n = t0.children[1];
  idx = n.remove();
  test.equals(n.parent, null);
  test.equals(Tree.stringify(t0), '[A,C]');
  test.doesNotThrow(function(){Tree.validate(t0)});
  test.equals(idx, 1);

  var t1 = Tree.parse('[A]');
  idx = t1.children[0].remove();
  test.equals(Tree.stringify(t1), '');
  test.doesNotThrow(function(){Tree.validate(t1)});
  test.equals(idx, 0);

  var t2 = Tree.parse('[A,B[a,b],C]')
  idx = t2.children[1].children[1].remove();
  test.equals(Tree.stringify(t2), '[A,B[a],C]');
  test.doesNotThrow(function(){Tree.validate(t2)});

  test.done();
}

exports["Node: accessors"] = function(test) {
  var t1 = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]')

  test.equals(t1.getChild([0]).value, 'A')
  test.equals(t1.getChild([1]).value, 'B')
  test.equals(t1.getChild([1, 1]).value, 'b')
  test.equals(t1.getChild([3,0,2,1]).value, '2')
  test.equals(t1.getChild([3,0,2,1]).value, '2')
  test.equals(t1.getChild([4]), null);
  test.equals(t1.getChild([1,3]), null);
  test.equals(t1.getChild([1,0,0]), null);

  test.done()
}
