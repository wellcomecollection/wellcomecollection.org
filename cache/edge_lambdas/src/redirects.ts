/** This defines the vanity URLs for pages on wellcomecollection.org.
 *
 * == What it looks like for users ==
 *
 * When a user visits a vanity URL, they will be redirected to the appropriate page.
 *
 * e.g. if somebody visits /about-us, they'll be redirected to /pages/Wuw2MSIAACtd3Stq
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
 * See https://app.gitbook.com/o/-LumfFcEMKx4gYXKAZTQ/s/DPDDj27NI2F2kPukWrC1/developer-handbook/urls-on-wellcomecollection.org
 *
 */
export const literalRedirects: Record<string, string> = {
  '/about-us': '/pages/Wuw2MSIAACtd3Stq',
  '/access': '/pages/Wvm2uiAAAIYQ4FHP',
  '/alice-anderson': '/exhibitions/W31qcCkAACIAP4zJ',
  '/articles/a-brief-history-of-tattoos': '/articles/W9m2QxcAAF8AFvE5',
  '/articles/a-drop-in-the-ocean-beth-hopkins': '/articles/WsT4Ex8AAHruGfWV',
  '/articles/a-drop-in-the-ocean-daniel-regan': '/articles/WsT4Ex8AAHruGfXJ',
  '/articles/aids-posters': '/articles/W9hlyRAAANom8AzA',
  '/articles/aids-posters-0': '/articles/W9hlyRAAANom8AzA',
  '/articles/body-squabbles-button': '/articles/WXH-ZCoAAC8ca_lj',
  '/articles/body-squabbles-crisps': '/articles/WWjY2CoAAIpZQ7ie',
  '/articles/body-squabbles-foot': '/articles/WWjT9SoAAL65Q6Ls',
  '/articles/body-squabbles-keyholes': '/articles/WWjXLioAAL65Q7FA',
  '/articles/body-squabbles-medal': '/articles/WWjZjioAAItZQ7vE',
  '/articles/body-squabbles-parasites': '/articles/WWjaDioAAIpZQ74R',
  '/articles/body-squabbles-plague': '/articles/WWjabioAAAF0Q7',
  '/articles/body-squabbles-pots': '/articles/WWjZtyoAAItZQ7yE',
  '/articles/body-squabbles-pundit': '/articles/WWjZYioAAIpZQ7sB',
  '/articles/body-squabbles-size': '/articles/WWjanioAAItZQ8CT',
  '/articles/body-squabbles-teeth': '/articles/WWjYdSoAAIpZQ7bl',
  '/articles/body-squabbles-thirst': '/articles/WWjXACoAAItZQ7Bt',
  '/articles/charged-bodies': '/articles/WsT4Ex8AAHruGfXR',
  '/articles/cholerics-the-real-drama-queens': '/articles/WsT4Ex8AAHruGfWn',
  '/articles/condoms-beneath-the-sheath': '/articles/W88vXBIAAOEyzwO_',
  '/articles/dazzling-luxury': '/articles/WsT4Ex8AAHruGfXB',
  '/articles/digital-pets': '/articles/WsT4Ex8AAHruGfWb',
  '/articles/drugs-and-brain-quick-guide-brain-chemistry':
    '/articles/W9hIBBAAAHAb74ma',
  '/articles/drugs-in-victorian-britain': '/articles/W87wthIAACQizfap',
  '/articles/eels-and-feels': '/articles/WsT4Ex8AAHruGfXF',
  '/articles/ethical-taxidermy': '/articles/WsT4Ex8AAHruGfWx',
  '/articles/graphic-sex': '/articles/W-Q1sxEAAB5ffIw4',
  '/articles/hamlet-the-melancholic-prince-of-denmark':
    '/articles/WsT4Ex8AAHruGfWf',
  '/articles/hysteria': '/articles/W89GZBIAAN4yz1hQ',
  '/articles/lustmord': '/articles/WqfvayUAAKsrVreh',
  '/articles/mummies-revealed': '/articles/WqfrzCUAAPjnVqeT',
  '/articles/museums-in-context-the-birth-of-the-public-museum':
    '/articles/W_0kHhEAADUAbHiJ',
  '/articles/nymphomania': '/articles/W_v8XxQAACgA_WKS',
  '/articles/object-of-the-month-shrunken-heads-real-and-fake/':
    '/articles/W9sabBUAAC0Aoz5g',
  '/articles/obsessed-with-buffy-much': '/articles/WsT4Ex8AAHruGfWh',
  '/articles/outsiders-the-child': '/articles/WsT4Ex8AAHruGfXd',
  '/articles/outsiders-the-colonist': '/articles/WsT4Ex8AAHruGfWj',
  '/articles/outsiders-the-cook': '/articles/WsT4Ex8AAHruGfW_',
  '/articles/outsiders-the-prostitute': '/articles/WsT4Ex8AAHruGfWl',
  '/articles/outsiders-the-stranger': '/articles/WsT4Ex8AAHruGfXH',
  '/articles/outsiders-the-tradesman': '/articles/WsT4Ex8AAHruGfXj',
  '/articles/paris-morgue': '/articles/W-RTBBEAAO5mfQ3M',
  '/articles/photographs-as-evidence': '/articles/WqfysCUAAKsrVsYn',
  '/articles/science-art': '/articles/W9b0kRIAABdu8KBo',
  '/articles/six-personal-health-zines-that-might-change-your-life':
    '/articles/WsT4Ex8AAHruGfWz',
  '/articles/sleep-paralysis-a-brief-history-of-fear-treatment-and-artistic-creativity':
    '/articles/W9beDBIAAHu08EVG',
  '/articles/sockets-and-stumps': '/articles/W-VjexEAAJKKgbWt',
  '/articles/the-current-that-kills': '/articles/WsT4Ex8AAHruGfWt',
  '/articles/the-humours-in-shakespeare': '/articles/W-MM-xUAAAinxgs3',
  '/articles/the-ladies-of-llangollen': '/articles/WqewRSUAAB8sVaKN',
  '/articles/the-power-of-unicorns': '/articles/W_1gyREAADIAbXjT',
  '/articles/the-transvengers-webcomic': '/articles/W03jACYAACUAg5IR',
  '/articles/thunderbolts-and-lightning': '/articles/WsT4Ex8AAHruGfXD',
  '/articles/titans-in-the-landscape': '/articles/WsT4Ex8AAHruGfXZ',
  '/articles/why-the-world-needs-collectors': '/articles/Wqf3GyUAAPjnVtnC',
  '/articles/wonder-womans-wonder-women': '/articles/WsT4Ex8AAHruGfWp',
  '/articles/X5rs7RIAAB4Avr_r': '/articles/X8ZZChIAACUAiFbC',
  '/articles/X61xYhMAACAAX_z1': '/articles/X8dTWhIAACQAjJ5S',
  '/articles/X6P6_xMAACEANfQB': '/articles/X8dRxhIAACQAjJdL',
  '/articles/X7bJORMAACEAiRPo': '/articles/X8dU2BIAACMAjKT-',
  '/articles/X8Ay3hIAACMAbSL2': '/articles/X8dV8xIAACIAjKn6',
  '/articles/X_dsXREAACMASftU': '/articles/X_g6ohEAACQATYJF',
  '/articles/xksu0xiaadlrl4-h': '/articles/XKsU0xIAADlrL4-h',
  '/ayurvedic-man': '/exhibitions/WduTricAAN7Mt8yY',
  '/bedlam': '/exhibitions/W31tsSkAACkAP5p8',
  '/brains': '/exhibitions/W31EzykAACkAPuXG',
  '/dirt': '/exhibitions/W31CnikAACIAPtwS',
  '/eat-me': '/books/WwVK3CAAAHm5ExxF',
  '/electricity': '/exhibitions/W31vkCkAACkAP6LL',
  '/event-series/Wo1YeCoAACoAZFoN': '/events/Wqkd1yUAAB8sW4By',
  '/eventspaces': '/venue-hire',
  '/exhibitions/atoms-patterns': '/exhibitions/W300HykAACgAPp9y',
  '/exhibitions/bobby-bakers-diary-drawings': '/exhibitions/W309HSkAACcAPsep',
  '/exhibitions/brains-mind-matter': '/exhibitions/W31EzykAACkAPuXG',
  '/exhibitions/death-self-portrait': '/exhibitions/W31GISkAACIAPuvB',
  '/exhibitions/dirt-filthy-reality-everyday-life':
    '/exhibitions/W31CnikAACIAPtwS',
  '/exhibitions/exquisite-bodies': '/exhibitions/W30-zikAACcAPs8v',
  '/exhibitions/heart': '/exhibitions/W30t8ykAACcAPoc1',
  '/exhibitions/high-society': '/exhibitions/W31CFCkAACcAPtpJ',
  '/exhibitions/identity': '/exhibitions/W30_nikAACkAPtLL',
  '/exhibitions/idiosyncratic-z-human-condition':
    '/exhibitions/W31n7ykAACcAP4F2',
  '/exhibitions/institute-sexology': '/exhibitions/W31ooSkAACIAP4So',
  '/exhibitions/life-death': '/exhibitions/W30waSkAACcAPo_q',
  '/exhibitions/madness-modernity': '/exhibitions/W308LykAACgAPsON',
  '/exhibitions/medicine-man': '/exhibitions/Weoe4SQAAKJwjcDC',
  '/exhibitions/medicine-now': '/exhibitions/WeobUyQAAKdwjbEO',
  '/exhibitions/museum-modern-nature': '/exhibitions/W31waSkAACcAP6aX',
  '/exhibitions/skeletons-london%E2%80%99s-buried-bones':
    '/exhibitions/W301BSkAACgAPqOR',
  '/exhibitions/skin': '/exhibitions/W31AaCkAACIAPtUm',
  '/exhibitions/sleeping-dreaming': '/exhibitions/W30vSSkAACIAPowf',
  '/exhibitions/souzou': '/exhibitions/W31G5CkAACgAPu8q',
  '/exhibitions/states-mind-ann-veronica-janssens':
    '/exhibitions/W31rWykAACIAP5DX',
  '/exhibitions/states-mind-tracing-edges-consciousness':
    '/exhibitions/W31sUykAACkAP5Um',
  '/exhibitions/thinking-body-mind-and-movement-work-wayne-mcgregor-random-dance':
    '/exhibitions/W31ITCkAACcAPvVo',
  '/exhibitions/war-and-medicine': '/exhibitions/W302KCkAACcAPqi5',
  '/exhibitionsandevents': '/whats-on',
  '/explore': '/stories',
  '/exquisite-bodies': '/exhibitions/W30-zikAACcAPs8v',
  '/foreignbodies': '/exhibitions/W31I-ykAACkAPvh1',
  '/forensics': '/exhibitions/W31pfCkAACkAP4iL',
  '/get-involved': '/pages/YDaZmxMAACIAT9u8',
  '/graphic-warnings': '/books/WwVK3CAAAHm5ExxT',
  '/graphicdesign': '/exhibitions/WZwh4ioAAJ3usf86',
  '/high-society': '/exhibitions/W31CFCkAACcAPtpJ',
  '/infinitas-gracias': '/exhibitions/W31D3CkAACIAPuGN',
  '/info/opening-hours': '/opening-times',
  '/info/opening-times': '/opening-times',
  '/installations/W-K6iBUAAJqYxKMi': '/exhibitions/XFximBAAAPkAioW_',
  '/installations/W-K8VhUAAKOcxKsl': '/exhibitions/XFximBAAAPkAioW3',
  '/installations/W-LESBUAAJ-dxM5y': '/exhibitions/XFximBAAAPkAioW5',
  '/installations/W3LDcCkAACcAEKqy': '/exhibitions/XFximBAAAPkAioWp',
  '/installations/W5Y-NyYAACMALAdp': '/exhibitions/XFximBAAAPkAioWl',
  '/installations/W78dJBEAAB8NpQle': '/exhibitions/XFximBAAAPkAioWj',
  '/installations/W7T-FxAAADRy0mu0': '/exhibitions/XFximBAAAPkAioWx',
  '/installations/W9sIhRUAANoQovHe': '/exhibitions/XFximBAAAPkAioWz',
  '/installations/W9xNPBUAAO5nqHyO': '/exhibitions/XFximBAAAPkAioWv',
  '/installations/WqwC1iAAAB8AJgFB': '/exhibitions/XFximBAAAPkAioWn',
  '/installations/Wrynhx8AAAjk9XX-': '/exhibitions/XFximBAAAPkAioW1',
  '/installations/Wryoox8AAAjk9Xr0': '/exhibitions/XFximBAAAPkAioWr',
  '/installations/WryoVx8AAAjk9Xmg': '/exhibitions/XFximBAAAPkAioW9',
  '/installations/WthzICAAAOObLY5K': '/exhibitions/XFximBAAAPkAioWt',
  '/installations/WyuWLioAACkACeYv': '/exhibitions/XFximBAAAPkAioW7',
  '/MakingNature': '/exhibitions/W31uwCkAACcAP58u',
  '/medieval-bodies': '/books/Ww0QpiUAAFQXohEZ',
  '/opening-times': '/pages/WwQHTSAAANBfDYXU',
  '/openplatform': '/pages/WvljzSAAAB4E3uMF',
  '/packed-lunch': '/event-series/WifrbikAAGSyDtHk',
  '/press': '/pages/WuxrKCIAAP9h3hmw',
  '/press/‘forensics-anatomy-crime’-opens-wellcome-collection':
    '/pages/Wv7RnyAAAPtL9tHr',
  '/rawminds': '/schools',
  '/readingroom': '/pages/Wvlk4yAAAB8A3ufp',
  '/schools': '/pages/Wuw2MSIAACtd3StS',
  '/secrettemple': '/exhibitions/W3Ls-SkAACgAEWMx',
  '/series/a-drop-in-the-ocean': '/series/Ww6kkCEAAEU5j4zy',
  '/series/body-squabbles': '/series/WleP3iQAACUAYEoN',
  '/series/electric-sublime': '/series/WSQ9rygAAA9xtwgS',
  '/series/the-outsiders': '/series/WtCORCEAANQ76Sh9',
  '/series/X8D9qxIAACIAcKSf': '/series/X76JKBMAACIAqtZ2',
  '/sexology': '/exhibitions/W31ooSkAACIAP4So',
  '/somewhere-in-between': '/exhibitions/WhvoAykAACgAlDoo',
  '/the-hub': '/pages/Wuw2MSIAACtd3SsU',
  '/thisisavoice': '/exhibitions/W31tHikAACgAP5gi',
  '/touring': '/pages/Wuw2MSIAACtd3Sty',
  '/user-panel': '/pages/YH17kRAAACoAyWTB',
  '/venue-hire': '/pages/Wuw2MSIAACtd3SsC',
  '/visit': '/visit-us',
  '/visit-us.aspx': '/visit-us',
  '/visit-us/accessibility': '/access',
  '/visit-us/events-tickets': '/pages/Wuw19yIAAK1Z3Sng',
  '/visit-us/photography': '/pages/Wuw19yIAAK1Z3Smw',
  '/visit-us/wellcome-café': '/pages/Wvl1wiAAADMJ3zNe',
  '/visit-us/wellcome-kitchen': '/pages/Wuw19yIAAK1Z3Snk',
  '/voices-within': '/books/WwVK3CAAAHm5Exxl',
  '/webcomic-series/WleP3iQAACUAYEoN': '/series/WleP3iQAACUAYEoN',
  '/what-we-do/proposing-online-article': '/pages/Wvl00yAAAB8A3y8p',
  '/whats-on/exhibitions/all-exhibitions': '/exhibitions',
  '/whats-on/exhibitions/brains': '/exhibitions/W31EzykAACkAPuXG',
  '/whats-on/exhibitions/infinitas-gracias': '/exhibitions/W31D3CkAACIAPuGN',
  '/whats-on/exhibitions/superhuman': '/exhibitions/W31FpSkAACkAPumK',
  '/young-people': '/pages/Wuw2MSIAACtd3Ssg',
  '/youth': '/pages/Wuw2MSIAACtd3Ssg',

  // This is the Prismic page for the homepage
  '/pages/XphUbREAACMAgRNP': '/',

  // See https://wellcome.slack.com/archives/C8X9YKM5X/p1656920569188629
  '/events/YrCXAREAACEAFSTW': '/events/Yqcv7xEAACEA61Co',

  // See https://wellcome.slack.com/archives/C8X9YKM5X/p1676549408691429
  '/exhibitions/Yo39QREAACMAet6p': '/exhibitions/Y3zI8hAAAGXXcMua',

  // This is the "nice" URL for new memberships.
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues/8167
  '/signup': '/account/api/auth/signup',

  // This is an old "getting around the building page".
  //
  // Among other places, it's linked to from the footer of some email
  // newsletters, so we need to make sure it goes somewhere sensible.
  // See https://wellcome.slack.com/archives/C3N7J05TK/p1658503007545149
  '/pages/Wuw19yIAAK1Z3Smy': '/access#getting-around-the-building',

  // This was added for the the printed gallery guide that will accompany
  // the Grace Ndiritu exhibition.
  // See https://wellcome.slack.com/archives/C8X9YKM5X/p1664363102626599
  '/colonial-roots': '/pages/YLnsihAAACEAfsuu',

  // This was added to improve the accessibility of this exhibition URL,
  // in particular for use in Instagram pictures -- we wanted something that
  // could be embedded in an image and would be easier to type than a string
  // of letters.
  // See https://wellcome.slack.com/archives/C3TQSF63C/p1668010459644169
  '/in-plain-sight': '/exhibitions/Yv95yBAAAILuCNv6',

  // Requested by Content team
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues/9765
  '/lbe-festival': '/event-series/ZFt3UBQAAMFmEIya',

  // Old Exhibition guide content type to new Highlights Tour/Text format.
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues/11140
  '/guides/exhibitions/Zdcs4BEAACMA6abC':
    '/guides/exhibitions/ZthrZRIAACQALvCC',
  '/guides/exhibitions/Zdcs4BEAACMA6abC/audio-without-descriptions':
    '/guides/exhibitions/ZthrZRIAACQALvCC/audio-without-descriptions',
  '/guides/exhibitions/Zdcs4BEAACMA6abC/bsl':
    '/guides/exhibitions/ZthrZRIAACQALvCC/bsl',
  '/guides/exhibitions/Zdcs4BEAACMA6abC/captions-and-transcripts':
    '/guides/exhibitions/ZthrZRIAACQALvCC/captions-and-transcripts',
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
