function checksAreEqual(check1, check2) {
  let areEqual = true;
  for (var value in check1) {
    if (check1[value] !== check2[value]) {
      areEqual = false;
      break;
    }
  }
  return areEqual;
}

export function removeDuplicates(targetArray, comparisonArray) {
  return targetArray.filter(targetCheck => {
    return !comparisonArray.some(check => {
      return checksAreEqual(targetCheck, check);
    });
  });
}
