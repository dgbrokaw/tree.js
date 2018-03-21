import asArray from "./helpers/as-array.js";
import stringifyTree from "./stringify.js";
import Tree from "./tree.js";

export default class NodeSelection {
  constructor(nodes) {
    this._selection = asArray(nodes);
  }

  get selection() {
    return this._selection;
  }
  set selection(nodes) {
    this._selection = asArray(nodes);
  }
  // Shorthands for the previous two.
  get sel() {
    return this.selection;
  }
  set sel(nodes) {
    this.selection = nodes;
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

    let tree = Tree.get_root(nodes[0]);

    let data = ccaHelper(nodes, tree);

    // get the cca's left-most and right-most child that contains one of the nodes
    let rm=-1, lm=data.closestCommonAncestor.children.length, i;
    for (i=0; i<nodes.length; i++) {
      let n = Tree.get_child(data.paths[i].slice(0, data.commonPathLength+1), tree);
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

// Returns an object containing the paths, common path length, and closest
// common ancestor of passed nodes.
function ccaHelper(nodes, tree) {
  if (nodes.length < 1) {
    throw "[NodeSelection] Attempting to find the closest common ancestor of an empty selection.";
  }

  let paths = nodes.map(node => Tree.get_path(node));

  let commonPathLength = 0;
  while (pathsMatchAtDepth(paths, commonPathLength)) {
    commonPathLength++;
  }

  let closestCommonAncestor = Tree.get_child(paths[0].slice(0, commonPathLength), tree || Tree.get_root(nodes[0]));

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
