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
 */
export default function relationBetweenTrees(sourceTree, targetTree) {
  var relation = {};

  function relationfn(source, target) {
    relation[source.id] = [target];
    if (source.children.length !== target.children.length) {
      if (!source.hasChildren()) {
        relation[source.id] = target.getAllNodes();
      }
      else if (!target.hasChildren()) {
        source.forEach(function(s) { relation[s.id] = [target]});
      }
      else {
        throw "tree structures don't match";
      }
    } else {
      for (var i=0; i<source.children.length; i++) {
        relationfn(source.children[i], target.children[i]);
      }
    }
  }

  relationfn(sourceTree, targetTree);

  return relation;
}
