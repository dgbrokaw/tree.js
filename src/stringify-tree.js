import StringBuilder from "./string-builder.js";
import TreeSerializeDirector from "./build-string-from-tree.js";

export default function stringifyTree(tree) {
  let director = new TreeSerializeDirector(new StringBuilder());
  return director.construct(tree);
}
