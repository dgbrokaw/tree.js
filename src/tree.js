// Copyright Erik Weitnauer 2012-2015.

/** This is an implementation of fully linked nary-trees. Each non-leaf node has
 * an array of its children `children`, a reference to its left sibling `ls`, a
 * reference to its right sibling `rs` and a reference to its parent `parent`.
 **/

/** This Tree class is a Facade for the collection of classes/modules in this library.
 * It provides static methods for constructing, mutating, and interacting with trees.
 */

import Node from "./tree-node.js";
import { parseString } from "./serialization.js";
import validateTree from "./validate.js";
import asArray from "./helpers/as-array.js";
import id from "./helpers/id.js";
import cloneTree from "./clone.js";
import * as iteration from "./iteration.js";
import relationBetweenTrees from "./relate.js";
import oneToOneRelationBetweenTrees from "./relate-one-to-one.js";
import NodeSelection from "./node-selection.js";
import TreeRelation from "./tree-relation.js";

export default class Tree {
  static version() {
    return "2.0.0";
  }

  static create() {
    return new Node();
  }

  // Use to create trees from simple string representations.
  // See the StringParseDirector and TreeBuilder classes.
  static parse(str) {
    return parseString(str);
  }

  // Use to create string representations of strings.
  // See the TreeSerializeDirector and StringBuilder classes.
  static stringify(tree) {
    return tree.stringify();
  }

  // Takes a tree and throws an exception if the tree does not have its parent
  // and sibling references correctly set.
  static validate(tree) {
    validateTree(tree);
  }

  // Creates a unique identification string.
  static uid() {
    return id();
  }

  static clone(tree, keep_ids, fields_to_clone) {
    return cloneTree(tree, keep_ids, fields_to_clone)
  }

  // Calls the passed function for the passed node and all its descandents in depth-first order.
  // The second argument can either be a single node or an array of nodes.
  static forEach(fn, node) {
    iteration.forEach(fn, node);
  }

  // Calls the passed function for each of the passed nodes and their children, depth-first.
  // The results are stored in an array that is returned. The second argument
  // can either be a single node or an array of nodes.
  static map(fn, node) {
    return iteration.map(fn, node);
  }

  // Returns an array of all nodes for which the passed selector function returned true. Traverses
  // the nodes depth-first. The second argument can either be a single node or an array of nodes.
  static filter(selector, node) {
    return iteration.filter(selector, node);
  }

  // Returns the first node in the passed node or its descendents for that the
  // selector function returns true. Traverses depth-first. The second argument
  // can either be a single node or an array of nodes. If no nodes matches, returns null.
  static select(selector, node) {
    return iteration.select(selector, node);
  }

  // Returns an array of all node ranges for which the passed selector function
  // returned true. The second argument can either be a single node or an array of nodes.
  // If noOverlap is set to true, the function will not search children of a
  // successful match and will not include any nodes used in a successful match again.
  static filterRange(selector, node, noOverlap) {
    return iteration.filterRange(selector, node, noOverlap);
  }

  // Returns an array of all nodes in the tree of the passed root node. The root
  // node is included. Traverses the nodes depth-first. The second argument can
  // either be a single node or an array of nodes.
  static getAllNodes(node) {
    return iteration.getAllNodes(node);
  }

  // Returns an array of all leaf nodes of the node array or single node passed.
  static getLeafNodes(node) {
    return iteration.getLeafNodes(node);
  }

  // Returns an array of all nodes that have the passed value in their .value
  // field. Searches on the passed array of nodes or single node depth-first.
  static filterByValue(value, node) {
    return iteration.filterByValue(value, node);
  }

  // Returns the first node with the passed id or null if no node has the id.
  // Searches on the passed array of nodes or single node depth-first.
  static selectById(id, node) {
    return iteration.selectById(id, node);
  }

  // Returns an instance of TreeRelation containing the relation between the
  // passed trees. Both arguments can be an array of trees, but it is only
  // accepted for the arrays to be the same length, or one of them has a length
  // of one. This is because if, for example, the source tree is a single tree
  // and an array of length greater than one is passed for the target tree, the
  // relation will have the source tree mapped to each target tree.
  static getRelationBetween(sourceTree, targetTree) {
    return relateTrees(sourceTree, targetTree, relationBetweenTrees);
  }

  static getOneToOneRelationBetween(sourceTree, targetTree, strict) {
    return relateTrees(sourceTree, targetTree, oneToOneRelationBetweenTrees, strict);
  }

  // Returns the closest common ancestor of the passed nodes.
  static getClosestCommonAncestor(nodes) {
    return (new NodeSelection(nodes)).cca;
  }

  // Returns true if the passed node array is a proper node range, which is the
  // case only if they are all siblings and ordered from left to right.
  static isRange(nodes) {
    return (new NodeSelection(nodes)).isRange();
  }

  // Returns the smallest range of nodes (continuous, ordered siblings) covering
  // the passed nodes. The method first gets the closest common ancestor and
  // then selects a range of its children that contains all the passed nodes.
  static getRange(nodes) {
    return (new NodeSelection(nodes)).range;
  }

  // Returns a *new* array with the passed nodes sorted depth-first.
  static sortDepthFirst(nodes) {
    let sel = new NodeSelection(nodes);
    sel.sort();
    return sel.selection;
  }

  static hasChildren(node) {
    return node.hasChildren();
  }

  // Returns the index of the passed node in its parent node or -1 if it does not
  // have a parent.
  static getPosition(node) {
    return node.position;
  }

  // Pass a node to get an array of children-indices from the root to the
  // passed node. This is the inverse function to Tree.getChild.
  static getPath(node) {
    return node.path;
  }

  // Returns true if the node is top-level in the tree (its parent is the Tree object).
  static isRoot(node) {
    return node.isRoot();
  }

  // Returns the root node of the tree by following the parent references of
  // the passed node.
  static getRoot(node) {
    return node.root;
  }

  // Takes a node and a path. E.g. for `[A[B,C[D]]]`, Tree.getChild(t, [0, 1, 0])
  // will return node `D`. If the path does not exist, the method returns null.
  static getChild(path, node) {
    return node.getChild(path);
  }

  // Returns the ancestor of the passed node at "level" number of parent references
  // up from the passed node.
  static getAncestor(level, node) {
    return node.getAncestor(level);
  }

  // Returns all the siblings of the passed node. This includes the passed node,
  // and the minimum return value will be an array of length one, containing the
  // passed node.
  static getSiblings(node) {
    return node.siblings;
  }

  // Inserts a node into the tree as the child at position 'idx' of 'parent'.
  // Returns the inserted node.
  static insert(parent, idx, child) {
    return parent.insert(idx, child);
  }

  // Inserts a node into the tree as the last child of 'parent'. Returns the
  // inserted node.
  static append(parent, child) {
    return parent.append(child);
  }

  static prepend(parent, child) {
    return parent.prepend(child);
  }

  // Removes the passed node from the tree and returns its previous index. Sets
  // node.parent to null.
  static remove(node) {
    return node.remove();
  }

  // Replaces n1 with n2 by removing n1 and inserting n2 at n1's old position.
  // If n2 was part of a tree (had a parent), it will be removed before being
  // inserted at the new position. It is safe to replace a node with its child.
  // Returns the inserted node.
  static replace(n1, n2) {
    return n1.replaceWith(n2);
  }

  // Will switch n1 with n2 if they have the same parent. Otherwise throws an
  // exception.
  static switchSiblings(n1, n2) {
    return n1.switchWithSibling(n2);
  }

  // Inserts a range of nodes at the position `idx` into the children array
  // of the node `parent`. The `nodes` array must contain a list of siblings
  // ordered from left to right.
  static insertRange(parent, idx, range) {
    return parent.insertRange(idx, range);
  }

  // Appends a range of nodes to the end of the children array of the node `parent`.
  // The `nodes` array must contain a list of siblings ordered from left to right.
  // Returns the inserted node range.
  static appendRange(parent, range) {
    return parent.appendRange(range);
  }

  static prependRange(parent, range) {
    return parent.prependRange(range);
  }

  // Removes a range of nodes from the tree and returns the index of the first node if
  // nodes contained more than zero nodes. The `nodes` array must contain a list of direct
  // siblings ordered from left to right. Sets the removed nodes' parent link to null.
  static removeRange(range) {
    if (range.length === 0 || !range[0].parent) {
      return -1;
    }
    return range[0].parent.removeRange(range);
  }
}

// Used for setting up a TreeRelation.
function relateTrees(source, target, strategy, strict) {
  let relation = new TreeRelation();
  let sources = asArray(source);
  let targets = asArray(target);
  if (sources.length === targets.length) {
    sources.forEach((source, idx) => {
      relation.updateWithRelation(strategy(source, targets[idx], strict));
    });
  }
  else if (sources.length > 1 && targets.length === 1) {
    sources.forEach(tree => {
      relation.updateWithRelation(strategy(tree, targets[0], strict));
    });
  }
  else if (sources.length === 1 && targets.length > 1) {
    targets.forEach(tree => {
      relation.updateWithRelation(strategy(sources[0], tree, strict));
    });
  }
  else {
    throw "[Tree] Unaccepted input to relation constructor."
  }
  return relation;
}
