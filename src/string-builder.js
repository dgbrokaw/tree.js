// Inverse of TreeBuilder class.
export default class StringBuilder {
  constructor() {
    this._str = null;
  }

  start() {
    this._str = "";
  }

  setValue(node) {
    this._str += node.value;
  }

  createChild(node) {
    this._str += "[";
  }

  createSibling(node) {
    this._str += ",";
  }

  finishSiblings(node) {
    this._str += "]";
  }

  getResult() {
    return this._str;
  }
}
