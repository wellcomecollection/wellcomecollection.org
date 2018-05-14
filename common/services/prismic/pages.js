// @flow
import {getDocument} from './api';
import {parseBody, parseImagePromo, parseTitle} from './parsers';
import type {Page} from '../../model/pages';
import type {PrismicDocument} from './types';
import {pagesFields} from './fetch-links';

export function parsePage(document: PrismicDocument) {
  // TODO (drupal migration): Just deal with normal promo once we deprecate the
  // drupal stuff
  const promo = document.data.promo && parseImagePromo(document.data.promo);
  const drupalPromoImage = document.data.drupalPromoImage && document.data.drupalPromoImage.url ? document.data.drupalPromoImage : null;
  const drupalisedPromo = drupalPromoImage ? {
    caption: promo && promo.caption,
    image: {
      contentUrl: document.data.drupalPromoImage.url,
      width: document.data.drupalPromoImage.width,
      height: document.data.drupalPromoImage.height
    }
  } : promo;

  const body = document.data.body ? parseBody(document.data.body) : [];

  return {
    type: 'pages',
    id: document.id,
    title: document.data.title ? parseTitle(document.data.title) : 'TITLE MISSING',
    body: body,
    promo: drupalisedPromo,
    drupalPromoImage: drupalPromoImage,
    drupalNid: document.data.drupalNid,
    drupalPath: document.data.drupalPath
  };
}

export async function getPage(req: Request, id: string): Promise<?Page> {
  const page = await getDocument(req, id, {
    fetchLinks: pagesFields
  });

  if (page) {
    return parsePage(page);
  }
}
