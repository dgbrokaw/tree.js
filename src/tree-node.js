import Tree from "./tree.js";
import id from "./helpers/id.js";
import asArray from "./helpers/as-array.js";
import stringify from "./stringify.js";
import validate from "./validate.js";
import clone from "./clone.js";
import mapBetweenTrees from "./map.js";
import oneToOneMapBetweenTrees from "./map-one-to-one.js";
import DepthFirstTreeIterator from "./iterator-depth-first.js";

export default class Node {
  constructor() {
    this._children = [];
    this.parent = null;
    this.ls = null;
    this.rs = null;
    this.id = id();
  }

  hasChildren() {
    return !!this._children && this._children.length > 0;
  }

  get children() {
    return this._children;
  }
  set children(nodes) {
    this._children = asArray(nodes);
  }

  /// Returns the index of the passed node in its parent node or -1 if it does not
  /// have a parent.
  get position() {
    if (!this.parent) {
      throw "[Node] Attempted to find position of node which has no parent.";
    }
    return this.parent.children.indexOf(this);
  }

  get path() {
    let path = [];
    let node = this;
    while (node.parent) {
      path.unshift(node.position);
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

  // The returned siblings *includes* this node.
  get siblings() {
    if (!this.parent) {
      throw "[Node] Attempted to get siblings of node which has no parent.";
    }
    return this.parent.children;
  }

  insert(position, child) {
    linkChildForPosition.call(this, position, child);
    addToChildren.call(this, position, child);
    return child;
  }

  append(child) {
    return this.insert(this.children.length, child);
  }

  prepend(child) {
    return this.insert(0, child);
  }

  remove() {
    let parent = this.parent;
    let position = unlinkChild(this);
    removeFromChildren.call(parent, position, this);
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
    if (!this.parent || !sibling.parent) {
      throw "[Node] Attempted to switch positions of nodes which have no parent.";
    }
    if (this.parent != sibling.parent) {
      throw "[Node] Attempted to switch positions of non-sibling nodes.";
    }
    let position = this.position;
    sibling.replaceWith(this);
    this.parent.insert(position, sibling);
    return sibling;
  }

  insertRange(position, range) {
    if (range.length === 0) {
      throw "[Node] Attempted to insert empty range into tree.";
    }
    this.insert(position, range);
    return range;
  }

  appendRange(range) {
    return this.insertRange(this.children.length, range);
  }

  prependRange(range) {
    return this.insertRange(0, range);
  }

  removeRange(range) {
    if (range.length === 0) {
      throw "[Node] Attempted to remove empty range from node's children.";
    }
    let position = unlinkChild(range);
    removeFromChildren.call(this, position, range);
    return position;
  }

  get iterator() {
    return DepthFirstTreeIterator;
  }

  createIterator() {
    return new (this.iterator)(this);
  }
}

// These two functions must be called with a "this" context.
function linkChildForPosition(position, newChild) {
  let nodes = asArray(newChild);
  linkLeftSibling(position, nodes, this.children);
  linkRightSibling(position, nodes, this.children);
  linkParent(nodes, this);
}
function addToChildren(position, child) {
  this.children = this.children.slice(0, position).concat(asArray(child), this.children.slice(position));
}
// WARNING: only use these functions before insertion has taken place.
function linkLeftSibling(position, nodes, siblings) {
  let leftSibling = siblings[position-1];
  let node = nodes[0];
  node.ls = leftSibling;
  if (leftSibling) {
    leftSibling.rs = node;
  }
}
function linkRightSibling(position, nodes, siblings) {
  let rightSibling = siblings[position];
  let node = nodes[nodes.length-1];
  node.rs = rightSibling;
  if (rightSibling) {
    rightSibling.ls = node;
  }
}
function linkParent(children, parent) {
  children.forEach(c => c.parent = parent);
}

function unlinkChild(child) {
  let nodes = asArray(child);
  let position = nodes[0].position;
  let siblings = nodes[0].siblings;
  unlinkLeftSibling(position, nodes, siblings);
  unlinkRightSibling(position, nodes, siblings);
  unlinkParent(nodes);
  return position;
}
// Must be called with a "this" context.
function removeFromChildren(position, child) {
  this.children.splice(position, asArray(child).length);
}
function unlinkLeftSibling(position, nodes, siblings) {
  let leftSibling = siblings[position-1];
  if (leftSibling) leftSibling.rs = nodes[nodes.length-1].rs;
}
function unlinkRightSibling(position, nodes, siblings) {
  let rightSibling = siblings[position+nodes.length];
  if (rightSibling) rightSibling.ls = nodes[0].ls;
}
function unlinkParent(nodes) {
  nodes.forEach(n => n.parent = null);
}

Node.prototype.stringify = function() { return stringify(this) }
Node.prototype.clone = function(keep_ids, fields_to_clone) { return clone(this, keep_ids, fields_to_clone) }
Node.prototype.get_mapping_to = function(target) { return mapBetweenTrees(this, target) }
Node.prototype.get_1to1_mapping_to = function(target, strict) { return oneToOneMapBetweenTrees(this, target, strict) }
Node.prototype.validate = function() { return validate(this) }

Node.prototype.for_each = function(f) { return Tree.for_each(f, this) }
Node.prototype.map = function(f) { return Tree.map(f, this) }
Node.prototype.filter = function(f) { return Tree.filter(f, this) }
Node.prototype.filterRange = function(f, no_overlap) { return Tree.filterRange(f, this, no_overlap) }
Node.prototype.select_all = function() { return Tree.select_all(this) }
Node.prototype.select_first = function(f) { return Tree.select_first(f, this) }
Node.prototype.get_leaf_nodes = function() { return Tree.get_leaf_nodes(this) }
Node.prototype.get_by_value = function(value) { return Tree.get_by_value(value, this) }
Node.prototype.get_by_id = function(id) { return Tree.get_by_id(id, this) }
