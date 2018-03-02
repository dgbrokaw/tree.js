var Tree = require('./tree.js').Tree;
Tree.Node = require('./tree-node.js').Node;

/// This line is for the automated tests with node.js
if (typeof(exports) != 'undefined') {
  exports.Tree = Tree;
}
