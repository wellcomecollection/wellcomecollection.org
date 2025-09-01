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
  newCollections: 'collections-landing', // TODO eventually rename collections when it switches over
  contactUs: 'contact-us',
  cookiePolicy: 'cookie-policy',
  dailyGuidedTours: 'daily-guided-tours-and-discussions',
  getInvolved: 'get-involved',
  gettingHere: 'getting-here',
  library: 'the-library',
  openingTimes: 'opening-times',
  press: 'press',
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

// TODO: check if it works with their ID and not just their UID
// TODO: only use this and not the page format? Or the other way around?
export const sectionLevelPages = [
  prismicPageIds.visitUs,
  prismicPageIds.whatsOn,
  'stories',
  prismicPageIds.collections,
  prismicPageIds.getInvolved,
  prismicPageIds.aboutUs,
];

// The only series ("webcomic series") that uses the `webcomics` type.
export const bodySquabblesSeries = 'body-squabbles';

// We use this to add an icon when displaying the type of interpretation available for an event,
// e.g. in the yellow box on the event page.
// Prior to this we displayed an icon if the the camelized title of the interpretation type matched the name of an icon.
// This wasn't very robust and some icons were not displayed when they probably should have been.
// We now use the prismic id of the interpretation type to determine the icon to display.
// N.B. Not all interpretation types have an obvious icon.
// Some have a possible icon that wouldn't have displayed using the old method,
// these are currently left without an icon until we can confirm which is correct before adding.
// See https://github.com/wellcomecollection/wellcomecollection.org/issues/11704
export const interpretationTypeIconMap = [
  {
    name: 'speechToTextOnline',
    prismicId: 'YqiCnxEAACMA8VLW',
    iconName: undefined,
  },
  { name: 'autoCaptioned', prismicId: 'X2jPiRMAACIA8Vzo', iconName: undefined },
  {
    name: 'britishSignLanguageOnline',
    prismicId: 'X2smLBMAACMA-99Z',
    iconName: 'britishSignLanguageOnline',
  },
  {
    name: 'speechToText',
    prismicId: 'WmXl4iQAACUAnyDr',
    iconName: 'speechToText',
  },
  {
    name: 'hearingLoop',
    prismicId: 'ZuBa6xEAAB4AgZkw',
    iconName: 'inductionLoop',
  },
  {
    name: 'limitedAudioDescription',
    prismicId: 'X2jPZRMAACEA8VxE',
    iconName: undefined,
  },
  {
    name: 'britishSignLanguage',
    prismicId: 'XkFGqxEAACIAIhNH',
    iconName: 'britishSignLanguage',
  },
  {
    name: 'wheelchairAccessible',
    prismicId: 'YkRhDBAAACAAvSvl',
    iconName: undefined,
  }, // use 'accessible'?
  {
    name: 'audioDescribed',
    prismicId: 'WmXhziQAACQAnw7i',
    iconName: 'audioDescribed',
  },
  { name: 'relaxed', prismicId: 'W5JXVSYAACYAGtkh', iconName: undefined },
];
