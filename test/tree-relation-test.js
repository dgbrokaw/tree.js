var TreeRelation = require("../dist/index.js").TreeRelation;
var Tree = require("../dist/index.js").Tree;

exports["TreeRelation: constructor"] = function(test) {
  var rel = new TreeRelation();
  test.ok(rel.toString() === "");
  test.done();
}

exports["TreeRelation: init"] = function(test) {
  var rel = new TreeRelation();
  var t1 = Tree.parse("O");
  var t2 = Tree.parse("X");

  rel.init(t1, t2);
  test.ok(rel.relation[t1.id][0] === t2);

  var rel2 = new TreeRelation(t1, t2);
  test.ok(rel2.relation[t1.id][0] === t2);

  test.done()
}

exports["TreeRelation: relate & relateOne"] = function(test) {
  var t1 = Tree.parse("O");
  var t2 = Tree.parse("X[B]");
  var rel = new TreeRelation(t1, t2);

  test.ok(rel.relate(t1).length === 2);
  test.equals(rel.relate(t1)[0], t2);
  test.equals(rel.relateOne(t1), t2);
  test.equals(rel.relate(t1)[1], t2.getChild([0]));

  test.done();
}

exports["TreeRelation: update"] = function(test) {
  var t1 = Tree.parse("O[A]");
  var t2 = Tree.parse("X[B]");
  var rel = new TreeRelation(t1, t2);

  var t3 = Tree.parse("Y[C]");
  rel.update(t1, t3);

  test.ok(rel.relate(t1).length === 1)
  test.equals(rel.relateOne(t1), t3);
  test.equals(rel.relateOne(t1.getChild([0])), t2.getChild([0]));

  test.done();
}
