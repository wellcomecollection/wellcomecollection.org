import {
  wellcomeCollectionAddress,
  wellcomeCollectionGallery,
} from '@weco/common/data/organization';
import { Organization } from '@weco/common/model/organization';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { objToJsonLd } from '@weco/common/utils/json-ld';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { getImageUrlAtSize } from '@weco/content/services/prismic/types/images';
import {
  Article as ArticleContentApi,
  EventDocument as EventContentApi,
} from '@weco/content/services/wellcome/content/types/api';
import { Article } from '@weco/content/types/articles';
import { Contributor } from '@weco/content/types/contributors';
import { Event } from '@weco/content/types/events';
import {
  ExhibitionGuide,
  ExhibitionHighlightTour,
  ExhibitionText,
} from '@weco/content/types/exhibition-guides';
import { Exhibition } from '@weco/content/types/exhibitions';
import { Guide } from '@weco/content/types/guides';
import { Page } from '@weco/content/types/pages';
import { Project } from '@weco/content/types/projects';
import { Season } from '@weco/content/types/seasons';
import { Series } from '@weco/content/types/series';
import { VisualStory } from '@weco/content/types/visual-stories';

// Guide from schema.org
// https://schema.org/Thing
//   {
//     "@context": "https://schema.org/",
//     "@type": "Thing",
//     "name": "Schema.org Ontology",
//     "subjectOf": {
//       "@type": "Book",
//       "name": "The Complete History of Schema.org"
//     }
//   }

function contributorLd(contributors: Contributor[]) {
  return contributors.map(({ contributor }) => {
    const type = contributor.type === 'people' ? 'Person' : 'Organization';
    return objToJsonLd(
      {
        name: contributor.name,
        image: contributor.image
          ? getImageUrlAtSize(contributor.image, { w: 600 })
          : undefined,
      },
      { type, root: false }
    );
  });
}

export function exhibitionGuideLd(
  exhibitionGuide: ExhibitionGuide | ExhibitionText | ExhibitionHighlightTour
): JsonLdObj {
  return objToJsonLd(
    {
      '@type': 'Thing',
      name: exhibitionGuide.title,
      text: exhibitionGuide.relatedExhibition?.description,
      subjectOf: {
        '@type': 'Exhibition',
        name: exhibitionGuide.relatedExhibition?.title,
      },
      discussionUrl: `https://wellcomecollection.org/guides/exhibition/${exhibitionGuide.id}`,
      potentialAction: 'make use of a guide whilst visiting an exhibition',
      mainEntityOfPage: `https://wellcomecollection.org/guides/exhibitions/${exhibitionGuide.id}`,
    },
    { type: 'ExhibitionGuide' }
  );
}

export function exhibitionLd(exhibition: Exhibition): JsonLdObj {
  const promoImage = exhibition.promo?.image;
  return objToJsonLd(
    {
      name: exhibition.title,
      description: exhibition.promo?.caption,
      image: promoImage ? getImageUrlAtSize(promoImage, { w: 600 }) : undefined,
      location: {
        '@type': 'Place',
        name: 'Wellcome Collection',
        address: objToJsonLd(wellcomeCollectionAddress, {
          type: 'PostalAddress',
          root: false,
        }),
      },
      startDate: exhibition.start,
      endDate: exhibition.end,
      url: `https://wellcomecollection.org/exhibitions/${exhibition.id}`,
      isAccessibleForFree: true,
      performers: contributorLd(exhibition.contributors),
    },
    { type: 'ExhibitionEvent' }
  );
}

export function eventLd(event: Event): JsonLdObj[] {
  const promoImage = event.promo?.image;
  return event.times
    .map(eventTime => {
      // I don't like it, but mutation seems the easiest way here >.<
      const eventWith1Time = Object.assign({}, event);
      eventWith1Time.times = [eventTime];
      return eventWith1Time;
    })
    .map(event => {
      return objToJsonLd(
        {
          name: event.title,
          // Theoretically an event might not be at Wellcome, in which case we'd
          // want to change this, but we don't have any information about external
          // locations in our Prismic model (or anywhere else!) so hard-coding this
          // is fine for now.
          location: {
            '@type': 'Place',
            name: 'Wellcome Collection',
            address: objToJsonLd(wellcomeCollectionAddress, {
              type: 'PostalAddress',
              root: false,
            }),
          },
          startDate: event.times.map(time => time.range.startDateTime),
          endDate: event.times.map(time => time.range.endDateTime),
          description: event.promo?.caption,
          image: promoImage
            ? getImageUrlAtSize(promoImage, { w: 600 })
            : undefined,
          isAccessibleForFree: !event.cost,
          performers: contributorLd(event.contributors),
        },
        { type: 'Event' }
      );
    });
}

export function eventLdContentApi(event: EventContentApi): JsonLdObj[] {
  const promoImage = event.image;

  return event.times
    .map(eventTime => {
      const eventWith1Time = Object.assign({}, event);
      eventWith1Time.times = [eventTime];
      return eventWith1Time;
    })
    .map(event => {
      return objToJsonLd(
        {
          name: event.title,
          // Theoretically an event might not be at Wellcome, in which case we'd
          // want to change this, but we don't have any information about external
          // locations in our Prismic model (or anywhere else!) so hard-coding this
          // is fine for now.
          location: {
            '@type': 'Place',
            name: 'Wellcome Collection',
            address: objToJsonLd(wellcomeCollectionAddress, {
              type: 'PostalAddress',
              root: false,
            }),
          },
          startDate: event.times.map(time => time.startDateTime),
          endDate: event.times.map(time => time.endDateTime),
          // description: event.promo?.caption, // TODO, add to event result?
          image: promoImage
            ? getImageUrlAtSize(promoImage, { w: 600 })
            : undefined,
          // isAccessibleForFree: !event.cost, // TODO?
          // performers: contributorLd(event.contributors), //TODO?
        },
        { type: 'Event' }
      );
    });
}

export function articleSeriesLd(series: Series): JsonLdObj {
  return objToJsonLd(
    {
      headline: series.title,
      contributor: contributorLd(series.contributors),
      image: series.promo?.image?.contentUrl,
      publisher: orgLd(wellcomeCollectionGallery),
      url: `https://wellcomecollection.org/series/${series.id}`,
    },
    { type: 'Series' }
  );
}

export function visualStoryLd(visualStory: VisualStory): JsonLdObj {
  const visualStoryPath = visualStory.relatedDocument?.id
    ? `${visualStory.relatedDocument.type}/${visualStory.relatedDocument.id}/visual-stories`
    : `visual-stories/${visualStory.id}`;

  return objToJsonLd(
    {
      dateCreated: visualStory.datePublished,
      datePublished: visualStory.datePublished,
      headline: visualStory.title,
      image: visualStory.promo?.image?.contentUrl,
      publisher: orgLd(wellcomeCollectionGallery),
      url: `https://wellcomecollection.org/${visualStoryPath}`,
    },
    {
      type: 'WebPage',
    }
  );
}

export function articleLd(article: Article): JsonLdObj {
  // We've left the role off of a lot of articles
  const author: Contributor = article.contributors.find(
    ({ role }) => role && role.title === 'Author'
  )?.[0];

  return objToJsonLd(
    {
      contributor: contributorLd(article.contributors),
      dateCreated: article.datePublished,
      datePublished: article.datePublished,
      headline: article.title,
      author:
        author && author.contributor
          ? objToJsonLd(
              {
                name: author.contributor.name,
                image: author.contributor.image
                  ? getImageUrlAtSize(author.contributor.image, { w: 600 })
                  : undefined,
              },
              { type: 'Person', root: false }
            )
          : undefined,
      image: article.promo?.image?.contentUrl,
      // TODO: isPartOf
      publisher: orgLd(wellcomeCollectionGallery),
      url: `https://wellcomecollection.org/articles/${article.id}`,
    },
    { type: 'Article' }
  );
}

export function articleLdContentApi(article: ArticleContentApi) {
  const author: Contributor = article.contributors.find(
    ({ role }) => role && role.label === 'Author'
  )?.[0];

  const contributors = article.contributors
    .map(c => {
      return c.contributor?.label
        ? {
            name: c.contributor?.label,
            '@type': 'Person',
          }
        : undefined;
    })
    .filter(_ => _);

  return objToJsonLd(
    {
      contributor: contributors,
      dateCreated: article.publicationDate,
      datePublished: article.publicationDate,
      headline: article.title,
      author:
        author && author.contributor
          ? objToJsonLd(
              {
                name: author.contributor.name,
                image: author.contributor.image
                  ? getImageUrlAtSize(author.contributor.image, { w: 600 })
                  : undefined,
              },
              { type: 'Person', root: false }
            )
          : undefined,
      image: article.image?.url,
      publisher: orgLd(wellcomeCollectionGallery),
      url: `https://wellcomecollection.org/articles/${article.id}`,
    },
    { type: 'Article' }
  );
}

function orgLd(org: Organization) {
  return (
    org &&
    objToJsonLd(
      {
        name: org.name,
        url: org.url,
        logo: org.logo.url,
        sameAs: org.sameAs,
      },
      { type: 'Organization' }
    )
  );
}

export function contentLd(content: Page | Guide | Project | Season): JsonLdObj {
  const contributors =
    content.type === 'seasons' || content.type === 'guides'
      ? []
      : content.contributors;

  const author: Contributor = contributors?.find(
    ({ role }) => role && role.title === 'Author'
  )?.[0];

  const promoImage = content.promo?.image;

  const url = linkResolver(content);

  return objToJsonLd(
    {
      headline: content.title,
      author:
        author && author.contributor
          ? objToJsonLd(
              {
                name: author.contributor.name,
                image: author?.contributor?.image
                  ? getImageUrlAtSize(author.contributor.image, { w: 600 })
                  : undefined,
              },
              { type: 'Person', root: false }
            )
          : undefined,
      image: promoImage ? getImageUrlAtSize(promoImage, { w: 600 }) : undefined,
      datePublished:
        content.type !== 'projects' ? content.datePublished : undefined,
      dateModified:
        content.type !== 'projects' ? content.datePublished : undefined,
      publisher: orgLd(wellcomeCollectionGallery),
      mainEntityOfPage: `https://wellcomecollection.org${url}`,
    },
    { type: 'Article' }
  );
}
