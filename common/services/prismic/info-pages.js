// @flow
import {getDocument} from './api';
import {parseBody, parseImagePromo, parseTitle} from './parsers';
import type {InfoPage} from '../../model/info-pages';
import type {PrismicDocument} from './types';
import {infoPagesFields} from './fetch-links';

export function parseInfoPage(document: PrismicDocument) {
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
  const drupalisedBody: any[] = drupalPromoImage ? [{
    weight: 'default',
    type: 'picture',
    value: {
      contentUrl: document.data.drupalPromoImage.url,
      width: document.data.drupalPromoImage.width,
      height: document.data.drupalPromoImage.height
    }
  }].concat(body) : body;

  return {
    type: 'info-pages',
    id: document.id,
    title: document.data.title ? parseTitle(document.data.title) : 'TITLE MISSING',
    body: drupalisedBody,
    promo: drupalisedPromo,
    drupalPromoImage: drupalPromoImage,
    drupalNid: document.data.drupalNid,
    drupalPath: document.data.drupalPath
  };
}

export async function getInfoPage(req: Request, id: string): Promise<?InfoPage> {
  const infoPage = await getDocument(req, id, {
    fetchLinks: infoPagesFields
  });

  if (infoPage) {
    return parseInfoPage(infoPage);
  }
}
