import { Book } from '../types/books';

// This is the list of books that are shown on https://wellcomecollection.org/stories
//
// Unlike the book pages themselves (which fetch data from Prismic), we cache
// these books here because they change infrequently and it saves us a fetch.
//
// Because these are passed to a BookPromo on /stories, we only include a subset of
// fields.  In particular, we omit some large fields (e.g. body) that won't be rendered
// in the cards on this page.

const books = [
  {
    id: 'Ye6WiRAAAJMQXT6N',
    title: 'This Book is a Plant',
    subtitle: 'How to Grow, Learn and Radically Engage with the Natural World',
    description:
      'The way we think about plants is about to change for ever: this is your handbook to a new natural world.',
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/26a0561b-c91e-40f6-804f-2497d1d7decc_This+Book+is+a+Plant+front+cover.jpg',
      width: 3200,
      height: 1800,
    },
  },
  {
    id: 'YW7YOREAACIANh4F',
    title: 'Hybrid Humans',
    subtitle: 'Dispatches from the Frontiers of Man and Machine',
    description:
      'Harry Parker meets the people pushing the limits of our bodies and brains, grappling with his own new identity and disability along the way.',
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/511191e1-782b-4165-8ce7-e60d6a77fdbb_Hybrid+Humans+cover.jpg',
      width: 3200,
      height: 1800,
    },
  },
  {
    id: 'YW7dSREAACAANjZn',
    title: 'Recovery',
    subtitle: 'The Lost Art of Convalescence',
    description:
      'In this uplifting account of hope and healing, GP Gavin Francis explores how and why we get better, revealing the many shapes recovery takes.',
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/e09277dc-666b-4811-91f7-f93b3166d3a2_Recovery+cover.jpg',
      width: 1529,
      height: 2453,
    },
  },
];

export const staticBooks: Book[] = books.map(b => {
  return {
    type: 'books',
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    cover: {
      contentUrl: b.cover.contentUrl,
      width: b.cover.width,
      height: b.cover.height,
      alt: '',
      crops: {},
    },
    promoText: b.description,
    body: [],
    metadataDescription: '',
    labels: [],
    reviews: [],
    datePublished: new Date(2021, 6, 2, 23, 0, 0),
    seasons: [],
  };
});
