// Use to create trees from simple string representations.
// Takes a builder (probably TreeBuilder).
export default class StringParseDirector {
  constructor(builder) {
    this.builder = builder;
  }

  construct(str = "") {
    this.builder.start();
    for (let i=0; i<str.length; i++) {
      var char = str[i];
      if (char == '[') {
        this.builder.createChild();
      }
      else if (char == ',') {
        this.builder.createSibling();
      }
      else if (char == ']') {
        this.builder.finishSiblings();
      }
      else {
        this.builder.setValue(char);
      }
    }
    return this.builder.getResult();
  }
}
