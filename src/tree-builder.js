import Node from "./tree-node.js";

export default class TreeBuilder {
  constructor() {
    this._top = null;
    this._current = null;
  }

  createNode() {
    return new Node();
  }

  get current() {
    return this._current;
  }

  set current(node) {
    this._current = node;
    this._current.value = "";
  }

  start() {
    this._top = this.createNode();
    this._current = this._top; // no set value in top node
  }

  createChild() {
    this.current = this.current.append(this.createNode());
  }

  createSibling() {
    if (!this.current.parent) {
      throw "[TreeBuilder] Error while parsing input: parent not found.";
    }
    this.current = this.current.parent.append(this.createNode());
  }

  finishSiblings() {
    this._current = this._current.parent;
    if (this._current === this._top) {
      throw "[TreeBuilder] Error while parsing input: siblings broken.";
    }
  }

  setValue(value) {
    if (this.current === this._top) {
      throw "[TreeBuilder] Error while parsing input: setting value of top.";
    }
    this._current.value += value;
  }

  // WARNING: removes the references to the top node. Further construction can
  // produce unexpected results or exceptions.
  getResult() {
    for (let i=0; i<this._top.children.length; i++) {
      this._top.children[i].parent = null;
    }
    if (this._top.children.length === 1) {
      return this._top.children[0];
    }
    else {
      return this._top.children;
    }
  }
}
