/** This defines the vanity URLs for pages on wellcomecollection.org.
 *
 * == What it looks like for users ==
 *
 * When a user visits a vanity URL, they will be redirected to the appropriate page.
 *
 * e.g. if somebody visits /access, they'll be redirected to /visit-us/accessibility
 *
 * == When we use vanity URLs ==
 *
 * We can set up a vanity/marketing redirect in these cases:
 *
 *    - It’s a key landing page
 *    - It’s meant to be read aloud
 *    - User needs to remember to write it down
 *    - Print to digital transmission
 *
 */
export const literalRedirects: Record<string, string> = {
  '/access': '/visit-us/accessibility',
  '/alice-anderson':
    '/exhibitions/alice-anderson--memory-movement-memory-objects',
  '/articles': '/search/stories',
  '/stories/comic': '/search/stories?format=W7d_ghAAALWY3Ujc',
  '/articles/aids-posters-0': '/stories/aids-posters',
  '/articles/hysteria': '/stories/what-is-hysteria', // "hysteria" already taken by ZN-ELxEAACMABO5a in former UID.
  '/articles/lustmord':
    '/stories/lustmord-and-the-three-perspectives-of-murder',
  // Webcomic -> Story of type Comic.
  '/articles/X5rs7RIAAB4Avr_r': '/stories/what-distinguishes-the-human-',
  '/articles/X61xYhMAACAAX_z1': '/stories/to-err-is-human',
  '/articles/X6P6_xMAACEANfQB': '/stories/stuff-humans-like',
  '/articles/X7bJORMAACEAiRPo': '/stories/humans-are-social-animals',
  '/articles/X8Ay3hIAACMAbSL2': '/stories/stuff-humans-don-t-like',
  '/articles/X_dsXREAACMASftU': '/stories/january-diet',
  //
  '/articles/xksu0xiaadlrl4-h':
    '/stories/enduring-taboos-and-the-future-of-skin-bleaching',
  '/ayurvedic-man':
    '/exhibitions/ayurvedic-man--encounters-with-indian-medicine',
  '/bedlam': '/exhibitions/bedlam--the-asylum-and-beyond',
  '/brains': '/exhibitions/brains-mind-matter',
  '/dirt': '/exhibitions/dirt-filthy-reality-everyday-life',
  '/eat-me': '/books/eat-me',
  '/electricity': '/exhibitions/electricity--the-spark-of-life',
  '/event-series/Wo1YeCoAACoAZFoN': '/events/embracing-the-goddess',
  '/eventspaces': '/visit-us/venue-hire',
  '/exhibitions/skeletons-london%E2%80%99s-buried-bones':
    '/exhibitions/skeletons-londons-buried-bones',
  '/exhibitions/thinking-body-mind-and-movement-work-wayne-mcgregor-random-dance':
    '/exhibitions/thinking-with-the-body',
  '/exhibitionsandevents': '/whats-on',
  '/explore': '/stories',
  '/exquisite-bodies': '/exhibitions/exquisite-bodies',
  '/events/current-and-coming-up': '/events',
  '/foreignbodies': '/exhibitions/foreign-bodies--common-ground',
  '/forensics': '/exhibitions/forensics--the-anatomy-of-crime',
  '/graphic-warnings': '/books/graphic-warnings',
  '/graphicdesign': '/exhibitions/can-graphic-design-save-your-life-',
  '/high-society': '/exhibitions/high-society',
  '/infinitas-gracias':
    '/exhibitions/infinitas-gracias--mexican-miracle-paintings',
  '/info/opening-hours': '/visit-us/opening-times',
  '/info/opening-times': '/visit-us/opening-times',
  '/installations/W-K6iBUAAJqYxKMi': '/exhibitions/things',
  '/installations/W-K8VhUAAKOcxKsl': '/exhibitions/twenty-six-things',
  '/installations/W-LESBUAAJ-dxM5y': '/exhibitions/the-generosity-plates',
  '/installations/W3LDcCkAACcAEKqy': '/exhibitions/global-clinic',
  '/installations/W5Y-NyYAACMALAdp': '/exhibitions/our-voice--our-way',
  '/installations/W78dJBEAAB8NpQle': '/exhibitions/made-well',
  '/installations/W7T-FxAAADRy0mu0': '/exhibitions/drawing-the-bombay-plague',
  '/installations/W9sIhRUAANoQovHe':
    '/exhibitions/ann-veronica-janssens--yellowbluepink',
  '/installations/W9xNPBUAAO5nqHyO': '/exhibitions/the-transvengers',
  '/installations/WqwC1iAAAB8AJgFB':
    '/exhibitions/alien-sex-club-by-john-walter',
  '/installations/Wrynhx8AAAjk9XX-': '/exhibitions/under-by-martina-amati',
  '/installations/Wryoox8AAAjk9Xr0':
    '/exhibitions/sensorium-tests-by-daria-martin',
  '/installations/WryoVx8AAAjk9Xmg': '/exhibitions/sire-by-maria-mckinney',
  '/installations/WthzICAAAOObLY5K': '/exhibitions/spirit-booth',
  '/installations/WyuWLioAACkACeYv': '/exhibitions/the-pharmacy-of-colour',
  '/MakingNature': '/exhibitions/making-nature',
  '/medieval-bodies': '/books/medieval-bodies',
  '/opening-times': '/visit-us/opening-times',
  '/packed-lunch': '/event-series/packed-lunch',
  '/press': '/about-us/press',
  '/rawminds': '/get-involved/schools',
  '/readingroom': '/visit-us/the-reading-room',
  '/schools': '/get-involved/schools',
  '/secrettemple': '/exhibitions/tibets-secret-temple',
  '/series/X8D9qxIAACIAcKSf': '/series/worry-lines',
  '/sexology': '/exhibitions/institute-sexology',
  '/somewhere-in-between': '/exhibitions/somewhere-in-between',
  '/the-hub': '/get-involved/the-hub',
  '/thisisavoice': '/exhibitions/this-is-a-voice',
  '/touring': '/get-involved/our-touring-exhibitions',
  '/venue-hire': '/visit-us/venue-hire',
  '/visit': '/visit-us',
  '/visit-us.aspx': '/visit-us',
  '/visit-us/events-tickets': '/visit-us/booking-and-attending-our-events',
  '/voices-within': '/books/the-voices-within',
  '/webcomic-series/WleP3iQAACUAYEoN': '/series/body-squabbles',
  '/what-we-do/proposing-online-article': '/get-involved/propose-a-story',
  '/whats-on/exhibitions/all-exhibitions': '/exhibitions',
  '/whats-on/exhibitions/brains': '/exhibitions/brains-mind-matter',
  '/whats-on/exhibitions/infinitas-gracias':
    '/exhibitions/infinitas-gracias-mexican-miracle-paintings',
  '/whats-on/exhibitions/superhuman': '/exhibitions/superhuman',
  '/young-people': '/get-involved/young-people',
  '/youth': '/get-involved/young-people',

  // This is the Prismic page for the homepage
  '/pages/XphUbREAACMAgRNP': '/',

  // See https://wellcome.slack.com/archives/C8X9YKM5X/p1656920569188629
  '/events/YrCXAREAACEAFSTW': '/events/am-i-normal',

  // See https://wellcome.slack.com/archives/C8X9YKM5X/p1676549408691429
  '/exhibitions/Yo39QREAACMAet6p': '/exhibitions/the-archive-of-an-unseen',

  // This is the "nice" URL for new memberships.
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues/8167
  '/signup': '/account/api/auth/signup',

  // This is an old "getting around the building page".
  //
  // Among other places, it's linked to from the footer of some email
  // newsletters, so we need to make sure it goes somewhere sensible.
  // See https://wellcome.slack.com/archives/C3N7J05TK/p1658503007545149
  '/pages/Wuw19yIAAK1Z3Smy':
    '/visit-us/accessibility#getting-around-the-building',

  // This was added for the the printed gallery guide that will accompany
  // the Grace Ndiritu exhibition.
  // See https://wellcome.slack.com/archives/C8X9YKM5X/p1664363102626599
  '/colonial-roots':
    '/about-us/the-colonial-roots-of-our-collections--and-our-response',

  // This was added to improve the accessibility of this exhibition URL,
  // in particular for use in Instagram pictures -- we wanted something that
  // could be embedded in an image and would be easier to type than a string
  // of letters.
  // See https://wellcome.slack.com/archives/C3TQSF63C/p1668010459644169
  '/in-plain-sight': '/exhibitions/in-plain-sight',

  // Requested by Content team
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues/9765
  '/lbe-festival': '/event-series/land-body-ecologies-festival',

  // Old Exhibition guide content type to new Highlights Tour/Text format.
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues/11140
  // Jason
  '/guides/exhibitions/Zdcs4BEAACMA6abC':
    '/guides/exhibitions/jason-and-the-adventure-of-254',
  '/guides/exhibitions/Zdcs4BEAACMA6abC/audio-without-descriptions':
    '/guides/exhibitions/jason-and-the-adventure-of-254/audio-without-descriptions',
  '/guides/exhibitions/Zdcs4BEAACMA6abC/bsl':
    '/guides/exhibitions/jason-and-the-adventure-of-254/bsl',
  '/guides/exhibitions/Zdcs4BEAACMA6abC/captions-and-transcripts':
    '/guides/exhibitions/jason-and-the-adventure-of-254/captions-and-transcripts',
  // Healing pavilion
  '/guides/exhibitions/Y2JgxREAACcJWckj':
    '/guides/exhibitions/the-healing-pavilion',
  '/guides/exhibitions/Y2JgxREAACcJWckj/audio-without-descriptions':
    '/guides/exhibitions/the-healing-pavilion/audio-without-descriptions',
  '/guides/exhibitions/Y2JgxREAACcJWckj/bsl':
    '/guides/exhibitions/the-healing-pavilion/bsl',
  '/guides/exhibitions/Y2JgxREAACcJWckj/captions-and-transcripts':
    '/guides/exhibitions/the-healing-pavilion/captions-and-transcripts',
};

// Query redirects have the form:
// {
//   [original path to match]: {
//     matchParams: [URLSearchParams to match]
//     forwardParams: [param keys to forward if present]
//     redirectPath: [path to redirect to]
//     modifiedParams: [{ [oldParamName]: [newParamName] }]
//   }
// }
type QueryRedirect = {
  matchParams?: URLSearchParams;
  redirectPath: string;
  forwardParams: Set<string>;
  modifiedParams?: {
    [oldParamName: string]: string;
  };
};

export const pathRedirects: Record<string, string> = {
  '/articles': '/stories',
};

// When adding a new rule, add it to redirect.tests.ts
// As we can't test the actual redirection locally
export const queryRedirects: Record<string, QueryRedirect[]> = {
  // Search hub redirections
  '/works': [
    {
      matchParams: new URLSearchParams({
        search: 'images', // From before image search, around 2020.
      }),
      redirectPath: '/search/images',
      // This matches the order in the CloudFront cache policy in terraform
      // cache/modules/cloudfront_policies/locals.tf
      forwardParams: new Set([
        'query',
        'images.color',
        'locations.license',
        'source.genres.label',
        'source.subjects.label',
        'source.contributors.agent.label',
        'page',
      ]),
      modifiedParams: { 'images.color': 'color' },
    },
    {
      redirectPath: '/search/works',
      // This matches the order in the CloudFront cache policy in terraform
      // cache/modules/cloudfront_policies/locals.tf
      forwardParams: new Set([
        'query',
        'sort',
        'sortOrder',
        'workType', // Formats
        'production.dates.from',
        'production.dates.to',
        'availabilities', // Locations
        'subjects.label', // Subjects
        'genres.label', // Types/Techniques
        'contributors.agent.label', // Contributors
        'languages',
        'page',
        'partOf.title',
      ]),
    },
  ],
  '/images': [
    {
      redirectPath: '/search/images',
      // This matches the order in the CloudFront cache policy in terraform
      // cache/modules/cloudfront_policies/locals.tf
      forwardParams: new Set([
        'query',
        'color', // Color filter
        'locations.license', // Licences filter
        'source.genres.label', // Types/techniques filter
        'source.subjects.label', // Subjects filter
        'source.contributors.agent.label', // Contributors filter
        'page',
      ]),
    },
  ],
};
