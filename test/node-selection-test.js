var NodeSelection = require("../dist/index.js").NodeSelection;
var Tree = require("../dist/index.js").Tree;

exports["NodeSelection: constructor"] = function(test) {
  var sel = new NodeSelection();
  test.ok(Array.isArray(sel._selection) && sel._selection.length === 0);
  test.done();
}

exports["NodeSelection: selection getter"] = function(test) {
  var sel = new NodeSelection();
  test.ok(sel._selection === sel.selection);
  test.done();
}

exports["NodeSelection: selection setter"] = function(test) {
  var sel = new NodeSelection();
  sel.selection = "x";
  test.ok(Array.isArray(sel.selection) && sel.selection[0] == "x");
  test.done();
}

exports["NodeSelection: selection get/set shorthands"] = function(test) {
    var sel = new NodeSelection();
    sel.sel = ["x", "y"];
    test.ok(Array.isArray(sel.sel) && sel.sel.length === 2);
    test.done();
}

exports["NodeSelection: closest common ancestor"] = function(test) {
  var t1 = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]');
  var a = Tree.get_child([1,0], t1);
  var b = Tree.get_child([1,1], t1);
  var B = Tree.get_child([1], t1);
  var j = Tree.get_child([3,0], t1);
  var x = Tree.get_child([3,0,0], t1);
  var _2 = Tree.get_child([3,0,2,1], t1);

  var sel1 = new NodeSelection([a]);
  var sel2 = new NodeSelection([a,b]);
  var sel3 = new NodeSelection([x,_2]);
  var sel4 = new NodeSelection([b,_2]);

  test.equals(sel1.cca, B);
  test.equals(sel2.cca, B);
  test.equals(sel3.cca, j);
  test.equals(sel4.cca, t1);

  sel1.toCCA();
  test.equals(sel1.sel[0], B);

  test.done();
}

exports["NodeSelection: ranges"] = function(test) {
  var t1 = Tree.parse('[A,B[a,b],C,D[j[x,y,z[1,2]]]]');

  var sel1 = new NodeSelection([t1.children[0]]);
  var r1 = sel1.range;
  test.equals(r1.length, 1);
  test.equals(r1[0], t1.children[0]);

  var sel2 = new NodeSelection([t1.children[1], t1.children[3]]);
  var r2 = sel2.range;
  test.equals(r2.length, 3);
  test.equals(r2[0], t1.children[1]);
  test.equals(r2[1], t1.children[2]);
  test.equals(r2[2], t1.children[3]);

  var r3 = Tree.nodes_to_range([Tree.get_child([3,0,1],t1)
                               ,Tree.get_child([3,0,2,0],t1)
                               ,Tree.get_child([3,0,2,1],t1)]);
  test.equals(r3.length, 2);
  test.equals(r3[0], Tree.get_child([3,0,1],t1));
  test.equals(r3[1], Tree.get_child([3,0,2],t1));

  var r4 = Tree.nodes_to_range([Tree.get_child([1,0],t1)
                               ,Tree.get_child([3,0,2,1],t1)]);
  test.equals(r4.length, 3);
  test.equals(r4[0], t1.children[1]);
  test.equals(r4[1], t1.children[2]);
  test.equals(r4[2], t1.children[3]);

  var r5 = Tree.nodes_to_range([t1.children[1], t1.children[1].children[0]]);
  test.equals(r5.length, 1);
  test.equals(r5[0], t1.children[1]);

  var t2 = Tree.parse('[A[a,b,c,d]]');
  var r6 = Tree.nodes_to_range([t2.get_child([0,0]), t2.get_child([0,2])]);
  test.equals(r6.length, 3);

  var t3 = Tree.parse('[a,b,c,d,e,f]');
  var r7 = Tree.nodes_to_range([t3.children[4], t3.children[5]]);
  test.equals(r7.length, 2);
  test.equals(r7[0].value, 'e');
  test.equals(r7[1].value, 'f');

  test.done();
}