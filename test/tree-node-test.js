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

exports["Node: children"] = function(test) {
  var node = new Node();

  test.ok(!node.hasChildren());
  node.children = new Node();
  test.ok(node.hasChildren() && node.children.length === 1);
  node.append(new Node());
  test.ok(node.children.length === 2);

  test.done();
}

exports["Node: position"] = function(test) {
  var t1 = Tree.parse('[A,B[a],C]');

  test.equals(t1.getChild([0]).position, 0);
  test.equals(t1.getChild([2]).position, 2);
  test.equals(t1.getChild([1,0]).position, 0);
  test.throws(function(){t1.position});

  var c = t1.getChild([1]);
  c.remove();
  test.throws(function(){c.position});

  test.done();
}

// exports["Node: firstChild & lastChild"] = function(test) {
//   var t1 = Tree.parse('A');
//   test.equals(t1.firstChild, null);
//
//   var t2 = Tree.parse('[A]');
//   test.equals(t2.firstChild.stringify(), "A");
//   test.equals(t2.lastChild.stringify(), "A");
//
//   var t3 = Tree.parse("[A,B]");
//   test.equals(t3.firstChild.stringify(), "A");
//   test.equals(t3.lastChild.stringify(), "B");
//
//   var t4 = Tree.parse("[A,B,C]");
//   test.equals(t4.lastChild.stringify(), "C");
//
//   test.done();
// }

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

exports["Node: replaceWith"] = function(test) {
  var t0 = Tree.parse('[A]');
  var n0 = new Node();
  n0.value = "B";
  t0.getChild([0]).replaceWith(n0);
  test.equals(t0.stringify(), '[B]');
  test.doesNotThrow(function(){Tree.validate(t0)});

  var t1 = Tree.parse('[A[a,b],B]');
  t1.getChild([0]).replaceWith(t1.getChild([0,1]));
  test.equals(t1.stringify(), '[b,B]');
  test.doesNotThrow(function(){Tree.validate(t1)});

  var t2 = Tree.parse('[A,B]');
  var t3 = Tree.parse('[C[a],D]');
  t2.getChild([1]).replaceWith(t3.getChild([0]));
  test.equals(t2.stringify(), '[A,C[a]]');
  test.equals(t3.stringify(), '[D]');
  test.doesNotThrow(function(){Tree.validate(t2)});
  test.doesNotThrow(function(){Tree.validate(t3)});

  var t4 = Tree.parse('[A,B]');
  t4.getChild([0]).replaceWith(t4.getChild([0]));
  test.equals(t4.stringify(), '[A,B]');
  test.doesNotThrow(function(){Tree.validate(t4)});

  test.done();
}

exports["Node: switchWithSibling"] = function(test) {
  var t0 = Tree.parse('[A,B,C]');
  t0.getChild([0]).switchWithSibling(t0.getChild([2]));
  test.equals(t0.stringify(), '[C,B,A]');
  test.doesNotThrow(function(){Tree.validate(t0)});

  var t1 = Tree.parse('[A,B,C]');
  t1.getChild([2]).switchWithSibling(t1.getChild([0]));
  test.equals(t1.stringify(), '[C,B,A]');
  test.doesNotThrow(function(){Tree.validate(t1)});

  var t2 = Tree.parse('[A,B,C]');
  t2.getChild([1]).switchWithSibling(t2.getChild([2]));
  test.equals(t2.stringify(), '[A,C,B]');
  test.doesNotThrow(function(){Tree.validate(t2)});

  var t3 = Tree.parse('[A,B,C]');
  t3.getChild([1]).switchWithSibling(t3.getChild([0]));
  test.equals(Tree.stringify(t3), '[B,A,C]');
  test.doesNotThrow(function(){Tree.validate(t3)});

  var t4 = Tree.parse('[A[b]]');
  test.throws(function() {t4.getChild([0]).switchWithSibling(t4.getChild([0,0]))});

  var t5 = Tree.parse('[A]');
  t5.getChild([0]).switchWithSibling(t5.getChild([0]));

  var t6 = Tree.parse("A,B");
  test.throws(function(){t6[0].switchWithSibling(t6[1])});

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

exports["Node: insertRange"] = function(test) {
  var t0 = Tree.parse('');
  t0.insertRange(0, Tree.parse('[a,b]').children);
  test.equals(t0.stringify(), '[a,b]');
  test.doesNotThrow(function(){Tree.validate(t0)});

  var t0b = Tree.parse('');
  t0b.prependRange(Tree.parse('[a,b]').children);
  test.equals(t0b.stringify(), '[a,b]');
  test.doesNotThrow(function(){Tree.validate(t0b)});

  var t0c = Tree.parse('');
  t0c.appendRange(Tree.parse('[a,b]').children);
  test.equals(t0c.stringify(), '[a,b]');
  test.doesNotThrow(function(){Tree.validate(t0c)});

  var t1 = Tree.parse('[A,B]');
  t1.insertRange(1, Tree.parse('[a,b,c]').children.slice(1,3));
  test.equals(t1.stringify(), '[A,b,c,B]');
  test.doesNotThrow(function(){Tree.validate(t1)});

  var t2 = Tree.parse('[A,B]');
  test.throws(function(){t1.insertRange(1, [])});
  test.equals(t2.stringify(), '[A,B]');
  test.doesNotThrow(function(){Tree.validate(t2)});

  var t3 = Tree.parse('[A,B]');
  t3.insertRange(2, Tree.parse('[a,b,c]').children.slice(1,3));
  test.equals(t3.stringify(), '[A,B,b,c]');
  test.doesNotThrow(function(){Tree.validate(t3)});

  test.done();
}

exports["Node: removeRange"] = function(test) {
  var t1 = Tree.parse('[A,B,C]');
  var n = t1.children[1];
  var position = t1.removeRange([n]);
  test.equals(t1.stringify(), '[A,C]');
  test.equals(position, 1);
  test.equals(n.parent, null);
  test.doesNotThrow(function(){Tree.validate(t1)});

  var t2 = Tree.parse('[A,B[a,b],C,D]');
  position = t2.removeRange(t2.children.slice(0,3));
  test.equals(t2.stringify(), '[D]');
  test.equals(position, 0);
  test.doesNotThrow(function(){Tree.validate(t2)});

  test.done();
}

exports["Node: iterator"] = function(test) {
  var node = new Node();
  test.ok(node.createIterator() instanceof node.iterator)
  test.done();
}
