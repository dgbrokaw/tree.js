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

  /// Returns the index of the passed node in its parent node or -1 if it does not
  /// have a parent.
  get position() {
    if (this.parent) return this.parent.children.indexOf(this);
    else return -1;
  }

  get path() {
    let path = [];
    let node = this;
    while (node.parent) {
      path.unshift(node.parent.children.indexOf(node));
      node = node.parent;
    }
    return path;
  }

  isRoot() {
    return !this.parent;
  }

  /// Returns the tree that a node belongs to by following the .parent references. Returns
  /// null if the top-most parent is not a Tree.
  get root() {
    let node = this;
    while (node.parent) node = node.parent;
    return node;
  }

  getChild(path) {
    let node = this;
    for (let i=0; i<path.length; i++) {
      if (!node.children || node.children.length <= path[i]) return null;
      node = node.children[path[i]];
    }
    return node;
  }

  getAncestor(level) {
    let node = this;
    if (!level) level = 0;
    for (let i=0; i<level; i++) {
      if (node.parent) node = node.parent;
      else return null;
    }
    return node;
  }

  insert(position, child) {
    child.ls = this.children[position-1];
    if (this.children[position-1]) this.children[position-1].rs = child;
    child.rs = this.children[position];
    if (this.children[position]) this.children[position].ls = child;
    child.parent = this;
    this.children.splice(position, 0, child);
    return child;
  }

  append(child) {
    return this.insert(this.children.length, child);
  }

  prepend(child) {
    return this.insert(0, child);
  }

  remove() {
    let position;
    let siblings = this.parent.children;
    position = siblings.indexOf(this);
    if (siblings[position-1]) siblings[position-1].rs = this.rs;
    if (siblings[position+1]) siblings[position+1].ls = this.ls;
    siblings.splice(position,1);
    this.parent = null;
    return position;
  }

  /// Replaces this node with the passed node by removing itself and inserting
  // the passed node its old position. If the passed node was part of a tree
  // (had a parent), it will be removed before being inserted at the new
  // position. It is safe to replace a node with its child.
  /// Returns the inserted node.
  replaceWith(node) {
    if (this === node) {
      return this;
    }
    if (!node.isRoot()) {
      node.remove();
    }
    let parent = this.parent
      , position = this.remove();
    return parent.insert(position, node);
  }

  switchWithSibling(sibling) {
    if (this.parent != sibling.parent) {
      throw "[Node] Attempted to switch positions of non-sibling nodes.";
    }
    let position = this.position;
    sibling.replaceWith(this);
    this.parent.insert(position, sibling);
    return sibling;
  }
}

Node.prototype.stringify = function() { return stringify(this) }
Node.prototype.clone = function(keep_ids, fields_to_clone) { return clone(this, keep_ids, fields_to_clone) }
Node.prototype.get_mapping_to = function(target) { return mapBetweenTrees(this, target) }
Node.prototype.get_1to1_mapping_to = function(target, strict) { return oneToOneMapBetweenTrees(this, target, strict) }
Node.prototype.validate = function() { return validate(this) }

Node.prototype.insert_range = function(position, nodes) { return Tree.insert_range(this, position, nodes) }
Node.prototype.append_range = function(nodes) { return Tree.append_range(this, nodes) }
Node.prototype.remove_range = function(nodes) { return Tree.remove_range(nodes) }
Node.prototype.for_each = function(f) { return Tree.for_each(f, this) }
Node.prototype.map = function(f) { return Tree.map(f, this) }
Node.prototype.filter = function(f) { return Tree.filter(f, this) }
Node.prototype.filterRange = function(f, no_overlap) { return Tree.filterRange(f, this, no_overlap) }
Node.prototype.select_all = function() { return Tree.select_all(this) }
Node.prototype.select_first = function(f) { return Tree.select_first(f, this) }
Node.prototype.get_leaf_nodes = function() { return Tree.get_leaf_nodes(this) }
Node.prototype.get_by_value = function(value) { return Tree.get_by_value(value, this) }
Node.prototype.get_by_id = function(id) { return Tree.get_by_id(id, this) }
Node.prototype.has_children = function() { return this.children && this.children.length > 0 }
