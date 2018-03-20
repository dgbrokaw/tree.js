/**
 * Pass two identically structured trees or arrays of trees and the method
 * will return an object that maps the ids of all source tree nodes to arrays
 * of the respective target tree nodes.
 *
 * If a source node is a leaf node while its corresponding target node has
 * children, the source node will be mapped to an array containing the target
 * node and all its descendents.
 *
 * If a source node has children while its corresponding target node is a
 * leaf node, the source node's children all get mapped to arrays containing
 * the same target leaf node as only element.
 *
 * If the only1to1 parameter is passed as true, the function will not allow
 * to two cases above and raise an exception should the structure of source
 * and target tree differ. In cases where the two cases above do not apply
 * and a source node has more or less children than its corresponding target
 * node, the method throws an exception. It also throws an exception if there
 * are duplicate ids in the source tree.
 */
export default function mapBetweenTrees(source_tree, target_tree) {
  var map = {};

  function mapfn(source, target) {
    if (source.id in map) throw "duplicate id in source tree";
    map[source.id] = [target];
    if (source.children.length !== target.children.length) {
      if (!source.hasChildren()) map[source.id] = target.select_all();
      else if (!target.hasChildren()) source.for_each(function(s) { map[s.id] = [target]});
      else throw "tree structures don't match";
    } else {
      for (var i=0; i<source.children.length; i++) mapfn(source.children[i], target.children[i]);
    }
  }

  if (Array.isArray(source_tree)) {
    if (source_tree.length !== target_tree.length) throw "tree structures don't match";
    for (var i=0; i<source_tree.length; i++) mapfn(source_tree[i], target_tree[i]);
  } else mapfn(source_tree, target_tree);

  return map;
}
