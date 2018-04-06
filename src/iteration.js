import DepthFirstTreeIterator from "./iterator-depth-first.js";

// Defines some iteration methods. Uses depth-first traversal by default.
// If the Node passed into the method provides its own iterator, that one is
// used instead.
export function createIterator(tree) {
  let tr = tree;
  let it = null;
  if (Array.isArray(tr) && tr.length > 0) {
    tr = tr[0];
  }
  if (tr.iterator) {
    it = tr.iterator;
  }
  else {
    it = DepthFirstTreeIterator;
  }
  return new it(tree);
}

export function forEach(fn, tree) {
  let it = createIterator(tree);
  it.traverse(fn);
}

export function map(fn, tree) {
  let it = createIterator(tree);
  return it.traverse(fn);
}

export function filter(selector, tree) {
  let it = createIterator(tree);
  return it.traverse(null, selector);
}

export function select(selector, tree) {
  let it = createIterator(tree);
  return it.select(selector);
}

export function filterRange(selector, tree, noOverlap) {
  let it = createIterator(tree);
  return it.traverseRange(null, selector, noOverlap);
}

export function getAllNodes(tree) {
  return filter(null, tree);
}

export function getLeafNodes(tree) {
  return filter(n => !n.hasChildren(), tree);
}

export function filterByValue(value, tree) {
  return filter(n => n.value === value, tree);
}

export function selectById(id, tree) {
  return select(n => n.id === id, tree);
}
