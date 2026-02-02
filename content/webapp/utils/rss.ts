import RSS from 'rss';

import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchStoriesRss } from '@weco/content/services/prismic/fetch/stories-rss';
import { asText } from '@weco/content/services/prismic/transformers';

export async function buildStoriesRss(req) {
  const client = createClient(req);

  const stories = await fetchStoriesRss(client);

  const rssFeed = new RSS({
    title: 'Wellcome Collection stories',
    description:
      'Our words and pictures explore the connections between science, medicine, life and art. Dive into a story no matter where in the world you are.',
    feed_url: 'https://rss.wellcomecollection.org/stories',
    site_url: 'https://wellcomecollection.org/stories',
    image_url:
      'https://i.wellcomecollection.org/assets/icons/android-chrome-512x512.png',
    language: 'en',
    categories: ['Science', 'Medicine', 'Art'],
    pubDate: stories.results[0].first_publication_date,
  });

  stories.results.forEach(story => {
    const { data } = story;
    const description =
      data.promo && data.promo.length > 0
        ? data.promo
            .filter(slice => slice.primary.image)
            .map(({ primary: { caption } }) => {
              return asText(caption);
            })
            .find(Boolean)
        : '';

    const contributors = data.contributors
      .filter(({ contributor }) => contributor.isBroken === false)
      .map(({ contributor }) => {
        return contributor.data.name;
      });

    rssFeed.item({
      title: asText(data.title) as string,
      description,
      url: `https://wellcomecollection.org/articles/${story.id}`,
      author: contributors.join(', '),
      date: story.first_publication_date,
    });
  });

  return rssFeed.xml();
}
