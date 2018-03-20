import asArray from "./helpers/as-array.js";

export default class DepthFirstTreeIterator {
  constructor(trees) {
    this.trees = asArray(trees);
    this.result = null;
  }

  isDone() {
    return Array.isArray(this.result);
  }

  start() {
    this.result = [];
    return this;
  }

  // Both arguments are optional.
  // "Process" takes a tree node and returns a value. If not given, the traversed
  // node itself will be the result.
  // "Test" takes a tree node and returns a boolean. If not given, all nodes
  // pass and are used/processed for the result.
  // Processed nodes that result in "undefined" are excluded from the result.
  traverse(process, test) {
    this.start();
    var result = this.result;

    var f = function(node) {
      if (!test || test(node)) {
        if (!process) {
          result.push(node);
        }
        else {
          var nodeResult = process(node);
          if (nodeResult !== undefined) result.push(process(node));
        }
      }
      if (node.hasChildren()) {
        for (var i=0; i<node.children.length; i++) {
          f(node.children[i]);
        }
      }
    }

    for (var i=0; i<this.trees.length; i++) {
      f(this.trees[i]);
    }

    return this.result;
  }

  // Traverses the tree until it finds a node that passes the selector and then
  // returns that node. The result member of the iterator will be empty or
  // contain only one item after running this.
  select(selector) {
    this.start();

    var f = function(node) {
      var curr = node;
      for (;;) {
        if (selector(curr)) return curr;
        if (curr.children && curr.children[0]) {
          curr = curr.children[0];
          continue;
        }
        if (curr === node) return null;
        while (!curr.rs) {
          curr = curr.parent;
          if (curr === node) return null;
        }
        curr = curr.rs;
      }
    }

    for (var i=0; i<this.trees.length; i++) {
      var node = f(this.trees[i]);
      if (node) {
        this.result = [node];
        return node;
      }
    }

    return null;
  }
}
