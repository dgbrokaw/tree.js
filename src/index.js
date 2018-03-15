import Tree from "./tree.js";

import Node from "./tree-node.js";
Tree.Node = Node;

import parse from "./parse.js";
Tree.parse = parse;

import stringify from "./stringify.js";
Tree.stringify = stringify;

import id from "./helpers/id.js";
Tree.uid = id; // maintain original interface

export { Tree };
