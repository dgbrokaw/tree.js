import Node from "./tree-node.js";

// Use for creating trees. Start the construction, then add nodes.
// Stores the result until start is called again. Use with a build
// director (StringParseDirector).
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
    this.current = this._top;
  }

  createChild() {
    this.current = this.current.append(this.createNode());
  }

  createSibling() {
    if (!this.current.parent) {
      throw "[TreeBuilder] Error: cannot create siblings for the top node.";
    }
    this.current = this.current.parent.append(this.createNode());
  }

  finishSiblings() {
    if (this._current === this._top) {
      throw "[TreeBuilder] Error: unexpected input.";
    }
    this._current = this._current.parent;
  }

  setValue(value) {
    this._current.value += value;
  }

  getResult() {
    return this._top;
  }
}
