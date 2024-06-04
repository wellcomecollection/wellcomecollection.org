// Place to store id's of prismic of dynamic content if required.
// We can always reference all hardcoded prismic id where they are called and remove them later to maintain

export const homepageId = 'XphUbREAACMAgRNP';

export const collectionVenueId = {
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

export const prismicPageIds = {
  aboutUs: 'Wuw2MSIAACtd3Stq',
  access: 'Wvm2uiAAAIYQ4FHP',
  bookingAndAttendingOurEvents: 'Wuw19yIAAK1Z3Sng',
  collections: 'YBfeAhMAACEAqBTx',
  contactUs: 'YVMbEBAAAPaMBrz7',
  cookiePolicy: 'ZlCaVRAAACQAD2uX',
  copyrightClearance: 'YGSEhxAAACgAXL4E',
  covidWelcomeBack: 'X5amzBIAAB0Aq6Gm',
  dailyGuidedTours: 'Wuw19yIAAK1Z3Sma',
  getInvolved: 'YDaZmxMAACIAT9u8',
  gettingHere: 'X0TZOhAAACkAPkxz',
  library: 'Wuw19yIAAK1Z3Smm',
  openingTimes: 'WwQHTSAAANBfDYXU',
  press: 'WuxrKCIAAP9h3hmw',
  register: 'X_2eexEAACQAZLBi',
  schools: 'Wuw2MSIAACtd3StS',
  userPanel: 'YH17kRAAACoAyWTB',
  venueHire: 'Wuw2MSIAACtd3SsC',
  visitUs: 'X8ZTSBIAACQAiDzY',
  whatsOn: 'YD_IQxAAACUAK6HG',
  whatWeDo: 'WwLGFCAAAPMiB_Ps',
  youth: 'Wuw2MSIAACtd3Ssg',
};

export const eventPolicyIds = {
  schoolBooking: 'W4Vx5h4AACIAehqz',
};

export const getNameFromCollectionVenue = id => {
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
