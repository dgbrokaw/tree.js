import Tree from "./tree.js";

import Node from "./tree-node.js";
Tree.Node = Node;

import parseTree from "./parse.js";
Tree.parse = parseTree;

import validateTree from "./validate.js";
Tree.validate = validateTree;

import stringifyTree from "./stringify.js";
Tree.stringify = stringifyTree;

import id from "./helpers/id.js";
Tree.uid = id;

import cloneTree from "./clone.js";
Tree.clone = cloneTree;

import mapBetweenTrees from "./map.js";
Tree.get_mapping_between = mapBetweenTrees;

import oneToOneMapBetweenTrees from "./map-one-to-one.js";
Tree.get_1to1_mapping_between = oneToOneMapBetweenTrees;

import NodeSelection from "./node-selection.js";

export { Tree, NodeSelection };
