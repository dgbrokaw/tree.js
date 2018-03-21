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
    let result = this.result;

    let f = function(node) {
      if (!test || test(node)) {
        if (!process) {
          result.push(node);
        }
        else {
          let nodeResult = process(node);
          if (nodeResult !== undefined) result.push(nodeResult);
        }
      }
      if (node.hasChildren()) {
        for (let i=0; i<node.children.length; i++) {
          f(node.children[i]);
        }
      }
    }

    for (let i=0; i<this.trees.length; i++) {
      f(this.trees[i]);
    }

    return this.result;
  }

  // Traverses the tree until it finds a node that passes the selector and then
  // returns that node. The result member of the iterator will be empty or
  // contain only one item after running this.
  select(selector) {
    this.start();

    let f = function(node) {
      let curr = node;
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

    for (let i=0; i<this.trees.length; i++) {
      let node = f(this.trees[i]);
      if (node) {
        this.result = [node];
        return node;
      }
    }

    return null;
  }

  traverseRange(process, test, noOverlap) {
    this.start();
    let result = this.result;

    let f = function(nodes, idx) {
      let range = [], n = nodes[idx];
      for (let i=idx; i<nodes.length; i++) {
        range.push(nodes[i]);
        if (!test || test(range)) {
          if (!process) {
            result.push(range.slice());
          }
          else {
            let rangeResult = process(range);
            if (rangeResult !== undefined) result.push(rangeResult);
          }
          if (noOverlap) {
            return i-idx;
          }
        }
      }
      if (n.hasChildren()) {
        for (let i=0; i<n.children.length; i++) i += f(n.children, i);
      }
      return 0;
    }

    for (let i=0; i<this.trees.length; i++) {
      i += f(this.trees, i);
    }

    return this.result;
  }
}
