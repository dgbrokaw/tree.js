var TreeBuilder = require("../dist/index.js").TreeBuilder;
var Node = require("../dist/index.js").Node;

exports["TreeBuilder: constructor"] = function(test) {
  var builder = new TreeBuilder();
  test.strictEqual(builder._top, null);
  test.strictEqual(builder._current, null);
  test.done();
}

exports["TreeBuilder: createNode"] = function(test) {
  var builder = new TreeBuilder();
  test.ok(builder.createNode() instanceof Node);
  test.done();
}

exports["TreeBuilder: current getter/setter"] = function(test) {
  var builder = new TreeBuilder();
  test.strictEqual(builder.current, null);

  builder.current = builder.createNode();
  test.ok(builder.current instanceof Node);
  test.equal(typeof(builder.current.value), "string");
  test.equal(builder.current.value, "");

  test.done();
}

exports["TreeBuilder: start"] = function(test) {
  var builder = new TreeBuilder();

  builder.start();
  test.ok(builder._top instanceof Node);
  test.ok(builder._current instanceof Node);
  test.strictEqual(builder._current.value, undefined);

  test.done();
}

exports["TreeBuilder: createChild"] = function(test) {
   var builder = new TreeBuilder();
   builder.start();

   builder.createChild();
   test.ok(builder.current);
   test.equal(builder.current.value, "");
   test.equal(builder.current.parent, builder._top);

   test.done();
 }

 exports["TreeBuilder: siblings"] = function(test) {
   var builder = new TreeBuilder();
   builder.start();

   test.throws(function() { builder.createSibling() });

   builder.createChild();
   builder.createSibling();
   test.equal(builder._top.children.length, 2);
   test.ok(builder.current);
   test.equal(builder.current.value, "");

   builder.createChild();
   test.equal(builder._top.children.length, 2);
   test.equal(builder.current.parent.children.length, 1);
   test.ok(builder.current.parent.ls);

   test.ok(!builder.current.ls);
   builder.finishSiblings();
   test.ok(builder.current.ls);
   test.equal(builder.current.parent, builder._top);
   test.equal(builder.current.children.length, 1);

   test.throws(function() { builder.finishSiblings() });

   test.done();
 }

 exports["TreeBuilder: setValue"] = function(test) {
   var builder = new TreeBuilder();
   builder.start();

   test.throws(function() { builder.setValue() });

   builder.createChild();
   builder.setValue("hiii");
   test.equal(builder.current.value, "hiii");
   builder.setValue("!!");
   test.equal(builder.current.value, "hiii!!");

   test.done();
 }

 exports["TreeBuilder: getResult"] = function(test) {
   var builder = new TreeBuilder();
   builder.start();

   test.ok(Array.isArray(builder.getResult()));

   builder.createChild();
   test.ok(builder.getResult() instanceof Node);

   builder.start();
   builder.createChild();
   builder.createSibling();
   test.ok(Array.isArray(builder.getResult()));
   test.equals(builder.getResult().length, 2);

   test.done();
 }
