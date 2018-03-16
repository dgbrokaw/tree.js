import asArray from "./helpers/as-array.js";
import Tree from "./tree.js";

export default class NodeSelection {
  constructor(nodes) {
    this._selection = asArray(nodes);
  }

  // get selection() {
  //   return this._selection;
  // }
  // set selection(nodes) {
  //   this._selection = asArray(nodes);
  // }
  // // Shorthands for the previous two.
  // get sel() {
  //   return this.selection;
  // }
  // set sel(nodes) {
  //   this.selection = nodes;
  // }

  // get closestCommonAncestor() {
  //   var paths = this._selection.map(function(node) { return Tree.get_path(node) });
  //   var same = function(len) {
  //     var val = paths[0][len];
  //     for (var i=0; i<paths.length; i++) {
  //       if (paths[i].length <= len+1) return false; // no need to look further if we are at a leaf already
  //       if (paths[i][len] !== val) return false;
  //     }
  //     return true;
  //   }
  //   var cpl = 0; // common path length
  //   while (same(cpl)) cpl++;
  //   var d = paths[0].length-cpl, n = nodes[0];
  //   for (var i=0; i<d; i++) n = n.parent;
  //   return n;
  // }
  // // Shorthand for "closestCommonAncestor."
  // get cca() {
  //   return this.closestCommonAncestor;
  // }
  //
  // toRange() {
  //
  // }
}

// /// Returns the closest common anchestor of the passed nodes.
// Tree.get_cca = function(nodes) {
//   var paths = nodes.map(function(node) { return Tree.get_path(node) });
//   var same = function(len) {
//     var val = paths[0][len];
//     for (var i=0; i<paths.length; i++) {
//       if (paths[i].length <= len+1) return false; // no need to look further if we are at a leaf already
//       if (paths[i][len] !== val) return false;
//     }
//     return true;
//   }
//   var cpl = 0; // common path length
//   while (same(cpl)) cpl++;
//   var d = paths[0].length-cpl, n = nodes[0];
//   for (var i=0; i<d; i++) n = n.parent;
//   return n;
// }
//
// /// Returns the smallest range of nodes (continuous, ordered neighbors) covering the passed
// /// nodes. The method first gets the closest common ancestor and then selects a range of its
// /// children that contains all the passed nodes.
// Tree.nodes_to_range = function(nodes) {
//   var N = nodes.length;
//   if (N === 0) return [];
//   if (N === 1) return [nodes[0]];
//   var tree = nodes[0];
//   while (tree.parent) tree = tree.parent;
//
//   // get the closest common anchestor (cca)
//   var paths = nodes.map(function(node) {
//     return Tree.get_path(node);
//   });
//   var same = function(len) {
//     var val = paths[0][len];
//     for (var i=0; i<paths.length; i++) {
//       if (paths[i].length <= len+1) return false; // we want an ancestor, so if already at leaf, return
//       if (paths[i][len] !== val) return false;
//     }
//     return true;
//   }
//   var cpl = 0; // common path length
//   while (same(cpl)) cpl++;
//   var cca = Tree.get_child(paths[0].slice(0, cpl), tree);
//
//   // get the cca's left-most and right-most child that contains one of the nodes
//   var rm=-1, lm=cca.children.length, i;
//   for (i=0; i<N; i++) {
//     var n = Tree.get_child(paths[i].slice(0, cpl+1), tree);
//     var idx = cca.children.indexOf(n);
//     if (idx > rm) rm = idx;
//     if (idx < lm) lm = idx;
//   }
//
//   // now select the whole range of nodes from left to right
//   var range = [];
//   for (i=lm; i<=rm; i++) range.push(cca.children[i]);
//   return range;
// }
