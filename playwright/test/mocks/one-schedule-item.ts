import * as prismic from '@prismicio/client';

import { ArticlesDocument as RawArticlesDocument } from '@weco/common/prismicio-types';

export const oneScheduleItem: prismic.Query<RawArticlesDocument> = {
  page: 1,
  results_per_page: 20,
  results_size: 1,
  total_results_size: 1,
  total_pages: 1,
  next_page: null,
  prev_page: null,
  results: [
    {
      id: 'YeUumhAAAJMQMtKc',
      uid: '12345',
      url: null,
      type: 'articles',
      href: 'https://wellcomecollection.cdn.prismic.io/api/v2/documents/search?ref=YfFSxxEAACQAnD2t&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YeUumhAAAJMQMtKc%22%29+%5D%5D',
      tags: [],
      first_publication_date: '2022-01-20T10:00:00+0000',
      last_publication_date: '2022-01-25T10:28:34+0000',
      slugs: ['deciding-a-date-for-the-end-of-the-world'],
      linked_documents: [],
      lang: 'en-gb',
      alternate_languages: [],
      data: {
        title: [
          {
            type: 'heading1',
            text: 'Deciding a date for the end of the world',
            spans: [],
          },
        ],
        format: {
          link_type: 'Any' as const,
        },
        body: [
          {
            id: '123',
            slice_type: 'standfirst',
            slice_label: null,
            items: [],
            variation: 'default',
            version: '',
            primary: {
              text: [
                {
                  type: 'paragraph',
                  text: 'For centuries, humans have anticipated their own extinction. Although the Christian apocalypse brings life on Earth to a close, other cultures, such as the Maya, have included a new beginning in the end, creating cyclical rather than linear calendars. Historian Charlotte Sleigh examines why the end, periodically, seems nigh, and what we can learn from past predictions.',
                  spans: [],
                },
              ],
            },
          },
        ],
        metadataDescription: [
          {
            type: 'paragraph',
            text: 'For centuries, humans have anticipated their own extinction. Although the Christian apocalypse brings life on Earth to a close, other cultures, such as the Maya, have included a new beginning in the end, creating cyclical rather than linear calendars. Historian Charlotte Sleigh examines why the end, periodically, seems nigh, and what we can learn from past predictions.',
            spans: [],
          },
        ],
        contributors: [
          {
            role: {
              id: 'WcUWeCgAAFws-nGh',
              type: 'editorial-contributor-roles',
              tags: [],
              slug: 'author',
              lang: 'en-gb',
              data: {
                title: [
                  {
                    type: 'heading1',
                    text: 'Author',
                    spans: [],
                  },
                ],
                describedBy: 'words',
              },
              link_type: 'Document',
              isBroken: false,
            },
            contributor: {
              id: 'YRpSlhEAADJD3zoo',
              type: 'people',
              tags: [],
              slug: 'charlotte-sleigh',
              lang: 'en-gb',
              data: {
                name: 'Charlotte Sleigh',
                pronouns: null,
                description: [
                  {
                    type: 'paragraph',
                    text: 'Charlotte Sleigh is an interdisciplinary writer and practitioner in the science humanities. Her most recent book is ‘Human’ (Reaktion, 2020). She is Honorary Professor at the Department of Science and Technology Studies, UCL, and current president of the British Society for the History of Science.',
                    spans: [],
                  },
                ],
                image: {
                  id: '123',
                  edit: { x: 0, y: 0, zoom: 0, background: '' },
                  dimensions: {
                    width: 607,
                    height: 612,
                  },
                  alt: 'Head and shoulders photo of a woman with short, fair hair, against a background of hills and fields.',
                  copyright:
                    'Charlotte Sleigh | Charlotte Sleigh | | | All Rights Reserved | |',
                  url: 'https://images.prismic.io/wellcomecollection/d61588da-fe2b-4384-9688-e49a25ac7cee_Charlotte-Sleigh-headshot.jpg?auto=compress,format',
                  '32:15': {
                    id: '123',
                    edit: { x: 0, y: 0, zoom: 0, background: '' },
                    dimensions: {
                      width: 3200,
                      height: 1500,
                    },
                    alt: 'Head and shoulders photo of a woman with short, fair hair, against a background of hills and fields.',
                    copyright:
                      'Charlotte Sleigh | Charlotte Sleigh | | | All Rights Reserved | |',
                    url: 'https://images.prismic.io/wellcomecollection/d61588da-fe2b-4384-9688-e49a25ac7cee_Charlotte-Sleigh-headshot.jpg?auto=compress,format&rect=0,164,607,285&w=3200&h=1500',
                  },
                  '16:9': {
                    id: '123',
                    edit: { x: 0, y: 0, zoom: 0, background: '' },
                    dimensions: {
                      width: 3200,
                      height: 1800,
                    },
                    alt: 'Head and shoulders photo of a woman with short, fair hair, against a background of hills and fields.',
                    copyright:
                      'Charlotte Sleigh | Charlotte Sleigh | | | All Rights Reserved | |',
                    url: 'https://images.prismic.io/wellcomecollection/d61588da-fe2b-4384-9688-e49a25ac7cee_Charlotte-Sleigh-headshot.jpg?auto=compress,format&rect=0,135,607,341&w=3200&h=1800',
                  },
                  square: {
                    id: '123',
                    edit: { x: 0, y: 0, zoom: 0, background: '' },
                    dimensions: {
                      width: 3200,
                      height: 3200,
                    },
                    alt: 'Head and shoulders photo of a woman with short, fair hair, against a background of hills and fields.',
                    copyright:
                      'Charlotte Sleigh | Charlotte Sleigh | | | All Rights Reserved | |',
                    url: 'https://images.prismic.io/wellcomecollection/d61588da-fe2b-4384-9688-e49a25ac7cee_Charlotte-Sleigh-headshot.jpg?auto=compress,format&rect=0,2,607,607&w=3200&h=3200',
                  },
                },
                sameAs: [
                  {
                    link: 'https://hellobookwhisperer.com/',
                    title: [
                      {
                        type: 'paragraph',
                        text: 'Charlotte Sleigh’s website',
                        spans: [],
                      },
                    ],
                  },
                  {
                    link: null,
                    title: [],
                  },
                ],
              },
              link_type: 'Document',
              isBroken: false,
            },
            description: [],
          },
        ],
        contributorsTitle: [],
        promo: [
          {
            id: '123',
            slice_type: 'editorialImage',
            slice_label: null,
            items: [],
            primary: {
              caption: [
                {
                  type: 'paragraph',
                  text: 'When will the world end? Charlotte Sleigh explores how our obsession with dates and dramatic imaginings of the end can distract us from the dangers slowly creeping up on us. ',
                  spans: [],
                },
              ],
              image: {
                id: '123',
                edit: { x: 0, y: 0, zoom: 0, background: '' },
                dimensions: {
                  width: 3840,
                  height: 2160,
                },
                alt: "Mixed media digital artwork combining found imagery from vintage magazines and books with painted and textured elements. The overall hues are blues, yellows and reds. The illustration is split in two by a red and yellow line running vertically through the image at a slight angle. On the left side of this line is the black and white archive image of the head and upper body of a man with a white beard wearing a suit from the Victorian era. The top half of his head from his nose up has been replaced with strips of newspapers arranged in a step formation to resemble a Mayan temple. The first level of newspaper has the word 'Revelations' in all caps. As the levels rise the words, 'calendar', December 21st', 'Maya' and '2012' appear in newspaper print. At the top of the temple structure is a bright light and an explosion of red and yellow wedges shooting up into the blue background. A large crack runs down through the temple. On the right side of the vertical lines, the image of this temple structure is duplicated and enlarged to reveal it in more detail and crop out the man's lower head. A small figure can now be seen flying through the air, propelled by the force of the explosion.",
                copyright:
                  'Deciding a date for the end of the world | | | | | Gergo Varga (varrgo.com) for Wellcome Collection |',
                url: 'https://images.prismic.io/wellcomecollection/760b74c4-bf1a-46d4-a995-0bb4014542ce_WellColl+-+Ch1+-+Headline.jpg?auto=compress,format',
                '32:15': {
                  id: '123',
                  edit: { x: 0, y: 0, zoom: 0, background: '' },
                  dimensions: {
                    width: 3200,
                    height: 1500,
                  },
                  alt: "Mixed media digital artwork combining found imagery from vintage magazines and books with painted and textured elements. The overall hues are blues, yellows and reds. The illustration is split in two by a red and yellow line running vertically through the image at a slight angle. On the left side of this line is the black and white archive image od the head and upper body of a man with a white beard wearing a suit from the Victorian era. The top half of his head from his nose up has been replaced with strips of newspapers arranged in a step formation to resemble a Mayan temple. The first level of newspaper has the word 'Revelations' in all caps. As the levels rise the words, 'calendar', December 21st', 'Maya' and '2012' appear in newspaper print. At the top of the temple structure is a bright light and an explosion of red and yellow wedges shooting up into the blue background. A large crack runs down through the temple. On the right side of the vertical lines, the image of this temple structure is duplicated and enlarged to reveal it in more detail and crop out the man's lower head. A small figure can now be seen flying through the air, propelled by the force of the explosion.",
                  copyright:
                    'Deciding a date for the end of the world | | | | | Gergo Varga (varrgo.com) for Wellcome Collection |',
                  url: 'https://images.prismic.io/wellcomecollection/760b74c4-bf1a-46d4-a995-0bb4014542ce_WellColl+-+Ch1+-+Headline.jpg?auto=compress,format&rect=0,320,3840,1800&w=3200&h=1500',
                },
                '16:9': {
                  id: '123',
                  edit: { x: 0, y: 0, zoom: 0, background: '' },
                  dimensions: {
                    width: 3200,
                    height: 1800,
                  },
                  alt: "Mixed media digital artwork combining found imagery from vintage magazines and books with painted and textured elements. The overall hues are blues, yellows and reds. The illustration is split in two by a red and yellow line running vertically through the image at a slight angle. On the left side of this line is the black and white archive image od the head and upper body of a man with a white beard wearing a suit from the Victorian era. The top half of his head from his nose up has been replaced with strips of newspapers arranged in a step formation to resemble a Mayan temple. The first level of newspaper has the word 'Revelations' in all caps. As the levels rise the words, 'calendar', December 21st', 'Maya' and '2012' appear in newspaper print. At the top of the temple structure is a bright light and an explosion of red and yellow wedges shooting up into the blue background. A large crack runs down through the temple. On the right side of the vertical lines, the image of this temple structure is duplicated and enlarged to reveal it in more detail and crop out the man's lower head. A small figure can now be seen flying through the air, propelled by the force of the explosion.",
                  copyright:
                    'Deciding a date for the end of the world | | | | | Gergo Varga (varrgo.com) for Wellcome Collection |',
                  url: 'https://images.prismic.io/wellcomecollection/760b74c4-bf1a-46d4-a995-0bb4014542ce_WellColl+-+Ch1+-+Headline.jpg?auto=compress,format&rect=0,0,3840,2160&w=3200&h=1800',
                },
                square: {
                  id: '123',
                  edit: { x: 0, y: 0, zoom: 0, background: '' },
                  dimensions: {
                    width: 3200,
                    height: 3200,
                  },
                  alt: "Mixed media digital artwork combining found imagery from vintage magazines and books with painted and textured elements. The overall hues are blues, yellows and reds. The illustration is split in two by a red and yellow line running vertically through the image at a slight angle. On the left side of this line is the black and white archive image od the head and upper body of a man with a white beard wearing a suit from the Victorian era. The top half of his head from his nose up has been replaced with strips of newspapers arranged in a step formation to resemble a Mayan temple. The first level of newspaper has the word 'Revelations' in all caps. As the levels rise the words, 'calendar', December 21st', 'Maya' and '2012' appear in newspaper print. At the top of the temple structure is a bright light and an explosion of red and yellow wedges shooting up into the blue background. A large crack runs down through the temple. On the right side of the vertical lines, the image of this temple structure is duplicated and enlarged to reveal it in more detail and crop out the man's lower head. A small figure can now be seen flying through the air, propelled by the force of the explosion.",
                  copyright:
                    'Deciding a date for the end of the world | | | | | Gergo Varga (varrgo.com) for Wellcome Collection |',
                  url: 'https://images.prismic.io/wellcomecollection/760b74c4-bf1a-46d4-a995-0bb4014542ce_WellColl+-+Ch1+-+Headline.jpg?auto=compress,format&rect=1488,0,2160,2160&w=3200&h=3200',
                },
              },
              link: null,
            },
          },
        ],
        series: [
          {
            positionInSeries: 1,
            series: {
              id: 'YeUt6xAAAIAWMs9o',
              type: 'series',
              tags: [],
              slug: 'apocalypse-how',
              lang: 'en-gb',
              data: {
                color: 'accent.blue',
                contributors: [],
                contributorsTitle: [],
                seasons: [],
                body: [],
                metadataDescription: null,
                title: [
                  {
                    type: 'heading1',
                    text: 'Apocalypse How?',
                    spans: [],
                  },
                ],
                schedule: [
                  {
                    title: [
                      {
                        type: 'heading1',
                        text: 'Deciding a date for the end of the world',
                        spans: [],
                      },
                    ],
                    publishDate: '2022-01-20T10:00:00+0000',
                  },
                ],
                promo: [
                  {
                    id: '123',
                    slice_type: 'editorialImage',
                    slice_label: null,
                    items: [],
                    primary: {
                      caption: [
                        {
                          type: 'paragraph',
                          text: 'Over many centuries, the end has periodically seemed nigh. Charlotte Sleigh explores what has led to these predictions, and how history can help us think about our current fears of annihilation.',
                          spans: [],
                        },
                      ],
                      image: {
                        id: '123',
                        edit: { x: 0, y: 0, zoom: 0, background: '' },
                        dimensions: {
                          width: 3840,
                          height: 2160,
                        },
                        alt: "Mixed media digital artwork combining found imagery from vintage magazines and books with painted and textured elements. The overall hues are blues, yellows and reds. The illustration is split in two by a red and yellow line running vertically through the image at a slight angle. On the left side of this line is the black and white archive image of the head and upper body of a man with a white beard wearing a suit from the Victorian era. The top half of his head from his nose up has been replaced with strips of newspapers arranged in a step formation to resemble a Mayan temple. The first level of newspaper has the word 'Revelations' in all caps. As the levels rise the words, 'calendar', December 21st', 'Maya' and '2012' appear in newspaper print. At the top of the temple structure is a bright light and an explosion of red and yellow wedges shooting up into the blue background. A large crack runs down through the temple. On the right side of the vertical lines, the image of this temple structure is duplicated and enlarged to reveal it in more detail and crop out the man's lower head. A small figure can now be seen flying through the air, propelled by the force of the explosion.",
                        copyright:
                          'Deciding a date for the end of the world | | | | | Gergo Varga (varrgo.com) for Wellcome Collection |',
                        url: 'https://images.prismic.io/wellcomecollection/760b74c4-bf1a-46d4-a995-0bb4014542ce_WellColl+-+Ch1+-+Headline.jpg?auto=compress,format',
                        '32:15': {
                          id: '123',
                          edit: { x: 0, y: 0, zoom: 0, background: '' },
                          dimensions: {
                            width: 3200,
                            height: 1500,
                          },
                          alt: "Mixed media digital artwork combining found imagery from vintage magazines and books with painted and textured elements. The overall hues are blues, yellows and reds. The illustration is split in two by a red and yellow line running vertically through the image at a slight angle. On the left side of this line is the black and white archive image od the head and upper body of a man with a white beard wearing a suit from the Victorian era. The top half of his head from his nose up has been replaced with strips of newspapers arranged in a step formation to resemble a Mayan temple. The first level of newspaper has the word 'Revelations' in all caps. As the levels rise the words, 'calendar', December 21st', 'Maya' and '2012' appear in newspaper print. At the top of the temple structure is a bright light and an explosion of red and yellow wedges shooting up into the blue background. A large crack runs down through the temple. On the right side of the vertical lines, the image of this temple structure is duplicated and enlarged to reveal it in more detail and crop out the man's lower head. A small figure can now be seen flying through the air, propelled by the force of the explosion.",
                          copyright:
                            'Deciding a date for the end of the world | | | | | Gergo Varga (varrgo.com) for Wellcome Collection |',
                          url: 'https://images.prismic.io/wellcomecollection/760b74c4-bf1a-46d4-a995-0bb4014542ce_WellColl+-+Ch1+-+Headline.jpg?auto=compress,format&rect=0,298,3840,1800&w=3200&h=1500',
                        },
                        '16:9': {
                          id: '123',
                          edit: { x: 0, y: 0, zoom: 0, background: '' },
                          dimensions: {
                            width: 3200,
                            height: 1800,
                          },
                          alt: "Mixed media digital artwork combining found imagery from vintage magazines and books with painted and textured elements. The overall hues are blues, yellows and reds. The illustration is split in two by a red and yellow line running vertically through the image at a slight angle. On the left side of this line is the black and white archive image od the head and upper body of a man with a white beard wearing a suit from the Victorian era. The top half of his head from his nose up has been replaced with strips of newspapers arranged in a step formation to resemble a Mayan temple. The first level of newspaper has the word 'Revelations' in all caps. As the levels rise the words, 'calendar', December 21st', 'Maya' and '2012' appear in newspaper print. At the top of the temple structure is a bright light and an explosion of red and yellow wedges shooting up into the blue background. A large crack runs down through the temple. On the right side of the vertical lines, the image of this temple structure is duplicated and enlarged to reveal it in more detail and crop out the man's lower head. A small figure can now be seen flying through the air, propelled by the force of the explosion.",
                          copyright:
                            'Deciding a date for the end of the world | | | | | Gergo Varga (varrgo.com) for Wellcome Collection |',
                          url: 'https://images.prismic.io/wellcomecollection/760b74c4-bf1a-46d4-a995-0bb4014542ce_WellColl+-+Ch1+-+Headline.jpg?auto=compress,format&rect=0,0,3840,2160&w=3200&h=1800',
                        },
                        square: {
                          id: '123',
                          edit: { x: 0, y: 0, zoom: 0, background: '' },
                          dimensions: {
                            width: 3200,
                            height: 3200,
                          },
                          alt: "Mixed media digital artwork combining found imagery from vintage magazines and books with painted and textured elements. The overall hues are blues, yellows and reds. The illustration is split in two by a red and yellow line running vertically through the image at a slight angle. On the left side of this line is the black and white archive image od the head and upper body of a man with a white beard wearing a suit from the Victorian era. The top half of his head from his nose up has been replaced with strips of newspapers arranged in a step formation to resemble a Mayan temple. The first level of newspaper has the word 'Revelations' in all caps. As the levels rise the words, 'calendar', December 21st', 'Maya' and '2012' appear in newspaper print. At the top of the temple structure is a bright light and an explosion of red and yellow wedges shooting up into the blue background. A large crack runs down through the temple. On the right side of the vertical lines, the image of this temple structure is duplicated and enlarged to reveal it in more detail and crop out the man's lower head. A small figure can now be seen flying through the air, propelled by the force of the explosion.",
                          copyright:
                            'Deciding a date for the end of the world | | | | | Gergo Varga (varrgo.com) for Wellcome Collection |',
                          url: 'https://images.prismic.io/wellcomecollection/760b74c4-bf1a-46d4-a995-0bb4014542ce_WellColl+-+Ch1+-+Headline.jpg?auto=compress,format&rect=1499,0,2160,2160&w=3200&h=3200',
                        },
                      },
                      link: null,
                    },
                  },
                ],
              },
              link_type: 'Document',
              isBroken: false,
            },
          },
        ],
        exploreMoreDocument: { link_type: 'Any' as const },
        seasons: [
          {
            season: {
              link_type: 'Any' as const,
            },
          },
        ],
        parents: [
          {
            order: null,
            parent: {
              link_type: 'Any' as const,
            },
          },
        ],
        publishDate: null,
      },
    },
  ],
};
