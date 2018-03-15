/// Inverse of Tree.parse, returns a string representation of the nodes, using their
/// `value` fields. This is just for debugging and allows you to look at the structure
/// of a tree and the `value` fields of its nodes. `nodes` can be a single node or an
/// array of nodes.
export default function treeStringify(nodes) {
  var f = function(node) {
    var str = '';
    if ('value' in node) str += node.value;
    if (node.children && node.children[0]) {
      str += '[' + node.children.map(f).join(',') + ']';
    }
    return str;
  }
  if (!Array.isArray(nodes)) nodes = [nodes];
  return nodes.map(f).join(',');
};
