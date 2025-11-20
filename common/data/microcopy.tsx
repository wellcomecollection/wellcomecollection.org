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

import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';

import { prismicPageIds } from './hardcoded-ids';

export const pageDescriptions = {
  articles:
    'Our words and pictures explore the connections between science, medicine, life and art. Dive into one no matter where in the world you are.',
  books:
    'We publish thought-provoking books exploring health and human experiences.',
  collections: {
    collections:
      'Over 1.1 million items exploring art, health, culture and what it means to be human',
    newOnline: 'TBD', // TODO
  },
  events:
    'Our events take place both online and in our building. Choose from an inspiring range of free talks, discussions and more.',
  exhibitionGuides:
    'Explore our exhibitions using your own device, with audio description, British Sign Language and gallery captions',
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
  comic:
    'Explore new perspectives on bodies, brains and health with our guest comic artists.',
  search: {
    overview:
      "Search Wellcome Collection's images, catalogue, stories and events to explore perspectives on health and human experiences.",
    stories:
      'Search for stories about health and human experience. Our words and pictures make connections, provoke new thinking and share lived experiences.',
    images:
      'Search for images about health and human experience. Our collections include paintings, photographs, engravings, etchings, illustrations and more.',
    works:
      'Search our collections about health and human experience. Our collections include books, manuscripts, visual materials, journals and unpublished archives.',
    concepts:
      'Search for themes related to health and human experience. Discover subjects, people, places and themes that connect our collections.',
    events:
      'Search for past and up-coming events to discover our range of free tours, talks, workshops and more.',
  },
};

export const pageDescriptionConcepts = (label: string): string => {
  return `Find books, manuscripts, paintings, illustrations, photos and unpublished archives about ${label}, many of them with free online access.`;
};

export const defaultPageTitle =
  'A free museum and library exploring health and human experience';

export const homepageHeading =
  'A free museum and library exploring health and human experience';

export const newsletterDescription =
  'Sign up for news and information from Wellcome Collection';

export const a11y = {
  stepFreeAccess: 'Step-free access is available to all floors of the building',
  largePrintGuides:
    'Large-print guides, transcripts and magnifiers are available in the gallery',
  bsl: 'British Sign Language videos are available',
  accessResources:
    'Access resources include a visual story, large print guides and audio description',

  // This message is hard-coded as part of the yellow box rather than specified
  // on the individual access notices for two reasons:
  //
  //  1. So we don't repeat it if we have lots of access information on an event
  //     See https://wellcome.slack.com/archives/CUA669WHH/p1664808905110529
  //
  //  2. So we always have it on events that don't have any access information, when
  //     it's arguably most important.
  //
  defaultEventMessage: (
    <>
      For more information, please visit our{' '}
      <a href={`/visit-us/${prismicPageIds.access}`}>Accessibility</a> page. If
      you have any queries about accessibility, please email us at{' '}
      <a href="mailto:access@wellcomecollection.org">
        access@wellcomecollection.org
      </a>{' '}
      or call{' '}
      {/*
        This is to ensure phone numbers are read in a sensible way by
        screen readers.
      */}
      <span className="visually-hidden">
        {createScreenreaderLabel('020 7611 2222')}
      </span>
      <span aria-hidden="true">020&nbsp;7611&nbsp;2222.</span>
    </>
  ),
};

export const wellcomeImagesRedirectBanner =
  'Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we’re working to improve data quality, search relevance and tools to help you use these images more easily.';

export const unavailableContentMessage =
  'We are working to make this content available online.';

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

export const itemRequestDialog = {
  pickupItemOn: 'The earliest available date to view this item is on',
  libraryClosedOnSunday:
    'Please bear in mind the library is closed on Sundays.',
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

export const requestingDisabled = (
  <>
    Requesting is temporarily unavailable while we perform maintenance work.
    <br />
    In the meantime, email library@wellcomecollection.org the details of your
    request and when you would like to consult it and we can retrieve the items
    for you.
  </>
);

export const pastExhibitionsStrapline =
  'Take a look at our past exhibitions and installations.';

// This is the label used in the search box, both for the
// search in the global nav and on the categories in wc.org/search
export const searchLabelText = {
  overview: 'Search for anything',
  stories: 'Search for stories',
  images: 'Search for images',
  works: 'Search the catalogue',
  concepts: 'Search for themes',
  events: 'Search for events',
};

export const visualStoryLinkText =
  'Information to help you plan and prepare for your visit';

export const exhibitionGuideLinkText =
  'Explore audio description, British Sign Language, captions and transcripts';

export const treeInstructions =
  'Tab into the tree, then use up and down arrows to move through tree items. Use right and left arrows to toggle sub menus open and closed. When focused on an item you can tab to the link it contains.';

export const bornDigitalWarning = (
  <p>
    Our born-digital items cover many file formats, some of which modern
    computer software may no longer support.{' '}
    <strong>
      We cannot guarantee that you can view the item once you have downloaded
      it.
    </strong>
  </p>
);
export const bornDigitalMessage = (
  <>
    <h2>This contains born-digital items</h2>
    <p>
      Born-digital items are materials created in a digital format, including
      digital images, documents, websites, audio, video, email, and more.
    </p>
    {bornDigitalWarning}
  </>
);

export const restrictedItemMessage = (
  <>
    This item is unavailable online. Email{' '}
    <a href="mailto:collections@wellcomecollection.org">
      collections@wellcomecollection.org
    </a>{' '}
    to request access to the full version.
  </>
);

export const accessibilityProvisionText =
  'Our building has step-free access. Exhibitions include audio description, British Sign Language and captions.';
