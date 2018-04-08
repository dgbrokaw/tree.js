import TreeBuilder from "./tree-builder.js";
import StringParseDirector from "./build-from-string.js";

export default function parseString(str) {
  let director = new StringParseDirector(new TreeBuilder());
  return director.construct(str);
}
