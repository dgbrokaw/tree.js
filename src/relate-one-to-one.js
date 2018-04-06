/**
 * Pass two identically structured trees or arrays of trees and the method
 * will return an object that maps the ids of all source tree nodes to an array
 * with a single element -- the respective target tree node. If the trees / arrays are structured
 * differently, the method throws an exception if in strict mode (by default strict=true).
 * If not in strict mode, the structure mismatch is ignored and a partial
 * mapping is returned.
 * In a partial mapping, if the target tree has more children in any branch than
 * the source, the additional children will be ignored. If the source tree has
 * more children in any branch than the target, the additional children will
 * relate to nothing.
 */
export default function oneToOneRelationBetweenTrees(sourceTree, targetTree, strict=true) {
  let relation = {};

  function relationfn(source, target) {
    relation[source.id] = [target];
    if (strict && source.children.length !== target.children.length) {
      throw "tree structures don't match"
    }
    let slen = source.children.length, tlen = target.children.length;
    for (var i=0; i<slen; i++) {
      if (i<tlen) relationfn(source.children[i], target.children[i]);
      else source.children[i].forEach(function(s) { relation[s.id] = []});
    }
  }

  relationfn(sourceTree, targetTree);

  return relation;
}
