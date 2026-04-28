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
  // The following pages are not for the general public and we use their ids to prevent them from being indexed.
  // They will be eventually be removed, so this is a quick and temporary fix.
  inclusiveExhibitionDesignToolkit: [
    'XkaoyREAAAPkOiMf',
    'XkapExEAACIAOiRy',
    'XkapJBEAAAPkOiTE',
    'XkapMxEAACIAOiUM',
    'XkapPxEAACIAOiVH',
    'XkapTxEAACIAOiWN',
    'XkapWxEAANSqOiXK',
    'XkapaBEAACUAOiYI',
    'XkapfBEAAAPkOiZk',
    'XkaphxEAAAPkOiaa',
    'XkapkBEAAAPkOibJ',
  ],
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

export const thematicBrowsingPaths = {
  peopleAndOrganisations: `/${prismicPageIds.collections}/people-and-organisations`,
  places: `/${prismicPageIds.collections}/places`,
  typesAndTechniques: `/${prismicPageIds.collections}/types-and-techniques`,
  subjects: `/${prismicPageIds.collections}/subjects`,
} as const;

export const subjectCategories = [
  {
    path: 'mental-health',
    title: 'Mental health & the mind',
    prismicUid: 'subjects-mental-health',
    prismicId: 'ae9ocRIAACIA9RQz',
  },
  {
    path: 'the-human-body',
    title: 'The human body',
    prismicUid: 'subjects-the-human-body',
    prismicId: 'ae9okxIAACEA9RR6',
  },
  {
    path: 'public-health',
    title: 'Public health',
    prismicUid: 'subjects-public-health',
    prismicId: 'abGHbREAACAAi2gO',
  },
  {
    path: 'medical-care-and-practices',
    title: 'Medical care and practices',
    prismicUid: 'subjects-medical-care-and-practices',
    prismicId: 'aY2jMBAAACEAHkc6',
  },
  {
    path: 'sex-sexual-health-and-reproduction',
    title: 'Sex, sexual health and reproduction',
    prismicUid: 'subjects-sex-sexual-health-and-reproduction',
    prismicId: 'aaBgRBAAACMAxoYU',
  },
  {
    path: 'diseases-disorders-and-conditions',
    title: 'Diseases, disorders and conditions',
    prismicUid: 'subjects-diseases-disorders-and-conditions',
    prismicId: 'ae9otRIAACEA9RSz',
  },
  {
    path: 'the-natural-world-and-environment',
    title: 'The natural world and environment',
    prismicUid: 'subjects-the-natural-world-and-environment',
    prismicId: 'ae9pMBIAACEA9RWR',
  },
  {
    path: 'society-arts-and-culture',
    title: 'Society, arts and culture',
    prismicUid: 'subjects-society-arts-and-culture',
    prismicId: 'ae9pVxIAACEA9RXc',
  },
  {
    path: 'religion-spirituality-and-the-occult',
    title: 'Religion, spirituality and the occult',
    prismicUid: 'subjects-religion-spirituality-and-the-occult',
    prismicId: 'ae9pfxIAACQA9RYw',
  },
] as const;

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

// This is different to hasLandingPageFormat on the page model,
// which is true if there is a content list to display on the page.
// This is a hardcoded list of pages that we want to control the layout and Header of
export const officialLandingPagesUid = [
  prismicPageIds.visitUs,
  prismicPageIds.whatsOn,
  'stories',
  prismicPageIds.collections,
  prismicPageIds.getInvolved,
  prismicPageIds.aboutUs,
];

// The only series ("webcomic series") that uses the `webcomics` type.
export const bodySquabblesSeries = 'body-squabbles';

// Prismic document ID for the commissioning editor contributor role.
// Contributors with this role are displayed only at the end of articles,
// not in the top byline.
export const commissioningEditorRoleId = 'aKcVQBAAACIAhvXf';

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
