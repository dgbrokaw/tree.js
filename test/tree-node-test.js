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

exports["Node: path"] = function(test) {
  var tree = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]');

  test.deepEqual(tree.getChild([0]).path, [0]);
  test.deepEqual(tree.getChild([1]).path, [1]);
  test.deepEqual(tree.getChild([1,1]).path, [1,1]);
  test.deepEqual(tree.getChild([3,0,2,1]).path, [3,0,2,1]);

  test.done()
}

exports["Node: isRoot"] = function(test) {
  var t1 = Tree.parse('A,B[a]');

  test.ok(t1[0].isRoot());
  test.ok(t1[1].isRoot());
  test.ok(!t1[1].getChild([0]).isRoot());

  test.done();
}

exports["Node: root"] = function(test) {
  var t1 = Tree.parse('[A,B[a]]');

  test.equals(t1.getChild([0]).root, t1);
  test.equals(t1.getChild([1]).root, t1);
  test.equals(t1.getChild([1,0]).root, t1);
  test.equals(t1.getChild([1,0]).root, t1);

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
  t3.getChild([0]).append({value: 'c'});
  test.equals(t3.stringify(), '[A[a,b,c],B]');
  test.doesNotThrow(function(){Tree.validate(t3)});

  var t4 = Tree.parse('[A[a,b],B]');
  t4.getChild([0]).prepend({value: 'c'});
  test.equals(t4.stringify(), '[A[c,a,b],B]');
  test.doesNotThrow(function(){Tree.validate(t4)});

  test.done();
}

exports['Node: single-node remove'] = function(test) {
  var idx;

  var t0 = Tree.parse('[A,B,C]');
  var n = t0.getChild([1]);
  idx = n.remove();
  test.equals(n.parent, null);
  test.equals(t0.stringify(), '[A,C]');
  test.doesNotThrow(function(){Tree.validate(t0)});
  test.equals(idx, 1);

  var t1 = Tree.parse('[A]');
  idx = t1.getChild([0]).remove();
  test.equals(t1.stringify(), '');
  test.doesNotThrow(function(){Tree.validate(t1)});
  test.equals(idx, 0);

  var t2 = Tree.parse('[A,B[a,b],C]')
  idx = t2.getChild([1,1]).remove();
  test.equals(t2.stringify(), '[A,B[a],C]');
  test.doesNotThrow(function(){Tree.validate(t2)});

  test.done();
}

exports["Node: getChild"] = function(test) {
  var t1 = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]');

  test.equals(t1.getChild([0]).value, 'A');
  test.equals(t1.getChild([1]).value, 'B');
  test.equals(t1.getChild([1, 1]).value, 'b');
  test.equals(t1.getChild([3,0,2,1]).value, '2');
  test.equals(t1.getChild([3,0,2,1]).value, '2');
  test.equals(t1.getChild([4]), null);
  test.equals(t1.getChild([1,3]), null);
  test.equals(t1.getChild([1,0,0]), null);

  test.done();
}

exports["Node: getAncestor"] = function(test) {
  var t1 = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]');

  var n = t1.getChild([3,0,2,1]);
  test.equals(n.getAncestor(0).value, '2');
  test.equals(n.getAncestor(1).value, 'z');
  test.equals(n.getAncestor(2).value, 'j');
  test.equals(n.getAncestor(3).value, 'D');
  test.equals(n.getAncestor(4).value, '');
  test.equals(n.getAncestor(5), null);

  test.done();
}
