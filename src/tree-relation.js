import asArray from "./helpers/as-array.js";
import pushNew from "./helpers/push-new.js";
import relationBetweenTrees from "./relate.js";

// TreeRelation provides an interface for storing and interacting with tree
// relations created by a relation strategy (e.g. the getRelationTo method of
// the Node class). Pass that relation to the constructor or init method, and
// then update and extend the relation from there.
export default class TreeRelation {
  constructor(relation = {}) {
    this.relation = relation;
  }

  init(relation) {
    this.relation = relation;
  }

  // Takes a node from the source tree and returns the node(s) corresponding to
  // it in the target tree.
  relate(sourceNode) {
    let targetNodes = [];
    asArray(sourceNode).forEach(n => {
      let targets = this.relation[n.id];
      targets.forEach(t => {
        if (!targetNodes.includes(t)) {
          targetNodes.push(t);
        }
      });
    });
    return targetNodes;
  }

  // Takes a node from the source tree and returns the first node corresponding
  // to it in the target tree. Note that any related nodes beyond the first are ignored.
  relateOne(sourceNode) {
    if (Array.isArray(sourceNode)) {
      return this.relate(sourceNode);
    }
    return this.relation[sourceNode.id][0];
  }

  // Returns a string representation of this relation, using the ids of the nodes
  // in the source tree and the values of the nodes in the target tree as representation.
  toString() {
    let res = "";
    let first = true;
    for (var id in this.relation) {
      res += (!first ? "; " : "") + id + " ===> " + this.relation[id].map(n => n.value).join(', ');
      if (first) first = false;
    }
    return res;
  }

  // Replaces the nodes related to the source node(s) with the passed target nodes.
  // Relations can be cleared by using this method and passing an empty array as
  // the second argument.
  update(sourceNode, targetNode) {
    asArray(sourceNode).forEach(n => {
      this.relation[n.id] = asArray(targetNode);
    });
  }

  // Adds nodes to relate to nodes in the source tree. Any repeated nodes will
  // be removed and added again.
  extend(sourceNode, targetNode) {
    asArray(sourceNode).forEach(n => {
      pushNew(this.relation[n.id], asArray(targetNode));
    });
  }

  // Takes a relation created by a relation strategy (e.g. the getRelationTo
  // method of the Node class) and merges it with this one.
  // Any nodes already present as source nodes in this relation will have their
  // related nodes overwritten.
  // WARNING: updating/extending with relations does not deep clone the
  // contents of the passed relation. Therefore the passed relation
  // should not be used on its own.
  updateWithRelation(relation) {
    Object.assign(this.relation, relation);
  }

  // Takes a relation created by a relation strategy and extends this relation
  // with it. Any source nodes in the passed relation will be *ignored* if they
  // are not already present within this relation.
  extendWithRelation(relation) {
    for (let id in relation) {
			if (!relation.hasOwnProperty(id)) continue;
			if (id in this.relation) pushNew(this.relation[id], relation[id])
			else this.relation[id] = relation[id];
		}
  }

  // Completely removes the passed node from the target nodes of any source node
  // in this relation.
  removeTargetFromRelation(targetNode) {
    let t = asArray(targetNode);
    for (let id in this.relation) {
      this.relation[id] = this.relation[id].filter(n => t.includes(n));
    }
  }
}
