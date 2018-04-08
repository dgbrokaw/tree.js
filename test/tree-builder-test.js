var TreeBuilder = require("../dist/tree.cjs.js").TreeBuilder;
var Node = require("../dist/tree.cjs.js").Node;

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
  test.strictEqual(builder._current, builder._top);
  test.strictEqual(builder._current.value, "");

  test.done();
}

exports["TreeBuilder: setValue"] = function(test) {
  var builder = new TreeBuilder();
  builder.start();

  builder.setValue("hiii");
  test.equal(builder.current.value, "hiii");
  builder.setValue("!!");
  test.equal(builder.current.value, "hiii!!");

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
   builder.createChild();

   builder.createSibling();
   test.equal(builder._top.children.length, 2);
   test.strictEqual(builder._top.children[1].ls, builder._top.children[0]);

   test.ok(builder.current);
   test.equal(builder.current.value, "");

   test.done();
 }

 exports["TreeBuilder: can't create sibling without first creating a child"] = function(test) {
   var builder = new TreeBuilder();
   builder.start();
   test.throws(function() { builder.createSibling() });
   test.done();
 }

 exports["TreeBuilder: move to the parent"] = function(test) {
   var builder = new TreeBuilder();

   builder.start();
   builder.setValue("A");
   builder.createChild();
   builder.finishSiblings();
   builder.setValue("B");

   test.equal(builder._top.value, "AB");
   test.strictEqual(builder._current, builder._top);
   test.equal(builder._top.children.length, 1);

   test.done();
 }

 exports["TreeBuilder: prevent moving higher than the top node"] = function(test) {
   var builder = new TreeBuilder();
   builder.start();
   test.throws(function() { builder.finishSiblings() });
   test.done();
 }

 exports["TreeBuilder: getResult"] = function(test) {
   var builder = new TreeBuilder();

   test.strictEqual(builder.getResult(), null);

   builder.start();
   test.strictEqual(builder.getResult(), builder._top);

   test.done();
 }
