// When creating the contributors model for articles, we didn't know that you
// wouldn't be able to query by the slice. This moves it into a `Group` where
// we can
module.exports = {
  filter({filename, doc}) {
    return doc.type === 'articles';
  },
  map({filename, doc}) {
    // Old contributors shape
    // "contributors": [
    //   {
    //     "key": "person$9626c83c-d35c-4ee0-82da-454acdb218d7",
    //     "value": {
    //       "repeat": [],
    //       "non-repeat": {
    //         "role": {
    //           "id": "WcUWeCgAAFws-nGh",
    //           "mask": "editorial-contributor-roles",
    //           "wioUrl": "wio://documents/WcUWeCgAAFws-nGh"
    //         },
    //         "person": {
    //           "id": "Wov-_SoAACsAXmrz",
    //           "mask": "people",
    //           "wioUrl": "wio://documents/Wov-_SoAACsAXmrz"
    //         }
    //       }
    //     }
    //   }
    // ]

    // New contributors shape
    // "contributors": [
    //   {
    //     "role": {
    //       "id": "WoGaByoAACsAMY5g",
    //       "mask": "editorial-contributor-roles",
    //       "wioUrl": "wio://documents/WoGaByoAACsAMY5g"
    //     },
    //     "contributor": {
    //       "id": "WoGTvSoAACoAMXK-",
    //       "mask": "organisations",
    //       "wioUrl": "wio://documents/WoGTvSoAACoAMXK-"
    //     }
    //   }
    // ]
    const contributorsDeprecated = doc.contributors;
    const contributors = contributorsDeprecated.map(contributor => ({
      role: contributor.value['non-repeat'].role,
      contributor: contributor.value['non-repeat'].person
    }));

    doc.contributors = contributors;

    return {doc, filename};
  }
};
