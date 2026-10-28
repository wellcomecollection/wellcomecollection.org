import { BreadcrumbItems } from '@weco/common/model/breadcrumbs';
import type {
  OpeningHours,
  OpeningHoursDay,
  SpecialOpeningHours,
} from '@weco/common/model/opening-hours';
import { Organization } from '@weco/common/model/organization';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';

import { convertImageUri } from './convert-image-uri';
import { formatDate } from './format-date';

type ObjToJsonLdProps = { type: string; root?: boolean };

export function objToJsonLd<T>(
  obj: T,
  { type, root = true }: ObjToJsonLdProps
): T & JsonLdObj {
  const jsonObj = JSON.parse(JSON.stringify(obj));
  const jsonLdAddition = root
    ? {
        '@context': 'http://schema.org',
        '@type': type,
      }
    : { '@type': type };
  return { ...jsonObj, ...jsonLdAddition };
}

export function museumLd(museum: Organization): JsonLdObj {
  return objToJsonLd(
    {
      ...museum,
      logo: imageLd(museum.logo),
    },
    { type: 'Museum' }
  );
}

export function libraryLd(library: Organization): JsonLdObj {
  return objToJsonLd(
    {
      ...library,
      logo: imageLd(library.logo),
    },
    { type: 'Library' }
  );
}

export function breadcrumbsLd(breadcrumbs: BreadcrumbItems): JsonLdObj {
  return objToJsonLd(
    {
      itemListElement: breadcrumbs.items.map(({ url, text }, i) => {
        return objToJsonLd(
          {
            position: i,
            name: text,
            item: `https://wellcomecollection.org${url}`,
          },
          { type: 'ListItem', root: false }
        );
      }),
    },
    { type: 'BreadcrumbList' }
  );
}

type WebpageProps = {
  url: string;
};

export function webpageLd(url: WebpageProps): JsonLdObj {
  return objToJsonLd({ url }, { type: 'WebPage' });
}

type Image = {
  contentUrl?: string;
  url?: string;
  width?: number;
  height?: number;
};

function imageLd(image: Image) {
  return (
    image &&
    objToJsonLd(
      {
        url: convertImageUri((image.contentUrl || image.url)!, 1200),

        width: image.width,
        height: image.height,
      },
      { type: 'ImageObject' }
    )
  );
}

export function openingHoursLd(openingHours: OpeningHours | undefined): {
  openingHoursSpecification: OpeningHoursDay[];
  specialOpeningHoursSpecification: SpecialOpeningHours[];
} {
  return {
    openingHoursSpecification: openingHours?.regular
      ? openingHours.regular.map(openingHoursDay => {
          return objToJsonLd(
            {
              dayOfWeek: openingHoursDay.dayOfWeek,
              opens: openingHoursDay.opens,
              closes: openingHoursDay.closes,
            },
            { type: 'OpeningHoursSpecification', root: false }
          );
        })
      : [],
    specialOpeningHoursSpecification: openingHours?.exceptional
      ? openingHours.exceptional.map(openingHoursDate => {
          const specObject = {
            opens: openingHoursDate.opens,
            closes: openingHoursDate.closes,
            validFrom: formatDate(openingHoursDate.overrideDate),
            validThrough: formatDate(openingHoursDate.overrideDate),
          };
          return objToJsonLd(specObject, {
            type: 'OpeningHoursSpecification',
            root: false,
          });
        })
      : [],
  };
}
