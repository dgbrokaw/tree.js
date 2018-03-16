import id from "./helpers/id.js";

/// Will clone a node and its children. Attributes beside 'children', 'ls', 'rs' and 'parent' will
/// just be a shallow copy of the original nodes. Attributes starting with '_' will not be copied at
/// all. 'ls', 'rs' and 'parent' will be set to the correct values for all children and will be set to
/// undefined for the passed node. A new random id is assigned to the cloned node if the original had
/// an id, unless the optional keep_ids parameter is passed as true.
/// `nodes` can either be a single node or an array of nodes. The cloned node or nodes are returned.
export default function cloneTree(nodes, keep_ids, fields_to_clone) {
  var f = function(node) {
    var i;
    var cloned = new node.constructor();
    if (fields_to_clone) {
      for (i=0; i<fields_to_clone.length; i++) cloned[fields_to_clone[i]] = node[fields_to_clone[i]];
    } else {
      for (var key in node) { if (key[0] !== '_') cloned[key] = node[key] }
    }
    delete cloned.ls; delete cloned.rs; delete cloned.parent;
    if (node.id && !keep_ids) cloned.id = id();
    if (node.children) {
      cloned.children = [];
      for (i=0; i<node.children.length; i++) {
        cloned.children.push(f(node.children[i]));
        cloned.children[i].parent = cloned;
      }
      for (i=0; i<node.children.length; i++) {
        cloned.children[i].ls = cloned.children[i-1];
        cloned.children[i].rs = cloned.children[i+1];
      }
    }
    return cloned;
  }
  if (!Array.isArray(nodes)) return f(nodes);
  var cloned = nodes.map(f);
  // make sure that the cloned nodes are siblings to each other, if the
  // original nodes were siblings, too
  if (nodes.length > 1) for (var i=0; i<nodes.length; i++) {
    if (i>0 && nodes[i].ls === nodes[i-1]) cloned[i].ls = cloned[i-1];
    if (i<nodes.length-1 && nodes[i].rs === nodes[i+1]) cloned[i].rs = cloned[i+1];
  }

  return cloned;
}
