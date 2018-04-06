import asArray from "./helpers/as-array.js";
import { stringifyTree } from "./serialization.js";

// NodeSelection provides an interface for storing and interacting with groups/
// ranges of nodes within a single tree.
export default class NodeSelection {
  constructor(nodes) {
    this._selection = [];
    this.add(nodes);
  }

  get selection() {
    return this._selection;
  }
  set selection(nodes) {
    let ns = asArray(nodes);
    if (allSameRoot(ns)) {
      this._selection = ns;
    }
    else {
      throw "[NodeSelection] All nodes in a selection must belong to the same tree.";
    }
  }
  // Shorthands for the previous two.
  get sel() {
    return this.selection;
  }
  set sel(nodes) {
    this.selection = nodes;
  }

  // Add one or more nodes to the selection.
  add(node) {
    this.selection = this._selection.concat(asArray(node));
  }

  // Remove one or more nodes from the selection.
  remove(node) {
    asArray(node).forEach(n => {
      if (this._selection.includes(n)) {
        this._selection.splice(this._selection.indexOf(n), 1);
      }
    });
  }

  sort() {
    this._selection = sortDepthFirst(this._selection);
  }

  // Returns the closest common ancestor of the selected nodes.
  get closestCommonAncestor() {
    return ccaHelper(this._selection).closestCommonAncestor;
  }
  // Shorthand for "closestCommonAncestor."
  get cca() {
    return this.closestCommonAncestor;
  }

  // Updates the selection.
  toClosestCommonAncestor() {
    this.selection = this.cca;
    return this;
  }
  // Shorthand.
  toCCA() {
    return this.toClosestCommonAncestor();
  }

  /// Returns true if the selected nodes are a proper node range, which is the
  /// case only if they are all siblings and ordered from left to right.
  isRange() {
    for (let i = 1; i < this._selection.length; i++) {
      if (this._selection[i-1].rs !== this._selection[i]) return false;
    }
    return true;
  }

  // Returns the smallest range of nodes (continuous, ordered neighbors)
  // covering the selected. The method first gets the closest common
  // ancestor and then selects a range of its children that contains all the
  // selected nodes.
  get range() {
    let nodes = this._selection;
    if (nodes.length < 1) {
      throw "[NodeSelection] Attempting to get the range of an empty selection"
    }
    else if (nodes.length === 1) {
      return [nodes[0]];
    }

    let tree = nodes[0].root;

    let data = ccaHelper(nodes, tree);

    // get the cca's left-most and right-most child that contains one of the nodes
    let rm=-1, lm=data.closestCommonAncestor.children.length, i;
    for (i=0; i<nodes.length; i++) {
      let n = tree.getChild(data.paths[i].slice(0, data.commonPathLength+1));
      let idx = data.closestCommonAncestor.children.indexOf(n);
      if (idx > rm) rm = idx;
      if (idx < lm) lm = idx;
    }

    // now select the whole range of nodes from left to right
    let range = [];
    for (i=lm; i<=rm; i++) range.push(data.closestCommonAncestor.children[i]);

    return range;
  }

  // Updates the selection.
  toRange() {
    this.sel = this.range;
    return this;
  }

  clone() {
    return new NodeSelection(this._selection);
  }

  toString() {
    return "[" + this._selection.map(n => stringifyTree(n)) + "]";
  }
}

function sameRoot(node1, node2) {
  return node1.root === node2.root;
}

function allSameRoot(nodes) {
  if (nodes.length < 1) {
    return true;
  }
  let root = nodes[0].root;
  for (let i=1; i<nodes.length; i++) {
    if (!sameRoot(root, nodes[i])) {
      return false;
    }
  }
  return true;
}

// Takes an array of nodes that all come from the same tree.
// Compares their paths to sort them in depth-first order.
function sortDepthFirst(nodes) {
  return nodes.sort(function compare(n1, n2) {
    let p1 = n1.path;
    let p2 = n2.path;

    // heck for an earlier position at each level of depth
    for (let depth=0; depth < Math.min(p1.length, p2.length); depth++) {
      let pos1 = p1[depth];
      let pos2 = p2[depth];
      if (pos1 < pos2) {
        return -1;
      }
      else if (pos1 > pos2) {
        return 1;
      }
    }

    // nodes have the same path for their corresponding depths, the node with
    // the shorter path goes first
    if (p1.length === p2.length) {
      return 0;
    }
    else if (p1.length < p2.length) {
      return -1;
    }
    else {
      return 1;
    }
  });
}

// Returns an object containing the paths, common path length, and closest
// common ancestor of passed nodes.
function ccaHelper(nodes, tree) {
  if (nodes.length < 1) {
    throw "[NodeSelection] Attempting to find the closest common ancestor of an empty selection.";
  }

  let paths = nodes.map(node => node.path);

  let commonPathLength = 0;
  while (pathsMatchAtDepth(paths, commonPathLength)) {
    commonPathLength++;
  }

  let closestCommonAncestor = (tree || nodes[0].root).getChild(paths[0].slice(0, commonPathLength));

  return { paths, commonPathLength, closestCommonAncestor };
}

// Checks whether the paths have the same value AT THE GIVEN DEPTH.
// RETURNS FALSE IF ANY OF THE PATHS END AT THE GIVEN DEPTH.
function pathsMatchAtDepth(paths, depth) {
  let val = paths[0][depth];
  for (let i=0; i<paths.length; i++) {
    if (paths[i].length <= depth+1) return false; // we want an ancestor, so if already at leaf, return
    if (paths[i][depth] !== val) return false;
  }
  return true;
}
