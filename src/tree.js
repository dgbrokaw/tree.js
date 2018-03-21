// Copyright Erik Weitnauer 2012-2015.

/** This is an implementation of fully linked nary-trees. Each non-leaf node has an array
of its children `children`, a reference to its left sibling `ls`, a reference to its right
sibling `rs` and a reference to its parent `parent`.
The Tree object is a collection of methods to handle tree structures, its not instanciated
itself. Instead, each object can be a tree node.

Most of the methods can accept both a single node or an array of nodes to work on.
*/
import Node from "./tree-node.js";
import NodeSelection from "./node-selection.js";
import DepthFirstTreeIterator from "./iterator-depth-first.js";
import * as iteration from "./iteration.js";

var Tree = { version: '1.3.7' };

export default Tree;

/// Returns the smallest range of nodes (continuous, ordered neighbors) covering the passed
/// nodes. The method first gets the closest common ancestor and then selects a range of its
/// children that contains all the passed nodes.
Tree.nodes_to_range = function(nodes) {
  return (new NodeSelection(nodes)).range;
}

/// Inserts a node into the tree as the child at position 'idx' of 'parent'. Returns the inserted
/// node.
Tree.insert = function(parent, idx, child) {
  return parent.insert(idx, child);
}

/// Inserts a range of nodes at the position `idx` into the children array
/// of the node `parent`. The `nodes` array must contain a list of direct
/// siblings ordered from left to right.
Tree.insert_range = function(parent, idx, nodes) {
  if (nodes.length === 0) return;
  parent.insertRange(idx, nodes);
}

/// Appends a range of nodes to the end of the children array of the node `parent`.
/// The `nodes` array must contain a list of direct siblings ordered from left to right.
/// Returns the inserted node range.
Tree.append_range = function(parent, nodes) {
  if (nodes.length === 0) return;
  parent.appendRange(nodes);
}

/// Returns an array of all node ranges for which the passed selector function
/// returned true. The passed node can either be a single node or an array of nodes.
/// If no_overlap is set to true, the function will not search children of a
/// successful match and will not include any nodes used in a successful match again.
Tree.filterRange = function(selector, node, no_overlap) {
  var result = [];
  var nodes = Array.isArray(node) ? node : [node];
  var f = function(nodes, idx) {
    var range = [], n = nodes[idx];
    for (var i=idx; i<nodes.length; i++) {
      range.push(nodes[i]);
      if (selector(range)) {
        result.push(range.slice());
        if (no_overlap) return i-idx;
      }
    }
    if (n.children) {
      for (var i=0; i<n.children.length; i++) i += f(n.children, i);
    }
    return 0;
  }
  for (var i=0; i<nodes.length; i++) i += f(nodes, i);
  return result;
}

/// Inserts a node into the tree as the last child of 'parent'. Returns the inserted node.
Tree.append = function(parent, node) {
  return parent.append(node);
}

/// Removes the passed node from the tree and returns its previous index. Sets
/// node.parent to null.
Tree.remove = function(node) {
  return node.remove();
}

/// Removes a range of nodes from the tree and returns the index of the first node if
/// nodes contained more than zero nodes. The `nodes` array must contain a list of direct
/// siblings ordered from left to right. Sets the removed nodes' parent link to null.
Tree.remove_range = function(nodes) {
  if (nodes.length === 0 || !nodes[0].parent) return;
  return nodes[0].parent.removeRange(nodes);
}

/// Replaces n1 with n2 by removing n1 and inserting n2 at n1's old position. If n2 was part of a
/// tree (had a parent), it will be removed before being inserted at the new position. It is safe
/// to replace a node with its child.
/// Returns the inserted node.
Tree.replace = function(n1, n2) {
  return n1.replaceWith(n2);
}

/// Will switch n1 with n2 if they have the same parent. Otherwise throws an exception.
Tree.switch_siblings = function(n1, n2) {
  return n1.switchWithSibling(n2);
}

/// Returns the index of the passed node in its parent node or -1 if it does not
/// have a parent.
Tree.get_idx = function(node) {
  if (!node.parent) return -1;
  return node.position;
}

/// Pass the parent node and then a sequence of children indices to get a specific
/// child. E.g. for `[A[B,C[D]]]`, Tree.get(t, [0, 1, 0]) will return node `D`.
/// If the path does not exist, the method returns null.
Tree.get_child = function(path, node) {
  return node.getChild(path);
}

/// Safe way to get to a nodes anchestors. If a parent does not exist, it will
/// return null.
Tree.get_parent = function(level, node) {
  return node.getAncestor(level);
}

/// Pass a node to get an array of children-indices from the root to the
/// passed node. This is the inverse function to Tree.get_child.
Tree.get_path = function(node) {
  return node.path;
}

/// Calls the passed function for the passed node and all its descandents in depth-first order.
/// Node can either be a single node or an array of nodes.
Tree.for_each = function(f, node) {
  iteration.forEach(f, node);
}

/// Calls the passed function for each of the passed nodes and their children, depth-first.
/// The results are stored in an array that is returned. Node can either be a single node or
/// an array of nodes.
Tree.map = function(f, node) {
  return iteration.map(f, node);
}

/// Returns an array of all nodes for which the passed selector function returned true. Traverses
/// the nodes depth-first. The passed node can either be a single node or an array of nodes.
Tree.filter = function(selector, node) {
  return iteration.filter(selector, node);
}

/// Returns an array of all nodes in the tree of the passed root node. The root node is included.
/// Traverses the nodes depth-first. The passed node can either be a single node or an array of
/// nodes.
Tree.select_all = function(node) {
  return iteration.getAllNodes(node);
}

/// Returns the first node in the passed node or its decandents for that the selector function
/// returns true. Traverses depth-first. Node can either be a single node or an array of nodes.
/// If no nodes matches, returns null.
Tree.select_first = function(selector, node) {
  return iteration.select(selector, node);
}

/// Returns the closest common ancestor of the passed nodes.
Tree.get_cca = function(nodes) {
  return (new NodeSelection(nodes)).cca;
}

/// Returns an array of all leaf nodes of the node array or single node passed.
Tree.get_leaf_nodes = function(node) {
  return iteration.getLeafNodes(node);
}

/// Returns true if the node is top-level in the tree (its parent is the Tree object).
Tree.is_root = function(node) {
  return node.isRoot();
}

/// Returns true if the passed node array is a proper node range, which is the
/// case only if they are all siblings and ordered from left to right.
Tree.is_range = function(nodes) {
  return (new NodeSelection(nodes)).isRange();
}

Tree.get_root = function(node) {
  return node.root;
}

/// Returns an array of all nodes that have the passed value in their .value field. Seaches on
/// the passed array of nodes or single node depth-first.
Tree.get_by_value = function(value, node) {
  return iteration.filterByValue(value, node);
}

/// Returns the first node with the passed id or null if no node has the id. Seaches on
/// the passed array of nodes or single node depth-first.
Tree.get_by_id = function(id, node) {
  return iteration.selectById(id, node);
}
