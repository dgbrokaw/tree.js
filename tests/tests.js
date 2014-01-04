/// Copyright by Erik Weitnauer, 2013.

/// testing with nodeunit
var Tree   = require('../tree.js').Tree;

exports['Tree'] = function(test) {
  var t1 = new Tree();
  var n = {};
  var t2 = new Tree(n);

  test.equals(t1.children.length, 0);
  test.equals(t2.children.length, 1);
  test.equals(t2.children[0], n);
  test.equals(t2.children[0].parent, t2);

  test.done();
}

exports['parse'] = function(test) {
  var t1 = Tree.parse('[]');
  var t2 = Tree.parse('[A,B]');
  var t3 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');

  test.throws(function() {Tree.parse('A,B')});

  test.equals(t1.children.length, 1);

  test.equals(t2.children.length, 2);
  test.equals(t2.children[0].value, 'A');
  test.equals(t2.children[1].value, 'B');
  test.equals(t2.children[0].ls, null);
  test.equals(t2.children[1].rs, null);
  test.equals(t2.children[0].rs.value, 'B');
  test.equals(t2.children[1].ls.value, 'A');
  test.equals(t2.children[0].parent, t2);
  test.equals(t2.children[1].parent, t2);
  test.equals(t2.children[0].children.length, 0);
  test.equals(t2.children[1].children.length, 0);

  test.equals(t3.children.length, 3);
  test.equals(t3.children[0].children.length, 2);
  test.equals(t3.children[1].children.length, 0);
  test.equals(t3.children[2].children.length, 1);
  test.equals(t3.children[2].children[0].children.length, 1);
  test.equals(t3.children[2].children[0].children[0].children.length, 0);

  test.done();
}

exports['stringify'] = function(test) {
  var t1 = new Tree();
  test.equals(t1.stringify(), '[]');
  test.equals(Tree.parse('[A,B]').stringify(), '[A,B]');
  test.equals(Tree.parse('[A[A1,A2],B,C[C1[C11]]]').stringify(), '[A[A1,A2],B,C[C1[C11]]]');

  test.done();
}

exports['uid'] = function(test) {
  var ids = [], hexp = /[\da-fA-F]{16}/;
  for (var i=0; i<500; i++) {
    var id = Tree.uid();
    test.ok(ids.indexOf(id)===-1);
    test.ok(hexp.test(id));
    ids.push(id);
  }

  test.done();
}

exports['validate'] = function(test) {
  var t1 = new Tree();
  test.doesNotThrow(function() {t1.validate()});

  var t2 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  test.doesNotThrow(function() {t2.validate()});

  var t3 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  t3.children[2].children[0].children[0].parent = null;
  test.throws(function() {t3.validate()});

  var t3b = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  t3b.children[2].children[0].children[0].parent = t3b.children[2];
  test.throws(function() {t3b.validate()});

  var t4 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  t4.children[0].children[0].rs = null;
  test.throws(function() {t4.validate()});

  var t5 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  t5.children[0].children[1].ls = null;
  test.throws(function(){t5.validate()});

  var t6 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  t6.children[0].children = t6.children[0].children.slice(1);
  test.throws(function(){t6.validate()});

  test.done();
}

exports['insert_range'] = function(test) {
  var t0 = new Tree();
  Tree.insert_range(t0, 0, Tree.parse('[a,b]').children);
  test.equals(t0.stringify(), '[a,b]');
  test.doesNotThrow(function(){t0.validate()});

  var t1 = Tree.parse('[A,B]');
  Tree.insert_range(t1, 1, Tree.parse('[a,b,c]').children.slice(1,3));
  test.equals(t1.stringify(), '[A,b,c,B]');
  test.doesNotThrow(function(){t1.validate()});

  var t2 = Tree.parse('[A,B]');
  Tree.insert_range(t2, 1, []);
  test.equals(t2.stringify(), '[A,B]');
  test.doesNotThrow(function(){t2.validate()});

  test.done();
}

exports['remove_range'] = function(test) {
  test.doesNotThrow(function(){Tree.remove_range([])});

  var t1 = Tree.parse('[A,B,C]');
  var idx = Tree.remove_range([t1.children[1]]);
  test.equals(t1.stringify(), '[A,C]');
  test.equals(idx, 1);
  test.doesNotThrow(function(){t1.validate()});

  var t2 = Tree.parse('[A,B[a,b],C,D]');
  idx = Tree.remove_range(t2.children.slice(0,3));
  test.equals(t2.stringify(), '[D]');
  test.equals(idx, 0);
  test.doesNotThrow(function(){t2.validate()});

  test.done();
}

exports['insert'] = function(test) {
  var t0 = new Tree();
  Tree.insert(t0, 0, {value:'A'});
  test.equals(t0.stringify(), '[A]');
  test.doesNotThrow(function(){t0.validate()});

  var t1 = Tree.parse('[A,B]');
  Tree.insert(t1, 1, {value: 'AB'});
  test.equals(t1.stringify(), '[A,AB,B]');
  test.doesNotThrow(function(){t1.validate()});

  test.done();
}

exports['append'] = function(test) {
  var t0 = new Tree();
  Tree.append(t0, {value:'A'});
  test.equals(t0.stringify(), '[A]');
  test.doesNotThrow(function(){t0.validate()});

  var t1 = Tree.parse('[A[a,b],B]');
  Tree.append(t1.children[0], {value: 'c'});
  test.equals(t1.stringify(), '[A[a,b,c],B]');
  test.doesNotThrow(function(){t1.validate()});

  test.done();
}

exports['remove'] = function(test) {
  var t0 = Tree.parse('[A,B,C]');
  var idx = Tree.remove(t0.children[1]);
  test.equals(t0.stringify(), '[A,C]');
  test.doesNotThrow(function(){t0.validate()});
  test.equals(idx, 1);

  var t1 = Tree.parse('[A]');
  var idx = Tree.remove(t1.children[0]);
  test.equals(t1.stringify(), '[]');
  test.doesNotThrow(function(){t1.validate()});
  test.equals(idx, 0);

  var t2 = Tree.parse('[A,B[a,b],C]')
  var idx = Tree.remove(t2.children[1].children[1]);
  test.equals(t2.stringify(), '[A,B[a],C]');
  test.doesNotThrow(function(){t2.validate()});

  test.done();
}

exports['replace'] = function(test) {
  var t0 = Tree.parse('[A]');
  Tree.replace(t0.children[0], {value: 'B', children:[]});
  test.equals(t0.stringify(), '[B]');
  test.doesNotThrow(function(){t0.validate()});


  var t1 = Tree.parse('[A[a,b],B]');
  Tree.replace(t1.children[0], t1.children[0].children[1]);
  test.equals(t1.stringify(), '[b,B]');
  test.doesNotThrow(function(){t1.validate()});

  var t2 = Tree.parse('[A,B]');
  var t3 = Tree.parse('[C[a],D]');
  Tree.replace(t2.children[1], t3.children[0]);
  test.equals(t2.stringify(), '[A,C[a]]');
  test.equals(t3.stringify(), '[D]');
  test.doesNotThrow(function(){t2.validate()});
  test.doesNotThrow(function(){t3.validate()});

  test.done();
}

exports['switch_siblings'] = function(test) {
  var t0 = Tree.parse('[A,B,C]');
  Tree.switch_siblings(t0.children[0], t0.children[2]);
  test.equals(t0.stringify(), '[C,B,A]');
  test.doesNotThrow(function(){t0.validate()});

  var t1 = Tree.parse('[A,B,C]');
  Tree.switch_siblings(t1.children[2], t1.children[0]);
  test.equals(t1.stringify(), '[C,B,A]');
  test.doesNotThrow(function(){t1.validate()});

  var t2 = Tree.parse('[A,B,C]');
  Tree.switch_siblings(t2.children[1], t2.children[2]);
  test.equals(t2.stringify(), '[A,C,B]');
  test.doesNotThrow(function(){t2.validate()});

  var t3 = Tree.parse('[A,B,C]');
  Tree.switch_siblings(t3.children[1], t3.children[0]);
  test.equals(t3.stringify(), '[B,A,C]');
  test.doesNotThrow(function(){t3.validate()});

  var t4 = Tree.parse('[A[b]]');
  test.throws(function() {Tree.switch_siblings(t4.children[0], t4.children[0].children[0])});

  test.done();
}

exports['get_child'] = function(test){
  var t1 = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]')
  test.equals(t1.get_child([0]).value, 'A')
  test.equals(t1.get_child([1]).value, 'B')
  test.equals(t1.get_child([1, 1]).value, 'b')
  test.equals(t1.get_child([3,0,2,1]).value, '2')
  test.throws(function(){t1.get_child([4])})
  test.throws(function(){t1.get_child([1,3])})
  test.throws(function(){t1.get_child([1,0,0])})

  test.done()
}

exports['get_path'] = function(test){
  var t1 = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]')

  test.deepEqual(Tree.get_path(t1.children[0]), [0])
  test.deepEqual(Tree.get_path(t1.children[1]), [1])
  test.deepEqual(Tree.get_path(t1.children[1].children[1]), [1,1])
  test.deepEqual(Tree.get_path(t1.get_child([3,0,2,1])), [3,0,2,1])
  test.deepEqual(Tree.get_path('blubb'), []);

  test.done()
}

exports['nodes_to_range'] = function (test) {
  var t1 = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]');

  var r1 = Tree.nodes_to_range([t1.children[0]]);
  test.equals(r1.length, 1);
  test.equals(r1[0], t1.children[0]);

  var r2 = Tree.nodes_to_range([t1.children[1], t1.children[3]]);
  test.equals(r2.length, 3);
  test.equals(r2[0], t1.children[1]);
  test.equals(r2[1], t1.children[2]);
  test.equals(r2[2], t1.children[3]);

  var r3 = Tree.nodes_to_range([t1.get_child([3,0,1])
                               ,t1.get_child([3,0,2,0]
                              ,t1.get_child([3,0,2,1]))]);
  test.equals(r3.length, 2);
  test.equals(r3[0], t1.get_child([3,0,1]));
  test.equals(r3[1], t1.get_child([3,0,2]));

  var r4 = Tree.nodes_to_range([t1.get_child([1,0])
                               ,t1.get_child([3,0,2,1])]);
  test.equals(r4.length, 3);
  test.equals(r4[0], t1.children[1]);
  test.equals(r4[1], t1.children[2]);
  test.equals(r4[2], t1.children[3]);

  var r5 = Tree.nodes_to_range([t1.children[1], t1.children[1].children[0]]);
  test.equals(r5.length, 1);
  test.equals(r5[0], t1.children[1]);

  test.done();
}