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

export function removeDuplicates(
  targetArray: Check[],
  comparisonArray: Check[]
): Check[] {
  return targetArray.filter(targetCheck => {
    return !comparisonArray.some(check => {
      return checksAreEqual(targetCheck, check);
    });
  });
}
