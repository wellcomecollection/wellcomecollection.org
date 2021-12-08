import { Book } from '../types/books';

// This is the list of books that are shown on https://wellcomecollection.org/stories
//
// Unlike the book pages themselves (which fetch data from Prismic), we cache
// these books here because they change infrequently and it saves us a fetch.

export const staticBooks: Book[] = [
  {
    type: 'books',
    id: 'YKUlSxAAACMAGjAT',
    title: 'An Extra Pair of Hands',
    body: [
      {
        type: 'quote',
        weight: 'default',
        value: {
          text: [
            {
              type: 'paragraph',
              text: 'A beautiful, emotional and timely read.',
              spans: [],
            },
          ],
          citation: [
            {
              type: 'paragraph',
              text: 'Matt Haig',
              spans: [],
            },
          ],
          isPullOrReview: true,
        },
      },
      {
        type: 'text',
        weight: 'default',
        value: [
          {
            type: 'paragraph',
            text: 'An essential account of caring – and the grief, guilt, joy and love that accompany it, from the bestselling author of ‘Labyrinth’.',
            spans: [
              {
                start: 0,
                end: 130,
                type: 'strong',
              },
            ],
          },
        ],
      },
      {
        type: 'text',
        weight: 'default',
        value: [
          {
            type: 'paragraph',
            text: 'As our population ages, more and more of us find ourselves caring for parents and loved ones – some 8.8 million people in the UK. An invisible army of carers holding families together.',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'Here Kate Mosse tells her personal story of finding herself as a carer in middle age: first helping her mother look after her beloved father through Parkinson’s, then supporting her mother in widowhood, and finally as “an extra pair of hands” for her 90-year-old mother-in-law.',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'This is a story about the gentle heroism of our carers, about small everyday acts of tenderness, and finding joy in times of crisis. It’s about juggling priorities, mind-numbing repetition, about guilt and powerlessness, about grief, and the solace of nature when we’re exhausted or at a loss. It is also about celebrating older people, about learning to live differently – and think differently about ageing.',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'But most of all, it’s a story about love.',
            spans: [],
          },
        ],
      },
      {
        type: 'quote',
        weight: 'default',
        value: {
          text: [
            {
              type: 'paragraph',
              text: 'Read an extract from ‘An Extra Pair of Hands’, and watch a recording of an event with Kate Mosse and palliative care doctor and writer Rachel Clarke in conversation about care, ageing and everyday acts of love.',
              spans: [
                {
                  start: 0,
                  end: 15,
                  type: 'hyperlink',
                  data: {
                    id: 'YKONNhAAACMAE1yR',
                    type: 'articles',
                    tags: [],
                    slug: 'the-give-and-take-of-caring',
                    lang: 'en-gb',
                    link_type: 'Document',
                    isBroken: false,
                  },
                },
                {
                  start: 51,
                  end: 68,
                  type: 'hyperlink',
                  data: {
                    id: 'YJEIOREAACIA4Q3D',
                    type: 'events',
                    tags: [],
                    slug: 'an-extra-pair-of-hands-with-kate-mosse-andrachel-clarke',
                    lang: 'en-gb',
                    link_type: 'Document',
                    isBroken: false,
                  },
                },
              ],
            },
          ],
          citation: [],
          isPullOrReview: false,
        },
      },
    ],
    promo: {
      caption:
        'A deeply moving story of what it means to care for those we love by bestselling author Kate Mosse.',
      image: {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format&rect=0,894,1824,1026&w=3200&h=1800',
        width: 3200,
        height: 1800,
        alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
        tasl: {
          title: null,
          author: null,
          sourceName: null,
          sourceLink: null,
          license: null,
          copyrightHolder: null,
          copyrightLink: null,
        },
        minWidth: null,
      },
      link: null,
    },
    promoText:
      'A deeply moving story of what it means to care for those we love by bestselling author Kate Mosse.',
    promoImage: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format&rect=0,894,1824,1026&w=3200&h=1800',
      width: 3200,
      height: 1800,
      alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      minWidth: null,
    },
    image: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format',
      width: 1824,
      height: 2813,
      alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {
        '32:15': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format&rect=0,979,1824,855&w=3200&h=1500',
          width: 3200,
          height: 1500,
          alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        '16:9': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format&rect=0,894,1824,1026&w=3200&h=1800',
          width: 3200,
          height: 1800,
          alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        square: {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format&rect=0,495,1824,1824&w=3200&h=3200',
          width: 3200,
          height: 3200,
          alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
      },
    },
    squareImage: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format&rect=0,495,1824,1824&w=3200&h=3200',
      width: 3200,
      height: 3200,
      alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {},
    },
    widescreenImage: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format&rect=0,894,1824,1026&w=3200&h=1800',
      width: 3200,
      height: 1800,
      alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {},
    },
    metadataDescription: '',
    labels: [
      {
        text: 'Book',
      },
    ],
    subtitle: 'A story of caring, ageing and everyday acts of love',
    orderLink:
      'https://www.waterstones.com/book/an-extra-pair-of-hands/kate-mosse//9781788169943',
    price: undefined,
    format: 'Hardback',
    extent: '208 pages',
    isbn: '9781788162616',
    reviews: [],
    datePublished: new Date(2021, 6, 2, 23, 0, 0),
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format',
      width: 1824,
      height: 2813,
      alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {
        '32:15': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format&rect=0,979,1824,855&w=3200&h=1500',
          width: 3200,
          height: 1500,
          alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        '16:9': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format&rect=0,894,1824,1026&w=3200&h=1800',
          width: 3200,
          height: 1800,
          alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        square: {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/3c29e13f-eaf1-4b66-b08c-1c49a1706e38_An+Extra+Pair+of+Hands_book+jacket.jpg?auto=compress,format&rect=0,495,1824,1824&w=3200&h=3200',
          width: 3200,
          height: 3200,
          alt: 'Front cover of the book ‘An Extra Pair of Hands’ by Kate Mosse',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
      },
    },
    seasons: [],
    standfirst: null,
    superWidescreenImage: null,
  },
  {
    type: 'books',
    id: 'X0PFqRAAACkAOXoQ',
    title: 'How to Stay Sane in an Age of Division',
    body: [
      {
        type: 'text',
        weight: 'default',
        value: [
          {
            type: 'paragraph',
            text: 'The Booker Prize-shortlisted author Elif Shafak on how staying optimistic can make our world better.',
            spans: [
              {
                start: 0,
                end: 100,
                type: 'strong',
              },
            ],
          },
        ],
      },
      {
        type: 'text',
        weight: 'default',
        value: [
          {
            type: 'paragraph',
            text: 'Ours is the age of contagious anxiety. We feel overwhelmed by the events around us, by injustice, by suffering, by an endless feeling of crisis. So how can we nurture the parts of ourselves that hope, trust and believe in something better? And how can we stay sane in this age of division? ',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'In this powerful, uplifting plea for conscious optimism, Booker Prize-nominated novelist and activist Elif Shafak draws on her own memories and delves into the power of stories to bring us together. In the process she reveals how listening to each other can nurture democracy, empathy and our faith in a kinder and wiser future.',
            spans: [],
          },
        ],
      },
      {
        type: 'quote',
        weight: 'default',
        value: {
          text: [
            {
              type: 'paragraph',
              text: 'One of the best writers in the world today.',
              spans: [],
            },
          ],
          citation: [
            {
              type: 'paragraph',
              text: 'Hanif Kureishi',
              spans: [],
            },
          ],
          isPullOrReview: true,
        },
      },
      {
        type: 'quote',
        weight: 'default',
        value: {
          text: [
            {
              type: 'paragraph',
              text: 'Read an extract from ‘How to Stay Sane in an Age of Division’, and watch a recording of Elif Shafak in conversation with nurse and novelist Christie Watson about the power of stories.',
              spans: [
                {
                  start: 0,
                  end: 15,
                  type: 'hyperlink',
                  data: {
                    link_type: 'Web',
                    url: 'https://wellcomecollection.org/articles/X05HXRAAAK39aDrp',
                  },
                },
                {
                  start: 67,
                  end: 84,
                  type: 'hyperlink',
                  data: {
                    link_type: 'Web',
                    url: 'https://wellcomecollection.org/events/X2ipQhMAAExK8Kam',
                  },
                },
              ],
            },
          ],
          citation: [],
          isPullOrReview: false,
        },
      },
    ],
    promo: {
      caption:
        'The Booker Prize-shortlisted author Elif Shafak on how staying optimistic can make our world better.',
      image: {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format&rect=0,796,1530,861&w=3200&h=1800',
        width: 3200,
        height: 1800,
        alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
        tasl: {
          title: null,
          author: null,
          sourceName: null,
          sourceLink: null,
          license: null,
          copyrightHolder: null,
          copyrightLink: null,
        },
        minWidth: null,
      },
      link: null,
    },
    promoText:
      'The Booker Prize-shortlisted author Elif Shafak on how staying optimistic can make our world better.',
    promoImage: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format&rect=0,796,1530,861&w=3200&h=1800',
      width: 3200,
      height: 1800,
      alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      minWidth: null,
    },
    image: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format',
      width: 1530,
      height: 2453,
      alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {
        '32:15': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format&rect=0,868,1530,717&w=3200&h=1500',
          width: 3200,
          height: 1500,
          alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        '16:9': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format&rect=0,796,1530,861&w=3200&h=1800',
          width: 3200,
          height: 1800,
          alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        square: {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format&rect=0,461,1530,1530&w=3200&h=3200',
          width: 3200,
          height: 3200,
          alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
      },
    },
    squareImage: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format&rect=0,461,1530,1530&w=3200&h=3200',
      width: 3200,
      height: 3200,
      alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {},
    },
    widescreenImage: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format&rect=0,796,1530,861&w=3200&h=1800',
      width: 3200,
      height: 1800,
      alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {},
    },
    metadataDescription: '',
    labels: [
      {
        text: 'Book',
      },
    ],
    subtitle: '',
    orderLink:
      'https://uk.bookshop.org/books/how-to-stay-sane-in-an-age-of-division-from-the-booker-shortlisted-author-of-10-minutes-38-seconds-in-this-strange-world/9781788165723',
    price: '£5.50',
    format: 'Paperback',
    extent: '96 pages',
    isbn: '9781788165723',
    reviews: [],
    datePublished: new Date(2020, 8, 26, 23, 0, 0),
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format',
      width: 1530,
      height: 2453,
      alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {
        '32:15': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format&rect=0,868,1530,717&w=3200&h=1500',
          width: 3200,
          height: 1500,
          alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        '16:9': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format&rect=0,796,1530,861&w=3200&h=1800',
          width: 3200,
          height: 1800,
          alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        square: {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/89ad9a3f-7a0e-4637-b967-1a3dc06dbc78_How+to+Stay+Sane_book+cover.jpg?auto=compress,format&rect=0,461,1530,1530&w=3200&h=3200',
          width: 3200,
          height: 3200,
          alt: 'Image of the front cover of a book. The artwork is a graphic pattern of blue, green, orange and white squares and triangles. Black text in capital letters reads: How to Stay Sane in an Age of Division, Elif Shafak.',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
      },
    },
    seasons: [],
    standfirst: null,
    superWidescreenImage: null,
  },
  {
    type: 'books',
    id: 'YD-kkhAAACMAKv31',
    title: 'After the Storm',
    body: [
      {
        type: 'quote',
        weight: 'default',
        value: {
          text: [
            {
              type: 'paragraph',
              text: 'How did it come to this? I am tough, I am smart, I have lived alone. Now I am cracking, right down the middle…',
              spans: [],
            },
          ],
          citation: [],
          isPullOrReview: true,
        },
      },
      {
        type: 'text',
        weight: 'default',
        value: [
          {
            type: 'paragraph',
            text: 'Six months after the birth of her son, Emma Jane Unsworth finds herself in the eye of a storm. Nothing – from pregnancy to birth and beyond – has gone as she expected. A birth plan? It might as well have been a rough draft! Furious and exhausted, she realises her life is the complete opposite of what it used to be. She’s swapped all-night benders for grazed labia and Whac-a-Moling haemorrhoids. How did she end up here?',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'In this brave and hilarious account of postnatal depression, Emma tells her story of despair and recovery. She tackles the biggest taboos around motherhood and mental health, from botched stitches and bleeding nipples to anger and shame. How do our brains adapt to pregnancy? Is postnatal depression a natural reaction to the trauma of modern motherhood? And are people’s attitudes finally changing?',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'Dazzling and vital, ‘After the Storm’ is a celebration of survival, holding out a hand to women everywhere.',
            spans: [],
          },
        ],
      },
      {
        type: 'quote',
        weight: 'default',
        value: {
          text: [
            {
              type: 'paragraph',
              text: 'Read an extract from ‘After the Storm’, and watch a recording of an event with Emma Jane Unsworth exploring new motherhood, postnatal depression and recovery.',
              spans: [
                {
                  start: 0,
                  end: 38,
                  type: 'hyperlink',
                  data: {
                    id: 'YHW4tBAAACoAqMfK',
                    type: 'articles',
                    tags: [],
                    slug: 'surviving-the-storm-of-postnatal-depression',
                    lang: 'en-gb',
                    link_type: 'Document',
                    isBroken: false,
                  },
                },
                {
                  start: 44,
                  end: 61,
                  type: 'hyperlink',
                  data: {
                    id: 'YIA5JRAAACkA1G9q',
                    type: 'events',
                    tags: [],
                    slug: 'postnatal-depression-and-new-motherhood-with-emma-jane-unsworth',
                    lang: 'en-gb',
                    link_type: 'Document',
                    isBroken: false,
                  },
                },
              ],
            },
          ],
          citation: [],
          isPullOrReview: false,
        },
      },
    ],
    promo: {
      caption:
        'In this brave and funny account of postnatal depression, Emma Jane Unsworth tells her story of despair and recovery.',
      image: {
        contentUrl:
          'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format&rect=0,766,1559,877&w=3200&h=1800',
        width: 3200,
        height: 1800,
        alt: '‘After the Storm’ book cover',
        tasl: {
          title: null,
          author: null,
          sourceName: null,
          sourceLink: null,
          license: null,
          copyrightHolder: null,
          copyrightLink: null,
        },
        minWidth: null,
      },
      link: null,
    },
    promoText:
      'In this brave and funny account of postnatal depression, Emma Jane Unsworth tells her story of despair and recovery.',
    promoImage: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format&rect=0,766,1559,877&w=3200&h=1800',
      width: 3200,
      height: 1800,
      alt: '‘After the Storm’ book cover',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      minWidth: null,
    },
    image: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format',
      width: 1559,
      height: 2409,
      alt: '‘After the Storm’ book cover',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {
        '32:15': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format&rect=0,839,1559,731&w=3200&h=1500',
          width: 3200,
          height: 1500,
          alt: '‘After the Storm’ book cover',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        '16:9': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format&rect=0,766,1559,877&w=3200&h=1800',
          width: 3200,
          height: 1800,
          alt: '‘After the Storm’ book cover',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        square: {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format&rect=0,425,1559,1559&w=3200&h=3200',
          width: 3200,
          height: 3200,
          alt: '‘After the Storm’ book cover',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
      },
    },
    squareImage: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format&rect=0,425,1559,1559&w=3200&h=3200',
      width: 3200,
      height: 3200,
      alt: '‘After the Storm’ book cover',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {},
    },
    widescreenImage: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format&rect=0,766,1559,877&w=3200&h=1800',
      width: 3200,
      height: 1800,
      alt: '‘After the Storm’ book cover',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {},
    },
    metadataDescription: '',
    labels: [
      {
        text: 'Book',
      },
    ],
    subtitle: 'Postnatal Depression and the Utter Weirdness of New Motherhood',
    price: undefined,
    format: 'Hardback',
    extent: '176 pages',
    isbn: '9781788166546',
    reviews: [],
    datePublished: new Date(2021, 5, 5, 23, 0, 0),
    cover: {
      contentUrl:
        'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format',
      width: 1559,
      height: 2409,
      alt: '‘After the Storm’ book cover',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null,
      },
      crops: {
        '32:15': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format&rect=0,839,1559,731&w=3200&h=1500',
          width: 3200,
          height: 1500,
          alt: '‘After the Storm’ book cover',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        '16:9': {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format&rect=0,766,1559,877&w=3200&h=1800',
          width: 3200,
          height: 1800,
          alt: '‘After the Storm’ book cover',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
        square: {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/f2bf2ced-3fe8-4df0-aff4-3342a138b628_After+the+Storm+book+cover.jpg?auto=compress,format&rect=0,425,1559,1559&w=3200&h=3200',
          width: 3200,
          height: 3200,
          alt: '‘After the Storm’ book cover',
          tasl: {
            title: null,
            author: null,
            sourceName: null,
            sourceLink: null,
            license: null,
            copyrightHolder: null,
            copyrightLink: null,
          },
          crops: {},
        },
      },
    },
    seasons: [],
    standfirst: null,
    superWidescreenImage: null,
  },
];
