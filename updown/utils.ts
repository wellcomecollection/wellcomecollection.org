import { Check } from './checks';

function checksAreEqual(check1: Check, check2: Check): boolean {
  let areEqual = true;
  for (const value in check1) {
    if (check1[value] !== check2[value]) {
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
