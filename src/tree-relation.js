import mapBetweenTrees from "./map.js";

export default class TreeRelation {
  constructor(sourceTree, targetTree) {
    this.relation = {};
    if (sourceTree && targetTree) {
      this.relation = mapBetweenTrees(sourceTree, targetTree);
    }
  }
}
