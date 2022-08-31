// Place to store id's of prismic of dynamic content if required.
// We can always reference all hardcoded prismic id where they are called and remove them later to maintain

export const homepageId = 'XphUbREAACMAgRNP';

// The ID of the series that's featured on the /stories page.
//
// Ideally, this should be configurable in Prismic or by the content team,
// to take devs out of the loop.
export const featuredStoriesSeriesId = 'YnjwNRAAACIAHakp';

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
  whatWeDo: 'WwLGFCAAAPMiB_Ps',
  visitUs: 'X8ZTSBIAACQAiDzY',
  collections: 'YBfeAhMAACEAqBTx',
  whatsOn: 'YD_IQxAAACUAK6HG',
  getInvolved: 'YDaZmxMAACIAT9u8',
  stories: 'YD_E-BAAACEAK5LX',
  aboutUs: 'Wuw2MSIAACtd3Stq',
  copyrightClearance: 'YGSEhxAAACgAXL4E',
  register: 'X_2eexEAACQAZLBi',
  access: 'Wvm2uiAAAIYQ4FHP',
  bookingAndAttendingOurEvents: 'Wuw19yIAAK1Z3Sng',
  contactUs: 'YVMbEBAAAPaMBrz7',
  dailyGuidedTours: 'Wuw19yIAAK1Z3Sma',
  gettingHere: 'WwabUiAAAHQXGNHB',
  library: 'Wuw19yIAAK1Z3Smm',
  openingTimes: 'WwQHTSAAANBfDYXU',
  press: 'WuxrKCIAAP9h3hmw',
  schools: 'Wuw2MSIAACtd3StS',
  userPanel: 'YH17kRAAACoAyWTB',
  venueHire: 'Wuw2MSIAACtd3SsC',
  youth: 'Wuw2MSIAACtd3Ssg',
};

export const getNameFromCollectionVenue = (id: string): string | undefined => {
  // check the keys and returns back name based on id
  for (const [key, value] of Object.entries(collectionVenueId)) {
    if (value && value.id === id) {
      return collectionVenueId[key].name;
    }
  }
};

export const sectionLevelPages = [
  prismicPageIds.visitUs,
  prismicPageIds.collections,
  prismicPageIds.getInvolved,
];

// The only series that uses the `webcomics` type.
export const bodySquabblesSeries = 'WleP3iQAACUAYEoN';
