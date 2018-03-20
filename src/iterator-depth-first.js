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

  traverse(process, test) {
    this.start();
    var result = this.result;

    var f = function(node) {
      if (!test || test(node)) {
        result.push(process(node));
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
}
