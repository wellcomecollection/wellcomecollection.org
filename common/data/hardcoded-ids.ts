// Place to store id's of prismic of dynamic content if required.
// We can always reference all hardcoded prismic id where they are called and remove them later to maintain

export const homepageId = 'homepage';

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
  aboutUs: 'about-us',
  access: 'accessibility',
  bookingAndAttendingOurEvents: 'booking-and-attending-our-events',
  cafe: 'cafe',
  collections: 'collections',
  contactUs: 'contact-us',
  cookiePolicy: 'cookie-policy',
  dailyGuidedTours: 'daily-guided-tours-and-discussions',
  getInvolved: 'get-involved',
  gettingHere: 'getting-here',
  library: 'the-library',
  openingTimes: 'opening-times',
  press: 'media-office',
  register: 'library-membership',
  schools: 'schools',
  shop: 'shop',
  userPanel: 'user-panel',
  venueHire: 'venue-hire',
  visitUs: 'visit-us',
  whatsOn: 'whats-on',
  youth: 'young-people',
};

export const eventPolicyIds = {
  schoolBooking: 'W4Vx5h4AACIAehqz',
  dropIn: 'W3RJeikAACIAF2Mw',
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

// The only series ("webcomic series") that uses the `webcomics` type.
export const bodySquabblesSeries = 'body-squabbles';
