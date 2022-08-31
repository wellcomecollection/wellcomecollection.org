import { CheckOptions } from 'node-updown/lib/types/Check';
import { Check } from './checks';

type CheckKey = keyof Check;

function checksAreEqual(check1: Check, check2: Check): boolean {
  let areEqual = true;
  for (const key in check1) {
    if (check1[key as CheckKey] !== check2[key as CheckKey]) {
      areEqual = false;
      break;
    }
  }
  return areEqual;
}

function removeDuplicates<T extends { url: string }>(
  targetArray: T[],
  comparisonArray: { url: string }[]
): T[] {
  return targetArray.filter(targetCheck => {
    return !comparisonArray.some(check => {
      return targetCheck.url === check.url;
    });
  });
}

export function getDeltas(
  currentChecks: Check[],
  expectedChecks: CheckOptions[]
): {
  deletions: Check[];
  updates: Check[];
  additions: CheckOptions[];
} {
  // deletions: any URLs in the current checks, not in the expected checks
  const deletions = removeDuplicates(currentChecks, expectedChecks);

  // additions: any URLs in the expected checks, not in the current checks
  const additions = removeDuplicates(expectedChecks, currentChecks);

  // updates: any URLs in the current checks and expected checks with different data
  // return the tokened updated checks
  const updates = expectedChecks
    .map(expectedCheck => {
      const matchingCheck = currentChecks.find(
        currentCheck => currentCheck.url === expectedCheck.url
      );

      const tokenedMatchingCheck = matchingCheck
        ? {
            ...expectedCheck,
            token: matchingCheck.token,
          }
        : undefined;

      return matchingCheck &&
        tokenedMatchingCheck &&
        !checksAreEqual(tokenedMatchingCheck, matchingCheck)
        ? tokenedMatchingCheck
        : undefined;
    })
    .filter(Boolean) as Check[];

  return {
    deletions,
    updates,
    additions,
  };
}
