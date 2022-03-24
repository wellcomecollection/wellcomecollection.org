import {
  Exhibit,
  ExhibitionFormat,
  Exhibition,
  ExhibitionBasic,
  ExhibitionRelatedContent,
} from '../../../types/exhibitions';
import {
  ExhibitionPrismicDocument,
  ExhibitionRelatedContentPrismicDocument,
  ExhibitionFormat as ExhibitionFormatPrismicDocument,
} from '../types/exhibitions';
import { Query } from '@prismicio/types';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { transformQuery } from './paginated-results';
import { transformMultiContent } from './multi-content';
import {
  asHtml,
  asRichText,
  asText,
  asTitle,
  transformGenericFields,
  transformSingleLevelGroup,
  transformTimestamp,
} from '.';
import { transformSeason } from './seasons';
import { transformPlace } from './places';
import { transformImagePromo, transformPromoToCaptionedImage } from './images';
import { isFilledLinkToDocumentWithData } from '../types';
import { Resource } from '../../../types/resource';
import { SeasonPrismicDocument } from '../types/seasons';
import { transformContributors } from './contributors';
import * as prismicH from '@prismicio/helpers';

// TODO: Use better types than Record<string, any>.
//
// This was lifted directly from a JavaScript implementation when we converted the
// codebase to TypeScript (previously it was `Object`), but I can't find any exhibition
// pages where we actually define/use any resources (or at least not any picked up by
// the previous implementation), so I couldn't test it.
function transformResourceTypeList(
  fragment: Record<string, any>[],
  labelKey: string
): Resource[] {
  return fragment
    .map(label => label[labelKey])
    .filter(label => label && label.isBroken === false)
    .map(label => transformResourceType(label.data));
}

function transformResourceType(fragment: Record<string, any>): Resource {
  return {
    id: fragment.id,
    title: asText(fragment.title),
    description: fragment.description,
    icon: fragment.icon,
  };
}

function transformExhibitionFormat(
  format: ExhibitionFormatPrismicDocument
): ExhibitionFormat {
  return {
    id: format.id,
    title: (format.data && asText(format.data.title)) || '',
    description: format.data && asHtml(format.data.description),
  };
}

export function transformExhibition(
  document: ExhibitionPrismicDocument
): Exhibition {
  const genericFields = transformGenericFields(document);
  const data = document.data;
  const promo = data.promo;
  const exhibitIds = data.exhibits
    ? data.exhibits.map(i => prismicH.isFilled.link(i.item) && i.item.id)
    : [];
  const eventIds = data.events
    ? data.events.map(i => prismicH.isFilled.link(i.item) && i.item.id)
    : [];
  const articleIds = data.articles
    ? data.articles.map(i => prismicH.isFilled.link(i.item) && i.item.id)
    : [];
  const relatedIds = [...exhibitIds, ...eventIds, ...articleIds].filter(
    Boolean
  ) as string[];

  const promoSquare = promo && transformImagePromo(promo, 'square');

  const id = document.id;

  // TODO: Work out how to get this to type check without the 'as any'.
  const format = isFilledLinkToDocumentWithData(data.format)
    ? transformExhibitionFormat(data.format as any)
    : undefined;

  const url = `/exhibitions/${id}`;
  const title = asTitle(data.title);
  const start = transformTimestamp(data.start)!;
  const end = data.end ? transformTimestamp(data.end) : undefined;
  const statusOverride = asText(data.statusOverride);
  const bslInfo = asRichText(data.bslInfo);
  const audioDescriptionInfo = asRichText(data.audioDescriptionInfo);

  const promoCrop = '16:9';
  const promoImage =
    promo && promo.length > 0
      ? transformPromoToCaptionedImage(data.promo, promoCrop)
      : undefined;

  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(
    season => transformSeason(season as SeasonPrismicDocument)
  );

  const exhibits: Exhibit[] = transformSingleLevelGroup(
    data.exhibits,
    'item'
  ).map(exhibit => {
    return {
      exhibitType: 'exhibitions',
      item: transformExhibition(exhibit as ExhibitionPrismicDocument),
    };
  });

  const place = isFilledLinkToDocumentWithData(data.place)
    ? transformPlace(data.place)
    : undefined;

  const contributors = transformContributors(document);

  const exhibition = {
    ...genericFields,
    shortTitle: data.shortTitle && asText(data.shortTitle),
    format,
    start,
    end,
    isPermanent: data.isPermanent === 'yes',
    statusOverride,
    bslInfo,
    audioDescriptionInfo,
    place,
    exhibits,
    contributors,
    promo: promoImage && {
      id,
      format,
      url,
      title,
      shortTitle: data.shortTitle && asText(data.shortTitle),
      image: promoImage && promoImage.image,
      squareImage: promoSquare && promoSquare.image,
      start,
      end,
      statusOverride,
    },
    resources: Array.isArray(data.resources)
      ? transformResourceTypeList(data.resources, 'resource')
      : [],
    relatedIds,
    seasons,
  };

  const labels = exhibition.isPermanent
    ? [
        {
          text: 'Permanent exhibition',
        },
      ]
    : exhibition.format
    ? [
        {
          text: exhibition.format.title,
        },
      ]
    : [{ text: 'Exhibition' }];

  return { ...exhibition, type: 'exhibitions', labels };
}

export function transformExhibitionToExhibitionBasic(
  exhibition: Exhibition
): ExhibitionBasic {
  // returns what is required to render ExhibitionPromos and exhibition JSON-LD
  return (({
    type,
    id,
    title,
    promo,
    format,
    start,
    end,
    isPermanent,
    statusOverride,
    contributors,
    labels,
  }) => ({
    type,
    id,
    title,
    promo,
    format,
    start,
    end,
    isPermanent,
    statusOverride,
    contributors,
    labels,
  }))(exhibition);
}

export function transformExhibitionsQuery(
  query: Query<ExhibitionPrismicDocument>
): PaginatedResults<ExhibitionBasic> {
  const paginatedResult = transformQuery(query, exhibition =>
    transformExhibitionToExhibitionBasic(transformExhibition(exhibition))
  );

  return {
    ...paginatedResult,
    results: putPermanentAfterCurrentExhibitions(paginatedResult.results),
  };
}

function putPermanentAfterCurrentExhibitions(
  exhibitions: ExhibitionBasic[]
): ExhibitionBasic[] {
  // We order the list this way as, from a user's perspective, seeing the
  // temporary exhibitions is more urgent, so they're at the front of the list,
  // but there's no good way to express that ordering through Prismic's ordering
  const now = new Date();

  const groupedResults = exhibitions.reduce(
    (acc, result) => {
      // Wishing there was `groupBy`.
      if (result.isPermanent) {
        acc.permanent.push(result);
      } else if (result.start.valueOf() >= now.valueOf()) {
        acc.comingUp.push(result);
      } else if (result.end && result.end.valueOf() < now.valueOf()) {
        acc.past.push(result);
      } else {
        acc.current.push(result);
      }

      return acc;
    },
    {
      current: [] as ExhibitionBasic[],
      permanent: [] as ExhibitionBasic[],
      comingUp: [] as ExhibitionBasic[],
      past: [] as ExhibitionBasic[],
    }
  );

  return [
    ...groupedResults.current,
    ...groupedResults.permanent,
    ...groupedResults.comingUp,
    ...groupedResults.past,
  ];
}

export const transformExhibitionRelatedContent = (
  query: Query<ExhibitionRelatedContentPrismicDocument>
): ExhibitionRelatedContent => {
  const parsedContent = transformQuery(
    query,
    transformMultiContent
  ).results.filter(doc => {
    return !(doc.type === 'events' && doc.isPast);
  });

  return {
    exhibitionOfs: parsedContent.filter(
      doc => doc.type === 'exhibitions' || doc.type === 'events'
    ),
    exhibitionAbouts: parsedContent.filter(
      doc => doc.type === 'books' || doc.type === 'articles'
    ),
  } as ExhibitionRelatedContent;
};

// When exhibitions are serialised as JSON then re-parsed, the times will be
// strings instead of JavaScript Date types.
//
// Convert them back to the right types.
export function fixExhibitionDatesInJson(exhibition: Exhibition): Exhibition {
  return {
    ...exhibition,
    start: exhibition.start && new Date(exhibition.start),
    end: exhibition.end && new Date(exhibition.end),
  };
}
