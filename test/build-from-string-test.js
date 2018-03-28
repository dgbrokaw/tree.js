var StringParseDirector = require("../dist/index.js").StringParseDirector;
var TreeBuilder = require("../dist/index.js").TreeBuilder;

exports["StringParseDirector: constructor"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);
  test.ok(director.builder);
  test.done();
}

exports["StringParseDirector: construct"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);

  var t0 = director.construct('');
  var t01 = director.construct('A');
  var t02 = director.construct('A,B');
  var t1 = director.construct('[,]');
  var t2 = director.construct('[A,B]');
  var t3 = director.construct('[A[A1,A2],B,C[C1[C11]]]');

  test.equals(t0.children.length, 0);
  test.equals(t01.children.length, 0);
  test.equals(t01.value, 'A');
  test.equals(t02.length, 2);
  test.equals(t02[0].value, 'A');
  test.equals(t02[0].rs.value, 'B');
  test.equals(t02[0].parent, undefined);
  test.equals(t02[1].value, 'B');
  test.equals(t02[1].ls.value, 'A');
  test.equals(t02[1].parent, undefined);

  test.equals(t1.value, '');
  test.equals(t1.children.length, 2);
  test.equals(t1.children[0].value, '');
  test.equals(t1.children[1].value, '');

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
