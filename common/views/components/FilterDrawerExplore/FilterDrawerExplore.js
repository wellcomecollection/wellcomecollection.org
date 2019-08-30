const workTypes = [
  {
    title: 'texts',
    materialTypes: [
      { title: 'books', letter: 'a' },
      { title: 'e-books', letter: 'v' },
      { title: 'manuscripts, asian', letter: 'b' },
      { title: 'e-manuscripts, asian', letter: 'x' },
      { title: 'journals', letter: 'd' },
      { title: 'e-journals', letter: 'j' },
      { title: 'student dissertations', letter: 'w' },
      { title: 'music', letter: 'c' },
    ],
  },
  {
    title: 'visuals',
    materialTypes: [
      { title: 'pictures', letter: 'k' },
      { title: 'digital images', letter: 'q' },
      { title: 'maps', letter: 'e' },
      { title: 'ephemera', letter: 'l' },
    ],
  },
  {
    title: 'media',
    materialTypes: [
      { title: 'e-videos', letter: 'f' },
      { title: 'e-sound', letter: 's' },
      { title: 'videorecording', letter: 'g' },
      { title: 'sound', letter: 'i' },
      { title: 'cinefilm', letter: 'n' },
    ],
  },
  {
    title: 'objects',
    materialTypes: [
      { title: '3D objects', letter: 'r' },
      { title: 'mixed materials', letter: 'p' },
      { title: 'CD-ROMs', letter: 'm' },
    ],
  },
];

export function subcategoriesForWorkType(title: string) {
  const category = workTypes.find(wt => wt.title === title);

  return (category && category.materialTypes) || [];
}

function doArraysOverlap(arr1, arr2) {
  return arr1.some(t => arr2.includes(t));
}

export function categoryTitleForWorkTypes(workTypesArray: any[]) {
  const category = categoryForWorkTypes(workTypesArray);

  return category ? category.title : '';
}

function categoryForWorkTypes(workTypesArray) {
  return workTypes.find(wt => {
    const wtLetters = wt.materialTypes.map(a => a.letter);

    return doArraysOverlap(wtLetters, workTypesArray);
  });
}

function updateWorkTypes(workType, subcategory, isFiltering) {
  const activeWorkType = workTypes.find(
    t => t.title === categoryTitleForWorkTypes(workType)
  );

  if (isFiltering) {
    // If you're filtering and about to remove the last filter,
    // we give you all the results for the category
    if (isLastFilterItem(workType, subcategory)) {
      return activeWorkType && activeWorkType.materialTypes.map(t => t.letter);
    }
    // Otherwise add/remove items to the array
    return workType.includes(subcategory.letter)
      ? workType.filter(t => t !== subcategory.letter)
      : workType.concat(subcategory.letter);
  }

  // Not yet filtering, just add the single subcategory
  return [subcategory.letter];
}

function isLastFilterItem(workType, subcategory) {
  return workType.length === 1 && workType.includes(subcategory.letter);
}

function lettersForParentCategory(workType) {
  const category = categoryForWorkTypes(workType);

  return category ? category.materialTypes.map(m => m.letter) : [];
}

function FilterDrawerExplore() {
  return <div>yoyo</div>;
}

export default FilterDrawerExplore;
