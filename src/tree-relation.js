import asArray from "./helpers/as-array.js";
import pushNew from "./helpers/push-new.js";
import stringifyTree from "./stringify.js";
import mapBetweenTrees from "./map.js";

export default class TreeRelation {
  constructor(sourceTree, targetTree) {
    this.relation = {};
    if (sourceTree && targetTree) {
      this.init(sourceTree, targetTree);
    }
  }

  init(sourceTree, targetTree) {
    this.relation = (this.relationStrategy)(sourceTree, targetTree);
  }

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

  relateOne(sourceNode) {
    if (Array.isArray(sourceNode)) {
      return this.relate(sourceNode);
    }
    return this.relation[sourceNode.id][0];
  }

  toString() {
    let res = "";
    let first = true;
    for (var id in this.relation) {
      res += (!first ? "; " : "") + id + " ===> " + this.relation[id].map(n => n.value).join(', ');
      if (first) first = false;
    }
    return res;
  }

  update(sourceNode, targetNode) {
    asArray(sourceNode).forEach(n => {
      this.relation[n.id] = asArray(targetNode);
    });
  }

  extend(sourceNode, targetNode) {
    asArray(sourceNode).forEach(n => {
      pushNew(this.relation[n.id], asArray(targetNode));
    });
  }

  // WARNING: updating/extending with relations does not deep clone the
  // contents of the passed relation. Therefore the passed relation
  // should not be used on its own.
  updateWithRelation(relation) {
    Object.assign(this.relation, relation);
  }

  extendWithRelation(relation) {
    for (let id in relation) {
			if (!relation.hasOwnProperty(id)) continue;
			if (id in this.relation) pushNew(this.relation[id], relation[id])
			else this.relation[id] = relation[id];
		}
  }

  removeTargetFromRelation(targetNode) {
    let t = asArray(targetNode);
    for (let id in this.relation) {
      this.relation[id] = this.relation[id].filter(n => t.includes(n));
    }
  }

  get relationStrategy() {
    return mapBetweenTrees;
  }
}
