var Tree = require('./tree.js').Tree;

/// To get all static methods of the Tree object as instance methods on your
/// object, you can make it inherit from the "Tree.Node" class (use
/// `new Tree.Node()` as the prototype).
var Node = function() {
  this.children = [];
  this.parent = null;
  this.ls = null;
  this.rs = null;
  this.id = Tree.uid();
}

Node.prototype.stringify = function() { return Tree.stringify(this) }
Node.prototype.clone = function(keep_ids, fields_to_clone) { return Tree.clone(this, keep_ids, fields_to_clone) }
Node.prototype.get_mapping_to = function(target) { return Tree.get_mapping_between(this, target) }
Node.prototype.get_1to1_mapping_to = function(target, strict) { return Tree.get_1to1_mapping_between(this, target, strict) }
Node.prototype.insert = function(idx, node) { return Tree.insert(this, idx, node) }
Node.prototype.insert_range = function(idx, nodes) { return Tree.insert_range(this, idx, nodes) }
Node.prototype.append_range = function(nodes) { return Tree.append_range(this, nodes) }
Node.prototype.append = function(node) { return Tree.append(this, node) }
Node.prototype.remove = function() { return Tree.remove(this) }
Node.prototype.remove_range = function(nodes) { return Tree.remove_range(nodes) }
Node.prototype.replace_with = function(other) { return Tree.replace(this, other) }
Node.prototype.switch_with_sibling = function(other) { return Tree.switch_siblings(this, other) }
Node.prototype.validate = function() { return Tree.validate(this) }
Node.prototype.get_child = function(path) { return Tree.get_child(path, this) }
Node.prototype.get_parent = function(level) { return Tree.get_parent(level, this) }
Node.prototype.get_path = function() { return Tree.get_path(this) }
Node.prototype.for_each = function(f) { return Tree.for_each(f, this) }
Node.prototype.map = function(f) { return Tree.map(f, this) }
Node.prototype.filter = function(f) { return Tree.filter(f, this) }
Node.prototype.filterRange = function(f, no_overlap) { return Tree.filterRange(f, this, no_overlap) }
Node.prototype.select_all = function() { return Tree.select_all(this) }
Node.prototype.select_first = function(f) { return Tree.select_first(f, this) }
Node.prototype.get_leaf_nodes = function() { return Tree.get_leaf_nodes(this) }
Node.prototype.is_root = function() { return Tree.is_root(this) }
Node.prototype.get_root = function() { return Tree.get_root(this) }
Node.prototype.get_by_value = function(value) { return Tree.get_by_value(value, this) }
Node.prototype.get_by_id = function(id) { return Tree.get_by_id(id, this) }
Node.prototype.has_children = function() { return this.children && this.children.length > 0 }
Node.prototype.get_idx = function() { return Tree.get_idx(this) }

/// This line is for the automated tests with node.js
if (typeof(exports) != 'undefined') {
  exports.Node = Node;
}