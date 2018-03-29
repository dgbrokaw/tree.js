/**
 * Pass two identically structured trees or arrays of trees and the method
 * will return an object that maps the ids of all source tree nodes to an array
 * with a single element -- the respective target tree node. If the trees / arrays are structured
 * differently, or if there is a duplicate id in the source nodes, the
 * methods throws an exception if in strict mode (by default strict=true).
 * If not in strict mode, the structure mismatch is ignored and all a partial
 * mapping is returned.
 */
export default function oneToOneRelationBetweenTrees(sourceTree, targetTree, strict=true) {
  var relation = {};

  function relationfn(source, target) {
    if (strict && source.id in relation) throw "duplicate id in source tree";
    relation[source.id] = [target];
    if (strict && source.children.length !== target.children.length)
      throw "tree structures don't match"
    var slen = source.children.length, tlen = target.children.length;
    for (var i=0; i<slen; i++) {
      if (i<tlen) relationfn(source.children[i], target.children[i]);
      else source.children[i].forEach(function(s) { relation[s.id] = []});
    }
  }

  if (Array.isArray(sourceTree)) {
    if (strict && sourceTree.length !== targetTree.length) throw "tree structures don't match";
    var slen = sourceTree.length, tlen = targetTree.length;
    for (var i=0; i<slen; i++) {
      if (i<tlen) relationfn(sourceTree[i], targetTree[i]);
      else sourceTree[i].forEach(function(s) { relation[s.id] = []});
    }
  } else relationfn(sourceTree, targetTree);

  return relation;
}
