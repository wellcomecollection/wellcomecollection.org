import * as prismic from '@prismicio/client';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { a11y } from '@weco/common/data/microcopy';
import {
  a11YVisual,
  accessibility,
  accessible,
  bslSquare,
  calendar,
  clock,
  IconSvg,
  location,
  ticket,
} from '@weco/common/icons';
import { isFuture } from '@weco/common/utils/dates';
import { formatDate } from '@weco/common/utils/format-date';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { LabelField } from '@weco/content/model/label-field';
import { Exhibition as ExhibitionType } from '@weco/content/types/exhibitions';

type ExhibitionItem = LabelField & {
  icon?: IconSvg;
};

function getUpcomingExhibitionObject(
  exhibition: ExhibitionType
): ExhibitionItem | undefined {
  return isFuture(exhibition.start)
    ? {
        description: [
          {
            type: 'paragraph',
            text: `Opening on ${formatDate(exhibition.start)}`,
            spans: [],
          },
        ],
        icon: calendar,
      }
    : undefined;
}

function getAdmissionObject(): ExhibitionItem {
  return {
    description: [
      {
        type: 'paragraph',
        text: 'Free admission',
        spans: [],
      },
    ],
    icon: ticket,
  };
}

function getTodaysHoursObject(): ExhibitionItem {
  const todaysHoursText = 'Galleries open Tuesday–Sunday, Opening times';

  const link: prismic.RTLinkNode = {
    type: 'hyperlink',
    start: todaysHoursText.length - 'Opening times'.length,
    end: todaysHoursText.length,
    data: {
      link_type: 'Web',
      url: `/visit-us/${prismicPageIds.openingTimes}`,
    },
  };

  return {
    description: [
      {
        type: 'paragraph',
        text: todaysHoursText,
        spans: [link],
      },
    ],
    icon: clock,
  };
}

function getPlaceObject(
  exhibition: ExhibitionType
): ExhibitionItem | undefined {
  return (
    exhibition.place && {
      description: [
        {
          type: 'paragraph',
          text: `${exhibition.place.title}, level ${exhibition.place.level}`,
          spans: [],
        },
      ],
      icon: location,
    }
  );
}

function getAccessibilityItems(exhibitionId: string): ExhibitionItem[] {
  const createContent = (text: string, icon: IconSvg) => ({
    description: [
      {
        type: 'paragraph',
        text,
        spans: [],
      },
    ] as prismic.RichTextField,
    icon,
  });

  const accessibilityItems: {
    description: prismic.RichTextField;
    icon: IconSvg;
  }[] = [
    createContent(a11y.stepFreeAccess, accessible),
    createContent(a11y.largePrintGuides, a11YVisual),
    // Hopefully temporary condition to hide BSL and access resources from Finger Talks Installation
    ...(exhibitionId !== 'aEqnVBEAACMA2k3b'
      ? [
          createContent(a11y.bsl, bslSquare),
          createContent(a11y.accessResources, accessibility),
        ]
      : []),
  ];

  return accessibilityItems.filter(item => {
    if (item.description[0] && 'text' in item.description[0]) {
      return item.description[0]?.text !== a11y.largePrintGuides;
    } else {
      return true;
    }
  });
}

export function getInfoItems(exhibition: ExhibitionType): ExhibitionItem[] {
  return [
    getUpcomingExhibitionObject(exhibition),
    getAdmissionObject(),
    getTodaysHoursObject(),
    getPlaceObject(exhibition),
    ...getAccessibilityItems(exhibition.id),
  ].filter(isNotUndefined);
}
