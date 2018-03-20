var DepthFirstTreeIterator = require("../dist/index.js").DepthFirstTreeIterator;

exports["DepthFirstTreeIterator: constructor"] = function(test) {
  var iterator = new DepthFirstTreeIterator();
  test.done();
}
