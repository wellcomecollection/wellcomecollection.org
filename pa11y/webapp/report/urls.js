// Note: if you add a URL to this list, consider whether it would be valuable
// to add it to the list of URLs checked by the URL checker.
//
// See .buildkite/urls/expected_200_urls.txt
//
const paths = [
  '/',
  '/visit-us',
  '/whats-on',
  '/collections',
  '/stories',
  '/stories/the-birth-of-britain-s-national-health-service',
  '/stories/art',
  '/works/cjwep3ze?query=health&page=1',
  '/works/e7vav3ss/items?page=1&canvas=1',
  '/works/d2mach47',
  '/works/aegabdcp',
  '/collections/people-and-organisations?toggleOverride=thematicBrowsingPhases:categoryPages',
  '/series/inside-our-collections',
  '/exhibitions/heart-n-soul-s-wall-of-change',
  '/events/embracing-the-goddess',
  '/event-series/saturday-studio',
  '/concepts/patspgf3',
  '/guides/archives-at-wellcome-collection',
  '/visual-stories/genetic-automata-visual-story',

  // This is a comic using the new (as of November 2022) approach to
  // comic frames and navigation between issues.
  '/stories/clinical-detachment',

  // Exhibition guides.  We should test one example of each guide format.
  '/guides/exhibitions/in-plain-sight/audio-without-descriptions',
  '/guides/exhibitions/in-plain-sight/captions-and-transcripts',
  '/guides/exhibitions/in-plain-sight/bsl',

  // Search pages, overview + with one of each
  '/search?query=human',
  '/search/stories?query=human',
  '/search/images?query=human',
  '/search/works?query=human',
  '/search/events?query=human',
];

module.exports = { paths };
