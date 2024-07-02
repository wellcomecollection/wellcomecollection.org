/* eslint-disable @typescript-eslint/no-var-requires, import/first */
// This needs to be the first module loaded in the application
require('@weco/common/services/apm/initApm')('content-server');
import Koa from 'koa';
import Router from 'koa-router';
import next from 'next';
import { apmErrorMiddleware } from '@weco/common/services/apm/errorMiddleware';
import { init as initServerData } from '@weco/common/server-data';
import {
  withCachedValues,
  handleAllRoute,
} from '@weco/common/koa-middleware/withCachedValues';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { createClient as createPrismicClient } from '@weco/common/services/prismic/fetch';
import * as prismic from '@prismicio/client';
import RSS from 'rss';

import { asText } from './services/prismic/transformers';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const appPromise = nextApp
  .prepare()
  .then(async () => {
    await initServerData();

    const koaApp = new Koa();
    const router = new Router({
      // We have to enable case-sensitive routing to deal with a bizarre
      // choice of identifier from Prismic.  We have two pages with almost
      // identical IDs:
      //
      //    Schools
      //    https://wellcomecollection.prismic.io/documents~b=working&c=published&l=en-gb/Wuw2MSIAACtd3StS/
      //
      //    RawMinds
      //    https://wellcomecollection.prismic.io/documents~b=working&c=published&l=en-gb/Wuw2MSIAACtd3Sts/
      //
      // They differ only in that final 's/S', and for added complication we
      // redirect the /pages/<school ID> because it's a vanity URL.
      //
      // With case-insensitive routing, we were redirecting /pages/<RawMinds ID>
      // to /schools, which is wrong.
      sensitive: true,
    });

    koaApp.use(apmErrorMiddleware);
    koaApp.use(withCachedValues);

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

    // Add a naive healthcheck endpoint for the load balancer
    router.get('/management/healthcheck', async ctx => {
      ctx.body = {
        status: 'ok',
      };
    });

    // Add a naive healthcheck endpoint for the load balancer
    router.get('/rss', async ctx => {
      const client = createPrismicClient();

      const stories = await client.get({
        graphQuery: storyGraphQuery,
        orderings: [
          { field: 'my.articles.publishDate' },
          { field: 'my.webcomics.publishDate' },
          { field: 'document.first_publication_date', direction: 'desc' },
        ],
        filters: [
          prismic.filter.any('document.type', ['articles', 'webcomics']),
        ],
        pageSize: 100,
      });

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
          title: asText(data.title),
          description,
          url: `https://wellcomecollection.org/articles/${story.id}`,
          author: contributors.join(', '),
          date: story.first_publication_date,
        });
      });

      ctx.type = 'application/xml';
      ctx.body = rssFeed.xml();
    });

    router.get('/preview', async ctx => {
      // Kill any cookie we had set, as it think it is causing issues.
      ctx.cookies.set(prismic.cookie.preview);

      const client = createPrismicClient();
      client.enableAutoPreviewsFromReq(ctx.request);

      /**
       * This is because the type in api.resolve are not true
       */
      const retypedLinkResolver = doc => {
        return (linkResolver(doc) as string) || '/';
      };

      const url = await client.resolvePreviewURL({
        linkResolver: retypedLinkResolver,
        defaultURL: '/',
      });

      ctx.cookies.set('isPreview', 'true', {
        httpOnly: false,
      });

      ctx.redirect(url);
    });

    router.all('*', handleAllRoute(handle));

    koaApp.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    });

    koaApp.use(router.routes());

    return koaApp;
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

export default appPromise;
