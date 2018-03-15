import Node from "./tree-node.js";

/// Will parse a sting like '[A,B[b1,b2,b3],C]' and return the top-level node of a
/// tree structure. If there are more than a single top-level node, an array of them
/// is returned (e.g. 'A,B'). Use square brackets to denote children of a node and commas
/// to separate nodes from each other. You can use any names for the nodes except ones
/// containing ',', '[' or ']'. The names will be saved in each node's `value` field.
/// Nodes will also be created in absense of values, e.g. '[,]' will return an object
/// with empty value that has an array `children` with two nodes with empty values.
export default function TreeParse(str) {
  var top = new Node();
  var curr = top.append(new Node());
  var i;
  curr.value = '';
  for (i=0; i<str.length; i++) {
    var c = str[i];
    if (c == '[') {
      curr = curr.append(new Node());
      curr.value = '';
    } else if (c == ']') {
      curr = curr.parent;
      if (curr === top) throw 'parse error';
    } else if (c == ',') {
      curr = curr.parent.append(new Node());
      curr.value = '';
    } else {
      curr.value += c;
    }
  }
  for (i=0; i<top.children.length; i++) top.children[i].parent = null;
  if (top.children.length === 1) return top.children[0];
  return top.children;
}
