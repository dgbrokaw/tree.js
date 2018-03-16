/// Will throw an expecption if any node in the tree has invalid value for parent, ls or rs.
/// `nodes` can either be a single node or an array of nodes. Accordingly, a single node or an array
/// of nodes is returned.
export default function validateTree(nodes) {
  var check = function(node, parent) {
    if (node.parent != parent) throw "wrong parent information";
    if (node.children) {
      for (var i=0; i<node.children.length; i++) {
        var child = node.children[i];
        if (child.ls != node.children[i-1]) throw "wrong ls information";
        if (child.rs != node.children[i+1]) throw "wrong rs information";
        check(child, node);
      }
    }
  }
  if (!Array.isArray(nodes)) nodes = [nodes];
  for (var i=0; i<nodes.length; i++) check(nodes[i], null);
}
