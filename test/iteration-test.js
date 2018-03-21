var Tree = require("../dist/index.js").Tree;

exports["Iteration: forEach"] = function(test) {
  var t0 = Tree.parse('');
  var res = [];
  Tree.for_each(function (n) { res.push(n.value) }, t0.children);
  test.equals(res.length, 0);

  var t1 = Tree.parse('A,B');
  res = [];
  Tree.for_each(function (n) { res.push(n.value) }, t1);
  test.deepEqual(res, ['A','B']);

  var t2 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  res = [];
  Tree.for_each(function (n) { res.push(n.value) }, t2.children);
  test.deepEqual(res, ['A','A1','A2','B','C','C1','C11']);
  res = [];
  Tree.for_each(function (n) { res.push(n.value) }, t2.children[0]);
  test.deepEqual(res, ['A','A1','A2']);

  test.done();
}

exports["Iteration: map"] = function(test) {
  var f = function(node) { return node.value };

  var t0 = Tree.parse('');
  var res = Tree.map(f, t0.children);
  test.equals(res.length, 0);

  var t1 = Tree.parse('A,B');
  res = Tree.map(f, t1);
  test.deepEqual(res, ['A','B']);

  var t2 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  res = Tree.map(f, t2.children);
  test.deepEqual(res, ['A','A1','A2','B','C','C1','C11']);
  res = Tree.map(f, t2.children[0]);
  test.deepEqual(res, ['A','A1','A2']);

  test.done();
}

exports["Iteration: filter"] = function(test) {
  var true_fn = function() {return true};
  var t0 = Tree.parse('');
  var res = Tree.filter(true_fn, t0.children);
  test.equals(res.length, 0);

  var t1 = Tree.parse('A,B');
  res = Tree.filter(true_fn, t1);
  res = res.map(function (n) { return n.value });
  test.deepEqual(res, ['A','B']);

  var t2 = Tree.parse('[A[A1,A2],BB,C[C1[C11]]]');
  res = Tree.filter(function (n) { return n.value.length == 1 }, t2.children);
  res = res.map(function (n) { return n.value });
  test.deepEqual(res, ['A','C']);
  res = Tree.filter(function (n) { return n.value.length == 2 }, t2.children[0]);
  res = res.map(function (n) { return n.value });
  test.deepEqual(res, ['A1','A2']);

  test.done();
}

exports['Iteration: select'] = function(test) {
  var true_fn = function() {return true};
  var false_fn = function() {return false};
  var t0 = Tree.parse('');
  var res = Tree.select_first(true_fn, t0.children);
  test.equals(res, null);

  var t1 = Tree.parse('A,B');
  res = Tree.select_first(true_fn, t1);
  test.equals(res, t1[0]);

  var t1b = Tree.parse('[B,C]');
  res = t1b.select_first(function (n) { return n.value });
  test.equals(res, t1b.children[0]);

  var t2 = Tree.parse('[A]');
  res = Tree.select_first(false_fn, t2.children[0]);
  test.equals(res, null);

  var t3 = Tree.parse('[A[A1,A2],BB,C[C1[C11]]]');
  res = Tree.select_first(function (n) { return n.value.length == 3 }, t3.children);
  test.equals(res, t3.children[2].children[0].children[0]);
  res = Tree.select_first(false_fn, t3.children[0]);
  test.equals(res, null);

  test.done();
}

exports["Iteration: filterRange"] = function(test) {
  var true_fn = function() {return true};
  var ranges_to_arr = function(ranges) {
    return ranges.map(function (range) {
      return range.map(function(n) { return n.value }).join('')
    });
  }
  var t0 = Tree.parse('');
  var res = Tree.filterRange(true_fn, t0.children);
  test.equals(res.length, 0);

  var t1 = Tree.parse('A,B,C');
  res = Tree.filterRange(true_fn, t1);
  res = ranges_to_arr(res);
  test.deepEqual(res, ['A', 'AB', 'ABC', 'B', 'BC', 'C']);

  var t2 = Tree.parse('[A[a,b],B,C[x[y]]]');
  res = Tree.filterRange(function (ns) { return ns.length == 2 }, t2.children);
  res = ranges_to_arr(res);
  test.deepEqual(res, ['AB', 'ab', 'BC']);
  res = Tree.filterRange(function (ns) { return ns[0].value == 'x' }, t2.children);
  res = ranges_to_arr(res);
  test.deepEqual(res, ['x']);
  res = Tree.filterRange(function () { return false }, t2.children);
  test.deepEqual(res, []);

  var t3 = Tree.parse('[a[b,c],d,e,f]');
  res = Tree.filterRange(function (ns) { return ns.length == 2 }, t3.children, false);
  res = ranges_to_arr(res);
  test.deepEqual(res, ['ad', 'bc', 'de', 'ef']);
  var res_no_overlap = Tree.filterRange(function (ns) { return ns.length == 2 }, t3.children, true);
  res_no_overlap = ranges_to_arr(res_no_overlap);
  test.deepEqual(res_no_overlap, ['ad', 'ef']);

  test.done();
}

exports["Iteration: getAllNodes"] = function(test) {
  var t0 = Tree.parse('');
  var res = Tree.select_all(t0.children);
  test.equals(res.length, 0);

  var t1 = Tree.parse('[A[A1,A2],B,C[C1[C11]]]');
  res = Tree.select_all(t1.children);
  res = res.map(function (n) { return n.value }).join(' ');
  test.deepEqual(res, 'A A1 A2 B C C1 C11');

  var t1b = Tree.parse('X[A[A1,A2],B,C[C1[C11]]]');
  res = t1b.select_all();
  res = res.map(function (n) { return n.value }).join(' ');
  test.deepEqual(res, 'X A A1 A2 B C C1 C11');

  test.done();
}

exports['Iteration: getLeafNodes'] = function(test){
  var t1 = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]')
  var t2 = Tree.parse('[A,B,C]')
  var t3 = Tree.parse('[]')
  var f = function (n) { return n.value }
  test.deepEqual(Tree.get_leaf_nodes(t1).map(f), ['A', 'a', 'b', 'C', 'x', 'y', '1', '2'])
  test.deepEqual(Tree.get_leaf_nodes(t2).map(f), ['A', 'B', 'C'])
  test.deepEqual(t2.get_leaf_nodes().map(f), ['A', 'B', 'C'])
  test.deepEqual(Tree.get_leaf_nodes(t3).map(f), [''])
  test.done()
}

exports['Iteration: filterByValue'] = function(test) {
  var t1 = Tree.parse('[A,B[B,b],B,C[C[x,y,z[1,2]]]]')

  var r0 = Tree.get_by_value('A', t1.children);
  test.equals(r0.length, 1);
  test.equals(r0[0], t1.children[0]);

  var r1 = Tree.get_by_value('B', t1.children);
  test.equals(r1.length, 3);
  test.equals(r1[0], t1.children[1]);
  test.equals(r1[1], t1.children[1].children[0]);
  test.equals(r1[2], t1.children[2]);

  var r1b = t1.get_by_value('B');
  test.equals(r1b.length, 3);
  test.equals(r1b[0], t1.children[1]);
  test.equals(r1b[1], t1.children[1].children[0]);
  test.equals(r1b[2], t1.children[2]);

  var r2 = Tree.get_by_value('ab', t1.children);
  test.equals(r2.length, 0);

  var r3 = Tree.get_by_value('', t1.children);
  test.equals(r3.length, 0);

  test.done()
}

exports['Iteration: selectById'] = function(test) {
  var t1 = Tree.parse('[A,B[a,b],C');
  Tree.for_each(function (n) { n.id = '#'+n.value }, t1);

  test.equals(Tree.get_by_id('#B', t1), t1.children[1]);
  test.equals(Tree.get_by_id('#b', t1), t1.children[1].children[1]);
  test.equals(t1.get_by_id('#b'), t1.children[1].children[1]);
  test.equals(Tree.get_by_id('D', t1), null);

  test.done()
}
