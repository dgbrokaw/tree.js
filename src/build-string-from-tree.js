// Inverse of the StringParseDirector class.
export default class TreeSerializeDirector {
  constructor(builder) {
    this.builder = builder;
  }

  construct(tree) {
    this.builder.start();
    let bldr = this.builder;
    let f = function(node) {
      bldr.setValue(node);
      node.children.forEach(child => {
        if (!child.ls) {
          bldr.createChild();
        }
        else {
          bldr.createSibling();
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
