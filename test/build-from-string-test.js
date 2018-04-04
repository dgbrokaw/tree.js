var StringParseDirector = require("../dist/index.js").StringParseDirector;
var TreeBuilder = require("../dist/index.js").TreeBuilder;
var Node = require("../dist/index.js").Node;

exports["StringParseDirector: constructor"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);
  test.ok(director.builder);
  test.done();
}

exports["StringParseDirector: create trees with construct"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);

  var t0 = director.construct();
  test.ok(t0 instanceof Node);
  test.strictEqual(t0.value, "");

  test.done();
}

exports["StringParseDirector: empty string input"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);

  var t0 = director.construct("");
  test.strictEqual(t0.value, "");

  test.done();
}

exports["StringParseDirector: setting values"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);

  var t0 = director.construct("A");
  test.strictEqual(t0.value, "A");

  test.done();
}

exports["StringParseDirector: creating children"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);

  var t0 = director.construct("[]");
  test.ok(t0.hasChildren());
  test.equal(t0.children.length, 1);
  test.equal(t0.getChild([0]).value, "");

  test.done();
}

exports["StringParseDirector: root w/ value, 1 child"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);

  var t0 = director.construct("A[]");
  test.equal(t0.value, "A");
  test.ok(t0.hasChildren());
  test.equal(t0.children.length, 1);
  test.equal(t0.getChild([0]).value, "");

  test.done();
}

exports["StringParseDirector: creating siblings"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);

  var t0 = director.construct("[,]");
  test.ok(t0.hasChildren());
  test.equal(t0.children.length, 2);
  test.strictEqual(t0.getChild([0]).rs, t0.getChild([1]));

  test.done();
}

exports["StringParseDirector: sibling w/ values"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);

  var t0 = director.construct("[a,b]");
  test.equal(t0.getChild([0]).value, "a");
  test.equal(t0.getChild([1]).value, "b");

  test.done();
}

exports["StringParseDirector: larger tree"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);

  var t0 = director.construct("A[b[c],d[e[f]]]");
  test.equal(t0.getChild([1,0,0]).value, "f");

  test.done();
}

exports["StringParseDirector: no siblings at top level"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);

  var t0;
  test.throws(function() { t0 = director.construct(",") });
  test.throws(function() { t0 = director.construct("A,") });
  test.throws(function() { t0 = director.construct("A,B") });

  test.done();
}

exports["StringParseDirector: closing bracket optional in some cases"] = function(test) {
  var builder = new TreeBuilder();
  var director = new StringParseDirector(builder);

  test.doesNotThrow(function() { director.construct("[") });
  test.doesNotThrow(function() { director.construct("[,") });
  test.doesNotThrow(function() { director.construct("A[B,C") });

  test.done();
}
