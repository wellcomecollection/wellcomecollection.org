import { PrismicDocument } from '@prismicio/types';
import { Exhibition } from '@weco/common/model/exhibitions';
import { Event } from '@weco/common/model/events';
import {
  Organization,
  wellcomeCollectionAddress,
  wellcomeCollectionGallery,
} from '@weco/common/model/organization';
import { getImageUrlAtSize } from '../images';
import { transformMeta } from '../transformers';
import { transformContributors } from './contributors';
import { Article } from '@weco/common/model/articles';
import { Contributor } from '../../../model/contributors';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { Page } from '@weco/common/model/pages';
import { Season } from '@weco/common/model/seasons';
import { CommonPrismicFields, WithContributors } from '../types';

export function objToJsonLd<T>(obj: T, type: string, root = true) {
  const jsonObj = JSON.parse(JSON.stringify(obj));
  const jsonLdAddition = root
    ? {
        '@context': 'http://schema.org',
        '@type': type,
      }
    : { '@type': type };
  return { ...jsonObj, ...jsonLdAddition };
}

export function exhibitionLd(exhibition: Exhibition) {
  const meta = transformMeta(exhibition.prismicDocument);
  const contributors = transformContributors(exhibition.prismicDocument);
  return objToJsonLd(
    {
      name: exhibition.title,
      description: exhibition.promoText,
      image: meta.image ? getImageUrlAtSize(meta.image, { w: 600 }) : undefined,
      location: {
        '@type': 'Place',
        name: 'Wellcome Collection',
        address: objToJsonLd(wellcomeCollectionAddress, 'PostalAddress', false),
      },
      startDate: exhibition.start,
      endDate: exhibition.end,
      url: `https://wellcomecollection.org/exhibitions/${exhibition.id}`,
      isAccessibleForFree: true,
      performers: contributors.map(({ contributor }) => {
        const type = contributor.type === 'people' ? 'Person' : 'Organization';
        return objToJsonLd(
          {
            name: contributor.name,
            image: contributor.image
              ? getImageUrlAtSize(contributor.image, { w: 600 })
              : undefined,
          },
          type,
          false
        );
      }),
    },
    'ExhibitionEvent'
  );
}

export function eventLd(event: Event): JsonLdObj[] {
  const meta = transformMeta(event.prismicDocument);
  const contributors = transformContributors(event.prismicDocument);
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
          // TODO: This is not always at Wellcome, but we don't collect that yet
          location: {
            '@type': 'Place',
            name: 'Wellcome Collection',
            address: objToJsonLd(
              wellcomeCollectionAddress,
              'PostalAddress',
              false
            ),
          },
          startDate: event.times.map(time => time.range.startDateTime),
          endDate: event.times.map(time => time.range.endDateTime),
          description: event.promoText,
          image: meta.image
            ? getImageUrlAtSize(meta.image, { w: 600 })
            : undefined,
          isAccessibleForFree: !event.cost,
          performers: contributors.map(({ contributor }) => {
            const type =
              contributor.type === 'people' ? 'Person' : 'Organization';
            return objToJsonLd(
              {
                name: contributor.name,
                image: contributor.image
                  ? getImageUrlAtSize(contributor.image, { w: 600 })
                  : undefined,
              },
              type,
              false
            );
          }),
        },
        'Event'
      );
    });
}

export function articleLd(article: Article) {
  const contributors = transformContributors(article.prismicDocument);

  // We've left the role off of a lot of articles
  const author: Contributor = contributors.find(
    ({ role }) => role && role.title === 'Author'
  )?.[0];

  return objToJsonLd(
    {
      contributor: contributors.map(({ contributor }) => {
        const type = contributor.type === 'people' ? 'Person' : 'Organization';
        return objToJsonLd(
          {
            name: contributor.name,
            image: contributor.image
              ? getImageUrlAtSize(contributor.image, { w: 600 })
              : undefined,
          },
          type,
          false
        );
      }),
      dateCreated: article.datePublished,
      datePublished: article.datePublished,
      headline: article.title,
      author:
        author && author.contributor
          ? objToJsonLd(
              {
                name: author.contributor.name,
                image: author?.contributor?.image
                  ? getImageUrlAtSize(author.contributor.image, { w: 600 })
                  : undefined,
              },
              'Person',
              false
            )
          : undefined,
      image: article.promoImage && article.promoImage.contentUrl,
      // TODO: isPartOf
      publisher: orgLd(wellcomeCollectionGallery),
      url: `https://wellcomecollection.org/articles/${article.id}`,
    },
    'Article'
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
      'Organization'
    )
  );
}

export function contentLd(content: Page | Season) {
  const {
    prismicDocument,
  }: {
    prismicDocument: PrismicDocument<CommonPrismicFields & WithContributors>;
  } = content;
  const meta = transformMeta(prismicDocument);
  const contributors = transformContributors(prismicDocument);

  const author: Contributor = contributors.find(
    ({ role }) => role && role.title === 'Author'
  )?.[0];

  return objToJsonLd(
    {
      headline: meta.title,
      author:
        author && author.contributor
          ? objToJsonLd(
              {
                name: author.contributor.name,
                image: author?.contributor?.image
                  ? getImageUrlAtSize(author.contributor.image, { w: 600 })
                  : undefined,
              },
              'Person',
              false
            )
          : undefined,
      image: meta.image ? getImageUrlAtSize(meta.image, { w: 600 }) : undefined,
      datePublished: prismicDocument.first_publication_date,
      dateModified: prismicDocument.first_publication_date,
      publisher: orgLd(wellcomeCollectionGallery),
      mainEntityOfPage: `https://wellcomecollection.org${meta.url}`,
    },
    'Article'
  );
}
