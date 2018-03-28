import Tree from "./tree.js";

import Node from "./tree-node.js";
Tree.Node = Node;

import TreeBuilder from "./tree-builder.js";

import StringParseDirector from "./build-from-string.js";

Tree.create = function() {
  return new Node();
}

Tree.parse = function(str) {
  let builder = new TreeBuilder();
  let director = new StringParseDirector(builder);
  return director.construct(str);
}

import validateTree from "./validate.js";
Tree.validate = validateTree;

import stringifyTree from "./stringify.js";
Tree.stringify = stringifyTree;

import id from "./helpers/id.js";
Tree.uid = id;

import cloneTree from "./clone.js";
Tree.clone = cloneTree;

import relationBetweenTrees from "./relate.js";
Tree.get_mapping_between = relationBetweenTrees;

import oneToOneRelationBetweenTrees from "./relate-one-to-one.js";
Tree.get_1to1_mapping_between = oneToOneRelationBetweenTrees;

import NodeSelection from "./node-selection.js";

import DepthFirstTreeIterator from "./iterator-depth-first.js";

import TreeRelation from "./tree-relation.js";

export { Tree, Node, TreeBuilder, StringParseDirector, NodeSelection, DepthFirstTreeIterator, TreeRelation };
