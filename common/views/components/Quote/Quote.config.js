// @flow
export const status = 'graduated';
export const context = {
  text: [{
    type: 'paragraph',
    text: 'Said Hamlet to Ophelia,\nI\'ll draw a sketch of thee,\nWhat kind of pencil shall I use?\n2B or not 2B?',
    spans: []
  }],
  citation: [{
    type: 'paragraph',
    text: 'Spike Milligan - A Silly Poem',
    spans: [{
      type: 'hyperlink',
      start: 0,
      end: 29,
      data: {
        url: 'https://www.poemhunter.com/poem/a-silly-poem/'
      }
    }]
  }]
};
