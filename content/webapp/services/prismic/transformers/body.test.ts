import { Embed } from '../types/body';
import * as prismic from '@prismicio/client';
import { transformBody } from './body';

export const sameAs = [
  { link: 'https://twitter.com/mbannisy', title: [] },
  { link: 'http://things.com', title: [] },
  {
    link: 'https://google.com',
    title: [{ type: 'heading1', text: 'This is it!', spans: [] }],
  },
];

describe('transformBody', () => {
  it("creates a no-cookie YouTube embed when there's an existing query parameter", () => {
    // This is from https://wellcomecollection.org/events/X5aeBhIAAB4Aq3nK
    //
    // The embed URL includes a ?list query parameter, which can throw off our
    // URL-fixing code if we're not careful.
    const slice: Embed = {
      id: '123',
      slice_type: 'embed',
      slice_label: null,
      items: [],
      primary: {
        embed: {
          provider_name: 'YouTube',
          title: 'Monstrous Births in the Middle Ages',
          author_name: 'Wellcome Collection',
          author_url: 'https://www.youtube.com/user/WellcomeCollection',
          type: prismic.OEmbedType.Rich,
          height: 113,
          width: 200,
          version: '1.0',
          thumbnail_height: 360,
          thumbnail_width: 480,
          thumbnail_url: 'https://i.ytimg.com/vi/RTlA8X0EJ7w/hqdefault.jpg',
          html: '<iframe width="200" height="113" src="https://www.youtube.com/embed/RTlA8X0EJ7w?list=PL1C12C48F8E360BC2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
          embed_url:
            'https://www.youtube.com/watch?v=RTlA8X0EJ7w&list=PL1C12C48F8E360BC2&index=13',
        },
        caption: [],
        transcript: [],
      },
    };

    const body = transformBody([slice]);

    expect(body).toEqual([
      {
        type: 'videoEmbed',
        weight: 'default',
        value: {
          embedUrl:
            'https://www.youtube-nocookie.com/embed/RTlA8X0EJ7w?rel=0&list=PL1C12C48F8E360BC2',
          caption: [],
          transcript: [],
        },
      },
    ]);
  });

  it("creates a no-cookie YouTube embed when there's no query parameter", () => {
    // This is from https://wellcomecollection.org/events/YVSCyRAAAEGADThi
    const slice: Embed = {
      id: '234',
      slice_type: 'embed',
      slice_label: null,
      items: [],
      primary: {
        embed: {
          provider_name: 'YouTube',
          title: 'Experiencing Ear Trumpets in the Enlightenment',
          author_name: 'Wellcome Collection',
          author_url: 'https://www.youtube.com/user/WellcomeCollection',
          type: prismic.OEmbedType.Rich,
          height: 113,
          width: 200,
          version: '1.0',
          thumbnail_height: 360,
          thumbnail_width: 480,
          thumbnail_url: 'https://i.ytimg.com/vi/RwUS2ev53b8/hqdefault.jpg',
          html: '<iframe width="200" height="113" src="https://www.youtube.com/embed/RwUS2ev53b8?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
          embed_url: 'https://www.youtube.com/watch?v=RwUS2ev53b8',
        },
        caption: [],
        transcript: [],
      },
    };

    const body = transformBody([slice]);

    expect(body).toEqual([
      {
        type: 'videoEmbed',
        weight: 'default',
        value: {
          embedUrl:
            'https://www.youtube-nocookie.com/embed/RwUS2ev53b8?rel=0&feature=oembed',
          caption: [],
          transcript: [],
        },
      },
    ]);
  });
});
