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
    id: 'YW7dSREAACAANjZn',
    title: 'Recovery',
    subtitle: 'The Lost Art of Convalescence',
    description: 'In this uplifting account of hope and healing, GP Gavin Francis explores how and why we get better, revealing the many shapes recovery takes.',
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/e09277dc-666b-4811-91f7-f93b3166d3a2_Recovery+cover.jpg',
      width: 1529,
      height: 2453,
    },
  },
  {
    id: 'YW7QGhEAACIANf_z',
    title: 'Dark and Magical Places',
    subtitle: 'The Neuroscience of How We Navigate',
    description: 'An extraordinary account of how we navigate the world.',
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/f2251287-9ca9-4507-9ae8-a2c4dd604d78_Dark+and+Magical+Places+cover.pdf.jpg',
      width: 1902,
      height: 2983
    },
  },
  {
    id: 'YRpf9xEAADVQ33g6',
    title: 'Harlots, Whores & Hackabouts',
    subtitle: 'A History of Sex for Sale',
    description: 'An enlightening cultural history of the sex trade that puts sex workers centre stage, revealing how they have lived and worked all around the globe.',
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/ce111be3-df6d-4f49-ac73-ec79cb5b823f_Harlots+cover.png',
      width: 878,
      height: 1226,
    },
  }
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
