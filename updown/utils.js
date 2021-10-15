"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDuplicates = void 0;
function checksAreEqual(check1, check2) {
    var areEqual = true;
    for (var key in check1) {
        if (check1[key] !== check2[key]) {
            areEqual = false;
            break;
        }
    }
    return areEqual;
}
function removeDuplicates(targetArray, comparisonArray) {
    return targetArray.filter(function (targetCheck) {
        return !comparisonArray.some(function (check) {
            return checksAreEqual(targetCheck, check);
        });
    });
}
exports.removeDuplicates = removeDuplicates;
