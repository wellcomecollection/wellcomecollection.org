import Prismic from 'prismic-javascript';
import {prismicApi} from '../services/prismic-api';
import {getEditorial, getEditorialPreview, getEvent} from '../services/prismic-content';
import {createPageConfig} from '../model/page-config';

export const renderEditorial = async(ctx, next) => {
  const format = ctx.request.query.format;
  // We rehydrate the `W` here as we take it off when we have the route.
  const id = `W${ctx.params.id}`;
  const editorial = await getEditorial(id);

  render(ctx, editorial, format);
};

export async function renderEditorialPreview(ctx, next) {
  const format = ctx.request.query.format;
  const id = `${ctx.params.id}`;
  const editorial = await getEditorialPreview(id, ctx.request);

  render(ctx, editorial, format);
}

function render(ctx, editorial, format) {
  if (editorial) {
    if (format === 'json') {
      ctx.body = editorial;
    } else {
      ctx.render('pages/article', {
        pageConfig: createPageConfig({
          title: editorial.title,
          inSection: 'explore'
        }),
        article: editorial
      });
    }
  }
}

export async function setPreviewSession(ctx, next) {
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

  if (event) {
    if (format === 'json') {
      ctx.body = event;
    } else {
      ctx.render('pages/event', {
        pageConfig: createPageConfig({
          title: event.title,
          inSection: 'explore'
        }),
        article: event
      });
    }
  }
}
