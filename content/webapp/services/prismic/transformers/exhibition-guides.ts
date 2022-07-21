import { ExhibitionGuide } from '../../../types/exhibition-guides';
import { ExhibitionGuidePrismicDocument } from '../types/exhibition-guides';
import groupBy from 'lodash.groupby';

// TODO Model maybe we could do away with number field? - would need hasNumber field instead
// const testComponentData = [
//   {
//     title: 'Section One',
//     partOf: undefined,
//   },
//   { title: 'Stop One', partOf: 'Section One' },

//   { title: 'Stop Two', partOf: 'Section One' },
//   {
//     title: 'Sub Section One',
//     partOf: 'Section One',
//   },
//   { title: 'Stop Three', partOf: 'Sub Section One' },
//   { title: 'Stop Four', partOf: 'Sub Section One' },
//   {
//     title: 'Sub sub Section One',
//     partOf: 'Sub Section One',
//   },
//   { title: 'Stop Five', partOf: 'Sub sub Section One' },
//   { title: 'Stop Six', partOf: undefined }, // 'Sub sub Section One' // TODO stop it breaking if this happens
//   {
//     title: 'Sub Section Two',
//     partOf: 'Section One',
//   },
//   { title: 'Stop Seven', partOf: 'Sub Section Two' },
//   { title: 'Stop Eight', partOf: 'Section One' },
// ];

// expect
// [
//   {
//     title: 'Section One',
//     contains: [
//       { title: 'Stop One' },
//       { title: 'Stop Two' },
//       {
//         title: 'Sub Section One',
//         contains: [
//           { title: 'Stop Three' },
//           { title: 'Stop Four' },
//           {
//             title: 'Sub Sub Section One',
//             contains: [{ title: 'Stop Five' }, { title: 'Stop Six' }],
//           },
//         ],
//       },
//       {
//         title: 'Sub Section Two',
//         contains: [{ title: 'Stop Seven' }],
//       },
//     ],
//   },
//   { title: 'Stop Eight' },
// ];

// TODO this function will become part of the transform code
// TODO write some tests for this function
// try different ordering
// try some without partOf
function constructHierarchy(components) {
  // TODO we'll need this if we want to create accordian menus for sections etc.
  // TODO type function
  // TODO what happens if partOf left off other stuff? - could we use order to determine with guide or should be part of Guide
  // if first item it is Guide, subsequent items are part of guide
  const groupedSections = groupBy(components, component => {
    const partOf = component.partOf;
    if (!partOf) {
      return 'Guide';
    }
    return partOf;
  });
  const levels = Object.keys(groupedSections).length;
  for (let level = 0; level < levels; level++) {
    for (const [key, value] of Object.entries(groupedSections)) {
      const itemsWithParts = value.map(item => {
        const { partOf, ...restOfItem } = item;
        return {
          ...restOfItem,
          parts: groupedSections[item.title],
        };
      });
      groupedSections[key] = itemsWithParts;
    }
  }

  return groupedSections?.['Guide'];
}

export function transformGuide(
  document: ExhibitionGuidePrismicDocument
): ExhibitionGuide {
  const { data } = document;
  // TODO transform all the bits
  return {
    type: 'exhibition-guides',
  };
}
