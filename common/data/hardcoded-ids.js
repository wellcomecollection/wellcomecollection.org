// Place to store id's of prismic of dynamic content if required.
// We can always reference all hardcoded prismic id where they are called and remove them later to maintain

const homepageId = 'XphUbREAACMAgRNP';

const collectionVenueId = {
  galleries: {
    id: 'Wsttgx8AAJeSNmJ4',
    name: 'Galleries',
  },
  libraries: {
    id: 'WsuS_R8AACS1Nwlx',
    name: 'Library',
  },
  shop: {
    id: 'WsuaIB8AAH-yNylo',
    name: 'Shop',
  },
  café: {
    id: 'WsuZKh8AAOG_NyUo',
    name: 'Café',
  },
  readingRoom: {
    id: 'Wvlk4yAAAB8A3ufp',
  },
};

const prismicPageIds = {
  covidWelcomeBack: 'X5amzBIAAB0Aq6Gm',
  whatWeDo: 'WwLGFCAAAPMiB_Ps',
  visitUs: 'X8ZTSBIAACQAiDzY',
  collections: 'YBfeAhMAACEAqBTx',
  whatsOn: 'YD_IQxAAACUAK6HG',
  getInvolved: 'YDaZmxMAACIAT9u8',
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

const eventPolicyIds = {
  schoolBooking: 'W4Vx5h4AACIAehqz',
};

const getNameFromCollectionVenue = id => {
  // check the keys and returns back name based on id
  for (const [key, value] of Object.entries(collectionVenueId)) {
    if (value && value.id === id) {
      return collectionVenueId[key].name;
    }
  }
};

const sectionLevelPages = [
  prismicPageIds.visitUs,
  prismicPageIds.collections,
  prismicPageIds.getInvolved,
];

// The only series that uses the `webcomics` type.
const bodySquabblesSeries = 'WleP3iQAACUAYEoN';

module.exports = {
  homepageId,
  collectionVenueId,
  prismicPageIds,
  eventPolicyIds,
  getNameFromCollectionVenue,
  sectionLevelPages,
  bodySquabblesSeries,
};