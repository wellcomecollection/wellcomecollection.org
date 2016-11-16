import parseBody from './parse-body';

// We could do this automatically with `fs`, but that's unnecessary I/O
// And doesn't allow us to exclude some.
module.exports = new Map([
  ['parseBody', parseBody]
]);
