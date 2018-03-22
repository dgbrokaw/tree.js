/**
 * Pass two identically structured trees or arrays of trees and the method
 * will return an object that maps the ids of all source tree nodes to an array
 * with a single element -- the respective target tree node. If the trees / arrays are structured
 * differently, or if there is a duplicate id in the source nodes, the
 * methods throws an exception if in strict mode (by default strict=true).
 * If not in strict mode, the structure mismatch is ignored and all a partial
 * mapping is returned.
 */
export default function oneToOneRelationBetweenTrees(source_tree, target_tree, strict) {
  var map = {};
  if (arguments.length < 3) strict = true;

  function mapfn(source, target) {
    if (strict && source.id in map) throw "duplicate id in source tree";
    map[source.id] = [target];
    if (strict && source.children.length !== target.children.length)
      throw "tree structures don't match"
    var slen = source.children.length, tlen = target.children.length;
    for (var i=0; i<slen; i++) {
      if (i<tlen) mapfn(source.children[i], target.children[i]);
      else source.children[i].for_each(function(s) { map[s.id] = []});
    }
  }

  if (Array.isArray(source_tree)) {
    if (strict && source_tree.length !== target_tree.length) throw "tree structures don't match";
    var slen = source_tree.length, tlen = target_tree.length;
    for (var i=0; i<slen; i++) {
      if (i<tlen) mapfn(source_tree[i], target_tree[i]);
      else source_tree[i].for_each(function(s) { map[s.id] = []});
    }
  } else mapfn(source_tree, target_tree);

  return map;
}