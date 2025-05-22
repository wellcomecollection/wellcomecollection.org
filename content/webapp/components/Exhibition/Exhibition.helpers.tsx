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

function getAccessibilityItems(): ExhibitionItem[] {
  const accessibilityItems: {
    description: prismic.RichTextField;
    icon: IconSvg;
  }[] = [
    {
      description: [
        {
          type: 'paragraph',
          text: a11y.stepFreeAccess,
          spans: [],
        },
      ],
      icon: accessible,
    },
    {
      description: [
        {
          type: 'paragraph',
          text: a11y.largePrintGuides,
          spans: [],
        },
      ],
      icon: a11YVisual,
    },
    {
      description: [
        {
          type: 'paragraph',
          text: a11y.bsl,
          spans: [],
        },
      ],
      icon: bslSquare,
    },
    {
      description: [
        {
          type: 'paragraph',
          text: a11y.accessResources,
          spans: [],
        },
      ],
      icon: accessibility,
    },
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
    ...getAccessibilityItems(),
  ].filter(isNotUndefined);
}
