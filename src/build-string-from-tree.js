import stringifyTree from "./stringify.js";

export default class TreeSerializeDirector {
  constructor(builder) {
    this.builder = builder;
  }

  construct(tree) {
    this.builder.start();
    let bldr = this.builder;
    let f = function(node) {
      bldr.setValue(node);
      console.log("value: " + node.value + ", ch: " + (node.hasChildren() ? node.children.length : 0));
      node.children.forEach(child => {
        if (!child.ls) {
          bldr.createChild(child);
        }
        else {
          bldr.createSibling(child);
        }
        f(child);
        if (!child.rs) {
          bldr.finishSiblings();
        }
      });
    }
    f(tree);
    return this.builder.getResult();
  }
}
