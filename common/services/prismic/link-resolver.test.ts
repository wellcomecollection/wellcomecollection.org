import linkResolver from './link-resolver';

// We want to be able to pass in either Prismic or Content API content types
test.each([
  // if ('tags' in doc) { and pages
  // visual storys
  { doc: { type: 'articles', uid: '1' }, path: '/stories/1' }, // Prismic type
  { doc: { type: 'Article', uid: '1' }, path: '/stories/1' }, // Content API type
  { doc: { type: 'books', uid: '1' }, path: '/books/1' },
  { doc: { type: 'Book', uid: '1' }, path: '/books/1' },
  { doc: { type: 'events', uid: '1' }, path: '/events/1' },
  { doc: { type: 'Event', uid: '1' }, path: '/events/1' },
  { doc: { type: 'event-series', uid: '1' }, path: '/event-series/1' },
  { doc: { type: 'Event series', uid: '1' }, path: '/event-series/1' },
  { doc: { type: 'exhibitions', uid: '1' }, path: '/exhibitions/1' },
  {
    doc: { type: 'exhibition-highlight-tours', uid: '1' },
    path: '/guides/exhibitions/1',
  },
  {
    doc: { type: 'Exhibition highlight tour', uid: '1' },
    path: '/guides/exhibitions/1',
  },
  // With highlightTourTypes
  {
    doc: {
      type: 'Exhibition highlight tour',
      uid: '1',
      highlightTourType: 'text',
    },
    path: '/guides/exhibitions/1/captions-and-transcripts',
  },
  {
    doc: {
      type: 'Exhibition highlight tour',
      uid: '1',
      highlightTourType: 'audio',
    },
    path: '/guides/exhibitions/1/audio-without-descriptions',
  },
  {
    doc: {
      type: 'Exhibition highlight tour',
      uid: '1',
      highlightTourType: 'bsl',
    },
    path: '/guides/exhibitions/1/bsl',
  },
  {
    doc: { type: 'exhibition-texts', uid: '1' },
    path: '/guides/exhibitions/1/captions-and-transcripts',
  },
  {
    doc: { type: 'Exhibition text', uid: '1' },
    path: '/guides/exhibitions/1/captions-and-transcripts',
  },
  {
    doc: { type: 'exhibition-guides-links', uid: '1' },
    path: '/guides/exhibitions/1',
  },
  // With highlightTourTypes
  {
    doc: {
      type: 'exhibition-guides-links',
      uid: '1',
      highlightTourType: 'text',
    },
    path: '/guides/exhibitions/1/captions-and-transcripts',
  },
  {
    doc: {
      type: 'exhibition-guides-links',
      uid: '1',
      highlightTourType: 'audio',
    },
    path: '/guides/exhibitions/1/audio-without-descriptions',
  },
  {
    doc: {
      type: 'exhibition-guides-links',
      uid: '1',
      highlightTourType: 'bsl',
    },
    path: '/guides/exhibitions/1/bsl',
  },
  {
    doc: { type: 'exhibition-guides', uid: '1' },
    path: '/guides/exhibitions/1',
  },
  // With highlightTourTypes
  {
    doc: {
      type: 'exhibition-guides',
      uid: '1',
      highlightTourType: 'text',
    },
    path: '/guides/exhibitions/1/captions-and-transcripts',
  },
  {
    doc: {
      type: 'exhibition-guides',
      uid: '1',
      highlightTourType: 'audio',
    },
    path: '/guides/exhibitions/1/audio-without-descriptions',
  },
  {
    doc: {
      type: 'exhibition-guides',
      uid: '1',
      highlightTourType: 'bsl',
    },
    path: '/guides/exhibitions/1/bsl',
  },
  { doc: { type: 'Exhibition', uid: '1' }, path: '/exhibitions/1' },
  { doc: { type: 'pages', uid: '1' }, path: '/1' },
  { doc: { type: 'Page', uid: '1' }, path: '/1' },
  // With site section tag
  { doc: { type: 'pages', uid: '1', tags: ['about-us'] }, path: '/about-us/1' },
  { doc: { type: 'projects', uid: '1' }, path: '/projects/1' },
  { doc: { type: 'Project', uid: '1' }, path: '/projects/1' },
  { doc: { type: 'seasons', uid: '1' }, path: '/seasons/1' },
  { doc: { type: 'Season', uid: '1' }, path: '/seasons/1' },
  { doc: { type: 'visual-stories', uid: '1' }, path: '/visual-stories/1' },
  // With related document
  {
    doc: {
      type: 'visual-stories',
      uid: '1',
      data: {
        relatedDocument: {
          type: 'exhibitions',
          uid: 'hard-graft-work-health-and-rights',
        },
      },
    },
    path: '/exhibitions/hard-graft-work-health-and-rights/visual-stories',
  },
  { doc: { type: 'Visual story', uid: '1' }, path: '/visual-stories/1' },
  /**
   * articles and webcomics look and act the same, but we're unable
   * to change the types of documents in Prismic.
   * {@link} https://community.prismic.io/t/import-export-change-type-of-imported-document/7814
   */
  { doc: { type: 'webcomics', uid: '1' }, path: '/stories/1' },
  { doc: { type: 'webcomic-series', uid: '1' }, path: '/series/1' },
  { doc: { type: 'not a thing', uid: '1' }, path: '/' },
])('$doc resolves to $path', ({ doc, path }) => {
  expect(linkResolver(doc)).toBe(path);
});

export {};
