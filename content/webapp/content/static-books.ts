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
    id: 'YKUlSxAAACMAGjAT',
    title: 'An Extra Pair of Hands',
    subtitle: 'A story of caring, ageing and everyday acts of love',
    description:
      'A deeply moving story of what it means to care for those we love by bestselling author Kate Mosse.',
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format',
      width: 1824,
      height: 2813,
    },
  },
  {
    id: 'X0PFqRAAACkAOXoQ',
    title: 'How to Stay Sane in an Age of Division',
    subtitle: '',
    description:
      'The Booker Prize-shortlisted author Elif Shafak on how staying optimistic can make our world better.',
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format&rect=0,796,1530,861&w=3200&h=1800',
      width: 3200,
      height: 1800,
    },
  },
  {
    id: 'YD-kkhAAACMAKv31',
    title: 'After the Storm',
    subtitle: 'Postnatal Depression and the Utter Weirdness of New Motherhood',
    description:
      'In this brave and funny account of postnatal depression, Emma Jane Unsworth tells her story of despair and recovery.',
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format',
      width: 1559,
      height: 2409,
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
