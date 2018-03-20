import Tree from "./tree.js";
import id from "./helpers/id.js";
import stringify from "./stringify.js";
import validate from "./validate.js";
import clone from "./clone.js";
import mapBetweenTrees from "./map.js";
import oneToOneMapBetweenTrees from "./map-one-to-one.js";

/// To get all static methods of the Tree object as instance methods on your
/// object, you can make it inherit from the "Tree.Node" class (use
/// `new Tree.Node()` as the prototype).
export default class Node {
  constructor() {
    this.children = [];
    this.parent = null;
    this.ls = null;
    this.rs = null;
    this.id = id();
  }

  getChild(path) {
    let node = this;
    for (var i=0; i<path.length; i++) {
      if (!node.children || node.children.length <= path[i]) return null;
      node = node.children[path[i]];
    }
    return node;
  }

  insert(idx, child) {
    child.ls = this.children[idx-1];
    if (this.children[idx-1]) this.children[idx-1].rs = child;
    child.rs = this.children[idx];
    if (this.children[idx]) this.children[idx].ls = child;
    child.parent = this;
    this.children.splice(idx, 0, child);
    return child;
  }

  append(child) {
    return this.insert(this.children.length, child);
  }

  prepend(child) {
    return this.insert(0, child);
  }

  remove() {
    var idx;
    var siblings = this.parent.children;
    idx = siblings.indexOf(this);
    if (siblings[idx-1]) siblings[idx-1].rs = this.rs;
    if (siblings[idx+1]) siblings[idx+1].ls = this.ls;
    siblings.splice(idx,1);
    this.parent = null;
    return idx;
  }
}

Node.prototype.stringify = function() { return stringify(this) }
Node.prototype.clone = function(keep_ids, fields_to_clone) { return clone(this, keep_ids, fields_to_clone) }
Node.prototype.get_mapping_to = function(target) { return mapBetweenTrees(this, target) }
Node.prototype.get_1to1_mapping_to = function(target, strict) { return oneToOneMapBetweenTrees(this, target, strict) }
Node.prototype.validate = function() { return validate(this) }

Node.prototype.insert_range = function(idx, nodes) { return Tree.insert_range(this, idx, nodes) }
Node.prototype.append_range = function(nodes) { return Tree.append_range(this, nodes) }
Node.prototype.remove_range = function(nodes) { return Tree.remove_range(nodes) }
Node.prototype.replace_with = function(other) { return Tree.replace(this, other) }
Node.prototype.switch_with_sibling = function(other) { return Tree.switch_siblings(this, other) }
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
