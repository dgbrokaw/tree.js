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

  createChild() {
    this._str += "[";
  }

  createSibling() {
    this._str += ",";
  }

  finishSiblings() {
    this._str += "]";
  }

  getResult() {
    return this._str;
  }
}
