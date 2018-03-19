// Copyright Erik Weitnauer 2012-2015.

/** This is an implementation of fully linked nary-trees. Each non-leaf node has an array
of its children `children`, a reference to its left sibling `ls`, a reference to its right
sibling `rs` and a reference to its parent `parent`.
The Tree object is a collection of methods to handle tree structures, its not instanciated
itself. Instead, each object can be a tree node.

Most of the methods can accept both a single node or an array of nodes to work on.
*/
import NodeSelection from "./node-selection.js";

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
Tree.insert = function(parent, idx, node) {
  node.ls = parent.children[idx-1];
  if (parent.children[idx-1]) parent.children[idx-1].rs = node;
  node.rs = parent.children[idx];
  if (parent.children[idx]) parent.children[idx].ls = node;
  node.parent = parent;
  parent.children.splice(idx, 0, node);
  return node;
}

/// Inserts a range of nodes at the position `idx` into the children array
/// of the node `parent`. The `nodes` array must contain a list of direct
/// siblings ordered from left to right.
Tree.insert_range = function(parent, idx, nodes) {
  var N=nodes.length;
  if (N===0) return;
  nodes[0].ls = parent.children[idx-1];
  if (parent.children[idx-1]) parent.children[idx-1].rs = nodes[0];
  nodes[N-1].rs = parent.children[idx];
  if (parent.children[idx]) parent.children[idx].ls = nodes[N-1];
  for (var i=0; i<N; i++) nodes[i].parent = parent;
  parent.children = parent.children.slice(0,idx).concat(nodes, parent.children.slice(idx));
  return nodes;
}

/// Appends a range of nodes to the end of the children array of the node `parent`.
/// The `nodes` array must contain a list of direct siblings ordered from left to right.
/// Returns the inserted node range.
Tree.append_range = function(parent, nodes) {
  var N=nodes.length;
  if (N===0) return;
  var last = parent.children[parent.children.length-1];
  if (last) last.rs = nodes[0];
  nodes[0].ls = last;
  nodes[N-1].rs = null;
  for (var i=0; i<N; i++) nodes[i].parent = parent;
  parent.children = parent.children.concat(nodes);
  return nodes;
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
  var last = parent.children[parent.children.length-1];
  if (last) last.rs = node;
  node.ls = last;
  node.rs = null;
  node.parent = parent;
  parent.children.push(node);
  return node;
}

/// Removes the passed node from the tree and returns its previous index. Sets
/// node.parent to null.
Tree.remove = function(node) {
  var idx;
  var siblings = node.parent.children;
  idx = siblings.indexOf(node);
  if (siblings[idx-1]) siblings[idx-1].rs = node.rs;
  if (siblings[idx+1]) siblings[idx+1].ls = node.ls;
  siblings.splice(idx,1);
  node.parent = null;
  return idx;
}

/// Removes a range of nodes from the tree and returns the index of the first node if
/// nodes contained more than zero nodes. The `nodes` array must contain a list of direct
/// siblings ordered from left to right. Sets the removed nodes' parent link to null.
Tree.remove_range = function(nodes) {
  var N = nodes.length;
  if (N === 0) return;
  var siblings = nodes[0].parent.children;
  var idx = siblings.indexOf(nodes[0]);
  if (siblings[idx-1]) siblings[idx-1].rs = nodes[N-1].rs;
  if (siblings[idx+N]) siblings[idx+N].ls = nodes[0].ls;
  siblings.splice(idx,N);
  for (var i=0; i<nodes.length; i++) nodes[i].parent = null;
  return idx;
}

/// Replaces n1 with n2 by removing n1 and inserting n2 at n1's old position. If n2 was part of a
/// tree (had a parent), it will be removed before being inserted at the new position. It is safe
/// to replace a node with its child.
/// Returns the inserted node.
Tree.replace = function(n1, n2) {
  if (n1 === n2) return n1;
  if (n2.parent) Tree.remove(n2);
  var parent = n1.parent
    , idx = Tree.remove(n1);
  return Tree.insert(parent, idx, n2);
}

/// Will switch n1 with n2 if they have the same parent. Otherwise throws an exception.
Tree.switch_siblings = function(n1, n2) {
  if (n1.parent != n2.parent) throw "Called switch_siblings on nodes that are no siblings!";
  var p = n1.parent;
  var idx1 = p.children.indexOf(n1);
  var idx2 = p.children.indexOf(n2);
  p.children[idx1] = n2;
  p.children[idx2] = n1;
  var h;
  if (n1.rs == n2) {
    if (n1.ls) n1.ls.rs = n2;
    if (n2.rs) n2.rs.ls = n1;
    n1.rs = n2.rs;
    n2.ls = n1.ls;
    n1.ls = n2;
    n2.rs = n1;
  } else if (n1.ls == n2) {
    if (n1.rs) n1.rs.ls = n2;
    if (n2.ls) n2.ls.rs = n1;
    n1.ls = n2.ls;
    n2.rs = n1.rs;
    n1.rs = n2;
    n2.ls = n1;
  } else {
    if (n1.ls) n1.ls.rs = n2;
    if (n1.rs) n1.rs.ls = n2;
    if (n2.ls) n2.ls.rs = n1;
    if (n2.rs) n2.rs.ls = n1;
    h = n1.ls; n1.ls = n2.ls; n2.ls = h;
    h = n1.rs; n1.rs = n2.rs; n2.rs = h;
  }
}

/// Returns the index of the passed node in its parent node or -1 if it does not
/// have a parent.
Tree.get_idx = function(node) {
  if (node.parent) return node.parent.children.indexOf(node);
  else return -1;
}

/// Pass the parent node and then a sequence of children indices to get a specific
/// child. E.g. for `[A[B,C[D]]]`, Tree.get(t, [0, 1, 0]) will return node `D`.
/// If the path does not exist, the method returns null.
Tree.get_child = function(path, node) {
  for (var i=0; i<path.length; i++) {
    if (!node.children || node.children.length <= path[i]) return null;
    node = node.children[path[i]];
  }
  return node;
}

/// Safe way to get to a nodes anchestors. If a parent does not exist, it will
/// return null.
Tree.get_parent = function(level, node) {
  for (var i=0; i<level; i++) {
    if (node.parent) node = node.parent;
    else return null;
  }
  return node;
}

/// Pass a node to get an array of children-indices from the root to the
/// passed node. This is the inverse function to Tree.get_child.
Tree.get_path = function(node) {
  var path = [];
  while (node.parent) {
    path.unshift(node.parent.children.indexOf(node));
    node = node.parent;
  }
  return path;
}

/// Calls the passed function for the passed node and all its descandents in depth-first order.
/// Node can either be a single node or an array of nodes.
Tree.for_each = function(f, node) {
  var nodes = Array.isArray(node) ? node : [node];
  var traverse = function(node) {
    f(node);
    if (node.children) for (var i=0; i<node.children.length; i++) traverse(node.children[i]);
  }
  for (var i=0; i<nodes.length; i++) traverse(nodes[i]);
}

/// Calls the passed function for each of the passed nodes and their anchestors, depth-first.
/// The results are stored in an array that is returned. Node can either be a single node or
/// an array of nodes.
Tree.map = function(f, node) {
  var nodes = Array.isArray(node) ? node : [node];
  var res = [];
  var traverse = function(node) {
    res.push(f(node));
    if (node.children) for (var i=0; i<node.children.length; i++) traverse(node.children[i]);
  }
  for (var i=0; i<nodes.length; i++) traverse(nodes[i]);
  return res;
}

/// Returns an array of all nodes for which the passed selector function returned true. Traverses
/// the nodes depth-first. The passed node can either be a single node or an array of nodes.
Tree.filter = function(selector, node) {
  var result = [];
  var nodes = Array.isArray(node) ? node : [node];
  var f = function(node) {
    if (selector(node)) result.push(node);
    if (node.children) for (var i=0; i<node.children.length; i++) f(node.children[i]);
  }
  for (var i=0; i<nodes.length; i++) f(nodes[i]);
  return result;
}

/// Returns an array of all nodes in the tree of the passed root node. The root node is included.
/// Traverses the nodes depth-first. The passed node can either be a single node or an array of
/// nodes.
Tree.select_all = function(node) {
  return Tree.filter(function() { return true }, node);
}

/// Returns the first node in the passed node or its decandents for that the selector function
/// returns true. Traverses depth-first. Node can either be a single node or an array of nodes.
/// If no nodes matches, returns null.
Tree.select_first = function(selector, node) {
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
  var nodes = Array.isArray(node) ? node : [node];
  for (var i=0; i<nodes.length; i++) {
    var n = f(nodes[i]);
    if (n) return n;
  }
  return null;
}

/// Returns the closest common anchestor of the passed nodes.
Tree.get_cca = function(nodes) {
  return (new NodeSelection(nodes)).cca;
}

/// Returns an array of all leaf nodes of the node array or single node passed.
Tree.get_leaf_nodes = function(node) {
  return Tree.filter(function(n) { return !(n.children && n.children.length) }, node);
}

/// Retruns true if the node is top-level in the tree (its parent is the Tree object).
Tree.is_root = function(node) {
  return !node.parent;
}

/// Retruns true if the passed node array is a proper node range, which is the
/// case only if they are all siblings and ordered from left to right.
Tree.is_range = function(nodes) {
  for (var i = 1; i < nodes.length; i++) {
    if (nodes[i-1].rs !== nodes[i]) return false;
  }
  return true;
}

/// Returns the tree that a node belongs to by following the .parent references. Returns
/// null if the top-most parent is not a Tree.
Tree.get_root = function(node) {
  while (node.parent) node = node.parent;
  return node;
}

/// Returns an array of all nodes that have the passed value in their .value field. Seaches on
/// the passed array of nodes or single node depth-first.
Tree.get_by_value = function(value, node) {
  return Tree.filter(function(n) { return n.value === value}, node);
}

/// Returns the first node with the passed id or null if no node has the id. Seaches on
/// the passed array of nodes or single node depth-first.
Tree.get_by_id = function(id, node) {
  return Tree.select_first(function (n) { return n.id === id }, node);
}
