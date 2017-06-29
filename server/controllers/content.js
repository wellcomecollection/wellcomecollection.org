import Prismic from 'prismic-javascript';
import {prismicApi} from '../services/prismic-api';
import {getContent, getEvent, getPreviewContent} from '../services/prismic-content';
import {createPageConfig} from '../model/page-config';

export const renderPrismicArticle = async(ctx, next) => {
  const format = ctx.request.query.format;
  // We rehydrate the `W` here as we take it off when we have the route.
  const id = `W${ctx.params.id}`;
  const content = await getContent(id);

  renderContent(ctx, content, format);
};

export async function renderPreviewPrismicArticle(ctx, next) {
  const format = ctx.request.query.format;
  const id = `${ctx.params.id}`;
  const content = await getPreviewContent(id, ctx.request);

  renderContent(ctx, content, format);
}

function renderContent(ctx, content, format) {
  if (content) {
    if (format === 'json') {
      ctx.body = content;
    } else {
      ctx.render('pages/article', {
        pageConfig: createPageConfig({
          title: content.headline,
          inSection: 'explore'
        }),
        article: content
      });
    }
  }
}

export async function setContentPreviewSession(ctx, next) {
  const {token} = ctx.request.query;
  ctx.cookies.set(Prismic.previewCookie, token, {
    maxAge: 60 * 30 * 1000,
    path: '/',
    httpOnly: false
  });

  const redirectUrl = await getPreviewSession(token);
  ctx.response.redirect(redirectUrl);
}

async function getPreviewSession(token) {
  const prismic = await prismicApi();

  return new Promise((resolve, reject) => {
    prismic.previewSession(token, (doc) => {
      switch (doc.type) {
        case 'content': return `/preview/${doc.id}`;
      }
    }, '/', (err, redirectUrl) => {
      if (err) {
        reject(err);
      } else {
        resolve(redirectUrl);
      }
    });
  });
}

export async function renderEvent(ctx, next) {
  const id = `${ctx.params.id}`;
  const event = await getEvent(id);
  const format = ctx.request.query.format;
  
  renderContent(ctx, event, format);
}
