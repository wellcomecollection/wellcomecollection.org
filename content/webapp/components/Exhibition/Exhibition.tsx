import { Fragment, useState, useEffect, FunctionComponent } from 'react';
import { isPast, isFuture } from '@weco/common/utils/dates';
import { formatDate } from '@weco/common/utils/format-date';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { getFeaturedMedia, getHeroPicture } from '../../utils/page-header';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import StatusIndicator from '../../components/StatusIndicator/StatusIndicator';
import InfoBox from '../InfoBox/InfoBox';
import { font } from '@weco/common/utils/classnames';
import { Page as PageType } from '../../types/pages';
import Space from '@weco/common/views/components/styled/Space';
import { LabelField } from '@weco/common/model/label-field';
import {
  calendar,
  clock,
  ticket,
  location,
  a11Y,
  a11YVisual,
  information,
  family,
  IconSvg,
  britishSignLanguage,
  audioDescribed,
} from '@weco/common/icons';
import Body from '../Body/Body';
import SearchResults from '../SearchResults/SearchResults';
import ContentPage from '../ContentPage/ContentPage';
import Contributors from '../Contributors/Contributors';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { a11y } from '@weco/common/data/microcopy';
import { fetchExhibitionRelatedContentClientSide } from '../../services/prismic/fetch/exhibitions';
import {
  Exhibition as ExhibitionType,
  ExhibitionAbout,
} from '../../types/exhibitions';

import { EventBasic } from '../../types/events';
import * as prismic from '@prismicio/client';
import styled from 'styled-components';

import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';

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

function getadmissionObject(): ExhibitionItem {
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
      url: '/opening-times',
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

// These options are defined in exhibition-resources.ts
const resourceIcons: { [key: string]: IconSvg } = {
  information,
  family,
};

function getBslAdItems(exhibition: ExhibitionType): ExhibitionItem[] {
  return [exhibition.bslInfo, exhibition.audioDescriptionInfo]
    .filter(Boolean)
    .map(item => {
      return {
        description: item,
        icon:
          item === exhibition.bslInfo ? britishSignLanguage : audioDescribed,
      };
    });
}

function getAccessibilityItems(): ExhibitionItem[] {
  return [
    {
      description: [
        {
          type: 'paragraph',
          text: a11y.stepFreeAccess,
          spans: [],
        },
      ],
      icon: a11Y,
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
  ];
}

export function getInfoItems(exhibition: ExhibitionType): ExhibitionItem[] {
  return [
    getUpcomingExhibitionObject(exhibition),
    getadmissionObject(),
    getTodaysHoursObject(),
    getPlaceObject(exhibition),
    ...getAccessibilityItems(),
    ...getBslAdItems(exhibition),
  ].filter(isNotUndefined);
}

export const AccessibilityServices = styled.p.attrs({
  className: font('intr', 5),
})`
  margin: 0;
`;

type Props = {
  exhibition: ExhibitionType;
  pages: PageType[];
};

const Exhibition: FunctionComponent<Props> = ({ exhibition, pages }) => {
  type ExhibitionOf = (ExhibitionType | EventBasic)[];

  const [exhibitionOfs, setExhibitionOfs] = useState<ExhibitionOf>([]);
  const [exhibitionAbouts, setExhibitionAbouts] = useState<ExhibitionAbout[]>(
    []
  );

  useEffect(() => {
    const ids = exhibition.relatedIds;

    fetchExhibitionRelatedContentClientSide(ids).then(relatedContent => {
      if (isNotUndefined(relatedContent)) {
        setExhibitionOfs(relatedContent.exhibitionOfs);
        setExhibitionAbouts(relatedContent.exhibitionAbouts);
      }
    });
  }, []);

  const breadcrumbs = {
    items: [
      {
        url: '/exhibitions',
        text: 'Exhibitions',
      },
      {
        url: `/exhibitions/${exhibition.id}`,
        text: exhibition.title,
        isHidden: true,
      },
    ],
  };

  const DateInfo = exhibition.end ? (
    <DateRange start={exhibition.start} end={exhibition.end} />
  ) : (
    <HTMLDate date={exhibition.start} />
  );

  // This is for content that we don't have the crops for in Prismic
  const maybeHeroPicture = getHeroPicture(exhibition);
  const maybeFeaturedMedia = !maybeHeroPicture
    ? getFeaturedMedia(exhibition)
    : undefined;

  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{ labels: exhibition.labels }}
      title={exhibition.title}
      ContentTypeInfo={
        <Fragment>
          {!exhibition.isPermanent && (
            <Space v={{ size: 'xs', properties: ['margin-bottom'] }}>
              {DateInfo}
            </Space>
          )}
          <StatusIndicator
            start={exhibition.start}
            end={exhibition.end || new Date()}
            statusOverride={exhibition.statusOverride}
          />
        </Fragment>
      }
      FeaturedMedia={maybeFeaturedMedia}
      HeroPicture={maybeHeroPicture}
      isFree={true}
      isContentTypeInfoBeforeMedia={true}
    />
  );

  return (
    <ContentPage
      id={exhibition.id}
      Header={Header}
      Body={<Body body={exhibition.body} pageId={exhibition.id} />}
      seasons={exhibition.seasons}
      // We hide contributors as we show them further up the page
      hideContributors={true}
    >
      {exhibition.contributors.length > 0 && (
        <Contributors contributors={exhibition.contributors} />
      )}

      {/* TODO: This probably isn't going to be the final resting place for related `pages`, but it's
        a reasonable starting place. Update this once the UX has shaken out. */}
      {(exhibitionOfs.length > 0 || pages.length > 0) && (
        <SearchResults
          items={[...exhibitionOfs, ...pages]}
          title="In this exhibition"
        />
      )}

      {exhibition.end && !isPast(exhibition.end) && (
        <InfoBox title="Visit us" items={getInfoItems(exhibition)}>
          <AccessibilityServices>
            For more information, please visit our{' '}
            <a href="/access">Accessibility</a> page. If you have any queries
            about accessibility, please email us at{' '}
            <a href="mailto:access@wellcomecollection.org">
              access@wellcomecollection.org
            </a>{' '}
            or call{' '}
            {/*
        This is to ensure phone numbers are read in a sensible way by
        screen readers.
      */}
            <span className="visually-hidden">
              {createScreenreaderLabel('020 7611 2222')}
            </span>
            <span aria-hidden="true">020&nbsp;7611&nbsp;2222.</span>
          </AccessibilityServices>
        </InfoBox>
      )}
      {exhibitionAbouts.length > 0 && (
        <SearchResults items={exhibitionAbouts} title="Related stories" />
      )}
    </ContentPage>
  );
};
export default Exhibition;
