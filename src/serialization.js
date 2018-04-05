import TreeBuilder from "./tree-builder.js";
import StringParseDirector from "./build-from-string.js";
import TreeSerializeDirector from "./build-string-from-tree.js";
import StringBuilder from "./string-builder.js";
import asArray from "./helpers/as-array.js";

export function parseString(str) {
  let director = new StringParseDirector(new TreeBuilder());
  return director.construct(str);
}

export function stringifyTree(tree) {
  let director = new TreeSerializeDirector(new StringBuilder());
  return director.construct(tree);
}
