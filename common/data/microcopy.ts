// This is microcopy on the site that's hard-coded, rather than fetched from Prismic.
//
// We try to keep it in one place for a few reasons:
//
//    - All this text can be reviewed for consistency
//    - It's easier for non-developers to work out if something is hard-coded, and isn't
//      something they can update on their own, e.g. if the Editorial team are wondering
//      why they can't update some text in Prismic.
//    - This file is simple enough that a non-developer with a GitHub account might be
//      able to edit it themselves, using the GitHub web interface.
//

export const pageDescriptions = {
  articles:
    'Our words and pictures explore the connections between science, medicine, life and art. Dive into one no matter where in the world you are.',
  books:
    'We publish thought-provoking books exploring health and human experiences.',
  events:
    'Our events take place both online and in our building. Choose from an inspiring range of free talks, discussions and more.',
  exhibitions:
    'Explore the connections between science, medicine, life and art through our permanent and temporary exhibitions. Admission is always free.',
  guides: 'Guides intro text...',
  homepage:
    'Visit our free museum and library in central London connecting science, medicine, life and art. Explore our exhibitions, live events, gallery tours and café. Fully accessible.',
  stories:
    'Our words and pictures explore the connections between science, medicine, life and art. Dive into a story no matter where in the world you are.',
  userPanel:
    'Get involved in shaping better website and gallery experiences for everyone. We’re looking for people to take part in online and in-person interviews, usability tests, surveys and more.',
  whatsOn:
    'Discover all of the exhibitions, events and more on offer at Wellcome Collection, a free museum and library exploring health and human experience.',
};

export const defaultPageTitle =
  'A free museum and library exploring health and human experience';

export const homepageHeading =
  'A free museum and library exploring health and human experience';

export const newsletterDescription =
  'Sign up for news and information from Wellcome Collection';

export const booksPromoOnStoriesPage =
  'Get stuck into one of our books, and explore the complexities of the human condition.';

export const a11y = {
  stepFreeAccess: 'Step-free access is available to all floors of the building',
  largePrintGuides:
    'Large-print guides, transcripts and magnifiers are available in the gallery',
};

export const errorMessages = {
  404: 'This isn’t the page you’re looking for, but how about these?',
  500: 'This isn’t the page you’re looking for, but how about these?',
};

export const wellcomeImagesRedirectBanner =
  'Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we’re working to improve data quality, search relevance and tools to help you use these images more easily.';

export const unavailableImageMessage =
  'We are working to make this image available online.';

// Messages used in a user's list of item requests
// See https://github.com/wellcomecollection/wellcomecollection.org/issues/7660
//
//      When you place a request for an item, the item is shown in your account alongside a status.
//
//      current copy (sierra status)                            -- New copy
//      on hold (0).                                            -- Request processing
//      bib hold ready for pickup (b).                          -- Available to view
//      volume hold ready for pickup (j).                       -- Available to view
//      item ready for pickup (i)                               -- Available to view
//      bib, item or volume in transit to pickup location. (t)  -- In transit
//
export const sierraStatusCodeToLabel = {
  // statusCode (status.id): new label,
  '0': 'Request processing',
  b: 'Available to view',
  j: 'Available to view',
  i: 'Available to view',
  t: 'In transit',
};

export const defaultRequestErrorMessage =
  'There was a problem requesting this item. Please contact Library Enquiries (library@wellcomecollection.org).';

// on an item page, under 'Where to find it', we wanted to make the Access Method label more readable
// right now the only change is for 'Not requestable', but we can also now change how the other
// options appear
export const sierraAccessMethodtoNewLabel = {
  // accessCondition label : new label,
  'Not requestable': "Can't be requested",
  'Manual request': 'Manual request',
  'Online request': 'Online request',
};

export const inOurBuilding = 'In our building';
