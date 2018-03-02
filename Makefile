JS_COMPILER = ./node_modules/.bin/uglifyjs
TESTER = ./node_modules/.bin/nodeunit

all: tree.min.js

test: src/index.js
	$(TESTER) test/tree-test.js

test-cov: src/index.js
	./node_modules/.bin/istanbul cover \
	  $(TESTER) -- test/tree-test.js

tree.min.js: src/tree.js src/tree-node.js Makefile
	@rm -f $@
	$(JS_COMPILER) < src/tree.js src/tree-node.js > $@

clean:
	rm -f tree.min.js

.PHONY: all clean test test-w test-cov
