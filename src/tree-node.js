import id from "./helpers/id.js";
import asArray from "./helpers/as-array.js";
import validate from "./validate.js";
import clone from "./clone.js";
import relationBetweenTrees from "./relate.js";
import oneToOneRelationBetweenTrees from "./relate-one-to-one.js";
import DepthFirstTreeIterator from "./iterator-depth-first.js";
import * as iteration from "./iteration.js";
import { stringifyTree } from "./serialization.js";

// Composite class for creating n-ary trees. Each node should have a unique id.
export default class Node {
  constructor(value = null) {
    this._children = [];
    this.parent = null;
    this.ls = null;
    this.rs = null;
    this.id = id();
    this.value = value;
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

  get position() {
    if (!this.parent) {
      return -1;
    }
    return this.parent.children.indexOf(this);
  }

  // Returns an array of numbers. Each number corresponds to a position at depth d,
  // where d is the index of that number within the array plus 1. Passing this path to
  // the getChild method of the root node of this node's tree will return this node.
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

  /// Returns the tree (root node) that a node belongs to by following the .parent references.
  get root() {
    let node = this;
    while (node.parent) node = node.parent;
    return node;
  }

  // Takes an array of numbers. Each number corresponds to a position at depth d,
  // where d is the index of that number within the array plus 1. The node that
  // resides at that path relative to this node will be returned.
  getChild(path) {
    let node = this;
    for (let i=0; i<path.length; i++) {
      if (!node.hasChildren() || node.children.length <= path[i]) return null;
      node = node.children[path[i]];
    }
    return node;
  }

  // Takes a number. The node that resides that many parent references up from
  // this node is returned.
  getAncestor(level = 0) {
    let node = this;
    for (let i=0; i<level; i++) {
      if (node.parent) node = node.parent;
      else return null;
    }
    return node;
  }

  // The returned siblings *includes* this node.
  get siblings() {
    if (!this.parent) {
      return [this];
    }
    return this.parent.children.slice();
  }

  // Inserts a node into to the children of this node.
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

  // Removes *this* node from its parent.
  remove() {
    let parent = this.parent;
    let position = unlinkChild(this);
    removeFromChildren.call(parent, position, this);
    return position;
  }

  // Replaces this node with the passed node by removing itself and inserting
  // the passed node into its old position. If the passed node was part of a tree
  // (had a parent), it will be removed before being inserted at the new
  // position. It is safe to replace a node with its child.
  // Returns the inserted node.
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

  // Inserts a proper node range into the children of this node.
  // The range must be a valid number of sibling nodes.
  insertRange(position, range) {
    if (range.length === 0) {
      return range;
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

  // Removes a range of children from *this* node's children.
  removeRange(range) {
    if (range.length === 0 || range[0].parent !== this) {
      return -1;
    }
    let position = unlinkChild(range);
    removeFromChildren.call(this, position, range);
    return position;
  }

  // Returns this node and all its descendents serialized as a string. The result
  // can be returned to a tree by using a parse tool like Tree.parse (note that
  // all values would be converted to strings). Also useful for debugging.
  stringify() {
    return stringifyTree(this);
  }

  // Returns of clone of this node and all its descendents.
  clone(keep_ids, fields_to_clone) {
    return clone(this, keep_ids, fields_to_clone);
  }

  // Returns a map representing a relationship between this node and its descendents
  // to another node and its descendents. Can be used as an input to a TreeRelation,
  // which provides an interface for interacting with the returned value.
  getRelationTo(targetNode) {
    return relationBetweenTrees(this, targetNode);
  }

  getOneToOneRelationTo(targetNode, strict) {
    return oneToOneRelationBetweenTrees(this, targetNode, strict);
  }

  get iterator() {
    return DepthFirstTreeIterator;
  }

  createIterator() {
    return new (this.iterator)(this);
  }

  forEach(fn) {
    iteration.forEach(fn, this);
  }

  map(fn) {
    return iteration.map(fn, this);
  }

  filter(selector) {
    return iteration.filter(selector, this);
  }

  filterRange(selector, noOverlap) {
    return iteration.filterRange(selector, this, noOverlap);
  }

  select(selector) {
    return iteration.select(selector, this);
  }

  getAllNodes() {
    return iteration.getAllNodes(this);
  }

  getLeafNodes() {
    return iteration.getLeafNodes(this);
  }

  filterByValue(value) {
    return iteration.filterByValue(value, this);
  }

  selectById(id) {
    return iteration.selectById(id, this);
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
