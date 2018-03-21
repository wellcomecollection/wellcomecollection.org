// @flow
import type {PrismicDocument, PrismicFragment} from './types';
import type {Installation} from '../../model/installations';
import type {Picture} from '../../model/picture';
import type {ImagePromo} from './parsers';
import {getDocument} from './api';
import {peopleFields, contributorFields} from './fetch-links';
import {breakpoints} from '../../utils/breakpoints';
import {
  parseTitle,
  parseDescription,
  parseContributors,
  parseImagePromo,
  parseTimestamp
} from './parsers';

function parseInstallationDoc(document: PrismicDocument): Installation {
  const data = document.data;
  return {
    id: document.id,
    title: parseTitle(data.title),
    description: parseDescription(data.description),
    contributors: parseContributors(data.contributors),
    start: parseTimestamp(data.start),
    end: data.end && parseTimestamp(data.end)
  };
}

function parseInstallationFeaturedImages(promo: PrismicFragment[]): ImagePromo[] {
  const promoThin = parseImagePromo(promo, '32:15', breakpoints.medium);
  const promoSquare = parseImagePromo(promo, 'square', breakpoints.small);

  return [promoThin, promoSquare].filter(Boolean);
}

export async function getInstallation(req: Request, id: string): Promise<?{|
  installation: Installation,
  featredImageList: Picture[]
|}> {
  const document = await getDocument(req, id, {
    fetchLinks: peopleFields.concat(contributorFields)
  });

  if (document && document.type === 'installations') {
    const installation = parseInstallationDoc(document);
    const promos = document.data.promo ? parseInstallationFeaturedImages(document.data.promo) : [];
    return {
      installation,
      featredImageList: promos.map(p => p.image).filter(Boolean)
    };
  }
}
