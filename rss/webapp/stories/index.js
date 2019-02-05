const micro = require('micro');
const Rss = require('rss');
const Prismic = require('prismic-javascript');
const PrismicDom = require('prismic-dom');
const { send } = micro;

const storyGraphQuery = `{
  articles {
    ...articlesFields
    format {
      ...formatFields
    }
    contributors {
      ...contributorsFields
      role {
        ...roleFields
      }
      contributor {
        ... on people {
          ...peopleFields
        }
        ... on organisations {
          ...organisationsFields
        }
      }
    }
  }

  webcomics {
    ...webcomicsFields
    series {
      series {
        ...seriesFields
      }
    }
    contributors {
      ...contributorsFields
      role {
        ...roleFields
      }
      contributor {
        ... on people {
          ...peopleFields
        }
      }
    }
  }
}`;

const stories = async (req, res) => {
  const api = await Prismic.getApi(
    'https://wellcomecollection.prismic.io/api/v2'
  );
  const stories = await api.query(
    [Prismic.Predicates.any('document.type', ['articles', 'webcomics'])],
    {
      graphQuery: storyGraphQuery,
      orderings:
        '[my.articles.publishDate, my.webcomics.publishDate, document.first_publication_date desc]',
      pageSize: 100,
    }
  );

  const rssFeed = new Rss({
    title: 'Wellcome Collection stories',
    description:
      'Our words and pictures explore the connections between science, medicine, life and art. Dive into a story no matter where in the world you are.',
    feed_url: 'https://rss.wellcomecollection.org/stories',
    site_url: 'https://wellcomecollection.org/stories',
    image_url:
      'https://i.wellcomecollection.org/assets/icons/android-chrome-512x512.png',
    language: 'en',
    categories: ['Science', 'Medicine', 'Art'],
    pubDate: PrismicDom.Date(stories.results[0].first_publication_date),
  });

  stories.results.forEach(story => {
    const { data } = story;
    const description =
      data.promo && data.promo.length > 0
        ? data.promo
            .filter(slice => slice.primary.image)
            .map(({ primary: { image, caption } }) => {
              return PrismicDom.RichText.asText(caption);
            })
            .find(Boolean)
        : '';

    const contributors = data.contributors
      .filter(({ contributor }) => contributor.isBroken === false)
      .map(({ contributor }) => {
        return contributor.data.name;
      });

    rssFeed.item({
      title: PrismicDom.RichText.asText(data.title),
      description,
      url: `https://wellcomecollection.org/articles/${story.id}`,
      author: contributors.join(', '),
      date: PrismicDom.Date(story.first_publication_date),
    });
  });

  res.setHeader('Content-Type', 'application/xml');
  return send(res, 200, rssFeed.xml());
};

module.exports = stories;
