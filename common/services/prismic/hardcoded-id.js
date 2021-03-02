// @flow

// Place to store id's of prismic of dynamic content if required.
// We can always reference all hardcoded prismic id where they are called and remove them later to maintain

export const collectionVenueId = {
  galleries: {
    id: 'Wsttgx8AAJeSNmJ4',
    name: 'Galleries',
  },
  libraries: {
    id: 'WsuS_R8AACS1Nwlx',
    name: 'Library',
  },
  restaurant: {
    id: 'WsuYER8AAOG_NyBA',
    name: 'Restaurant',
  },
  shop: {
    id: 'WsuaIB8AAH-yNylo',
    name: 'Shop',
  },
  café: {
    id: 'WsuZKh8AAOG_NyUo',
    name: 'Café',
  },
};

export const prismicPageIds = {
  covidWelcomeBack: 'X5amzBIAAB0Aq6Gm',
  covidBookYourTicket: 'X5aomxIAAB8Aq6n5',
  whatWeDo: 'WwLGFCAAAPMiB_Ps',
  visitUs: 'X8ZTSBIAACQAiDzY',
  collections: 'YBfeAhMAACEAqBTx',
};

export const getNameFromCollectionVenue = (id: string) => {
  // check the keys and returns back name based on id
  for (const [key, value] of Object.entries(collectionVenueId)) {
    if (value && value.id === id) {
      return collectionVenueId[key].name;
    }
  }
};

export const noBackgroundLayoutGrid12 = [
  prismicPageIds.visitUs,
  prismicPageIds.whatWeDo,
  prismicPageIds.collections,
];
