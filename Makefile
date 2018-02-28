JS_COMPILER = ./node_modules/.bin/uglifyjs
TESTER = ./node_modules/.bin/nodeunit

all: tree.min.js

test: src/tree.js
	$(TESTER) test/tree-test.js

test-cov: src/tree.js
	./node_modules/.bin/istanbul cover \
	  $(TESTER) -- test/tree-test.js

tree.min.js: src/tree.js Makefile
	@rm -f $@
	$(JS_COMPILER) < src/tree.js > $@

clean:
	rm -f tree.min.js

.PHONY: all clean test test-w test-cov
