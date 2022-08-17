// This is a very simple diffing tool for JSON.
//
// It works by "subtracting" common key/value pairs from two JSON objects, and returning
// only the differing keys.
//
// e.g. if you had two JSON objects
//
//      {"name": "pentagon", "colour": "red", "sides": 5}
//      {"name": "hexagon", "colour": "red", "sides": 6}
//
// then it would "subtract" the common `"colour": "red"` pair and return a diff:
//
//      {
//        oldRecordOnly: {"name": "pentagon", "sides": 5},
//        newRecordOnly: {"name": "hexagon", "sides": 6}
//      }
//

import chalk from 'chalk';

export type Delta = {
  oldRecordOnly: Record<string, any>;
  newRecordOnly: Record<string, any>;
};

const EmptyDelta = {
  oldRecordOnly: {},
  newRecordOnly: {},
};

export const isEmpty = (d: Delta): boolean =>
  Object.keys(d.oldRecordOnly).length === 0 &&
  Object.keys(d.newRecordOnly).length === 0;

const oldRecordOnly = {};
const newRecordOnly = {};

export const diffJson = (oldR: Object, newR: Object): Delta => {
  // If they're the same, there's nothing to do!

  if (oldR === newR) {
    return EmptyDelta;
  }

  for (const key of Object.keys(oldR)) {
    // If both objects have the key and it's the same, there's nothing to do
    //
    // Casting them to JSON (which is where they started) and comparing strings is
    // easier than doing object comparisons in JavaScript.
    if (
      key in newR &&
      JSON.stringify(newR[key]) === JSON.stringify(oldR[key])
    ) {
      continue;
    }
    // If the keys have different values and they're both objects, recurse down
    // and compute another diff.  Because we only did JSON serialisation above,
    // these two objects may turn out to be the same anyway.
    else if (
      key in newR &&
      typeof oldR[key] === 'object' &&
      typeof newR[key] === 'object'
    ) {
      const delta = diffJson(oldR[key], newR[key]);

      if (delta.newRecordOnly.length > 0 || delta.oldRecordOnly.length > 0) {
        oldRecordOnly[key] = delta.oldRecordOnly;
        newRecordOnly[key] = delta.newRecordOnly;
      }
    }
    // If the keys have different values and they're not objects, record their
    // value and move on.
    else if (key in newR) {
      oldRecordOnly[key] = oldR[key];
      newRecordOnly[key] = newR[key];
    }
    // Otherwise the key isn't in the new record at all, so record that.
    else {
      oldRecordOnly[key] = oldR[key];
    }
  }

  for (const key of Object.keys(newR)) {
    if (!(key in oldR)) {
      newRecordOnly[key] = newR[key];
    }
  }

  return { oldRecordOnly, newRecordOnly };
};

export const printDelta = (delta: Delta): void => {
  console.info('------------------------');

  console.info('Only in the remote type; this will be deleted/changed:');
  const remoteJson = JSON.stringify(delta.oldRecordOnly, null, 2);
  console.log(chalk.red(remoteJson));

  console.info('');

  console.info('Only in the local type; this will be added/updated:');
  const localJson = JSON.stringify(delta.newRecordOnly, null, 2);
  console.log(chalk.green(localJson));

  console.info('------------------------');
};
