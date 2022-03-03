import { Fragment, useState, useEffect, FC } from 'react';
import { isPast, isFuture } from '@weco/common/utils/dates';
import { formatDate } from '@weco/common/utils/format-date';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader, {
  getFeaturedMedia,
  getHeroPicture,
} from '@weco/common/views/components/PageHeader/PageHeader';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import InfoBox from '@weco/common/views/components/InfoBox/InfoBox';
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
import { exhibitionLd } from '../../services/prismic/transformers/json-ld';
import { isNotUndefined } from '@weco/common/utils/array';
import { a11y } from '@weco/common/data/microcopy';
import { fetchExhibitionRelatedContentClientSide } from '../../services/prismic/fetch/exhibitions';
import { Exhibition as ExhibitionType } from '../../types/exhibitions';
import { Book } from '../../types/books';
import { Article } from '../../types/articles';
import { Event as EventType } from '../../types/events';

type ExhibitionItem = LabelField & {
  icon?: IconSvg;
};

function getUpcomingExhibitionObject(
  exhibition: ExhibitionType
): ExhibitionItem | undefined {
  return isFuture(exhibition.start)
    ? {
        id: undefined,
        title: undefined,
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
    id: undefined,
    title: undefined,
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

  return {
    id: undefined,
    title: undefined,
    description: [
      {
        type: 'paragraph',
        text: todaysHoursText,
        spans: [
          {
            type: 'hyperlink',
            start: todaysHoursText.length - 13,
            end: todaysHoursText.length,
            data: {
              url: '/opening-times',
            },
          },
        ],
      },
    ],
    icon: clock,
  };
}

function getPlaceObject(exhibition: ExhibitionType): ExhibitionItem | undefined {
  return (
    exhibition.place && {
      id: undefined,
      title: undefined,
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
  information: information,
  family: family,
};

function getResourcesItems(exhibition: ExhibitionType): ExhibitionItem[] {
  return exhibition.resources.map(resource => {
    return {
      id: undefined,
      title: undefined,
      description: resource.description,
      icon: resource.icon ? resourceIcons[resource.icon] : undefined,
    };
  });
}

function getBslAdItems(exhibition: ExhibitionType): ExhibitionItem[] {
  return [exhibition.bslInfo, exhibition.audioDescriptionInfo]
    .filter(Boolean)
    .map(item => {
      return {
        id: undefined,
        title: undefined,
        description: item,
        icon:
          item === exhibition.bslInfo ? britishSignLanguage : audioDescribed,
      };
    });
}

function getAccessibilityItems(): ExhibitionItem[] {
  return [
    {
      id: undefined,
      title: undefined,
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
      id: undefined,
      title: undefined,
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
    ...getResourcesItems(exhibition),
    ...getAccessibilityItems(),
    ...getBslAdItems(exhibition),
  ].filter(isNotUndefined);
}

type Props = {
  exhibition: ExhibitionType;
  pages: PageType[];
};

const Exhibition: FC<Props> = ({ exhibition, pages }) => {
  type ExhibitionOf = (ExhibitionType | EventType)[];
  type ExhibitionAbout = (Book | Article)[];

  const [exhibitionOfs, setExhibitionOfs] = useState<ExhibitionOf>([]);
  const [exhibitionAbouts, setExhibitionAbouts] = useState<ExhibitionAbout>([]);

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

  const genericFields = {
    id: exhibition.id,
    title: exhibition.title,
    promo: exhibition.promo,
    body: exhibition.body,
    standfirst: exhibition.standfirst,
    promoImage: exhibition.promoImage,
    promoText: exhibition.promoText,
    image: exhibition.image,
    squareImage: exhibition.squareImage,
    widescreenImage: exhibition.widescreenImage,
    superWidescreenImage: exhibition.superWidescreenImage,
    labels: exhibition.labels,
    metadataDescription: exhibition.metadataDescription,
  };

  // TODO: Do we need to re-cast to Date here?  We've sometimes seen issues
  // caused by JSON serialisation, but that should be handled elsewhere by
  // the fixExhibitionDatesInJson helper.
  const DateInfo = exhibition.end ? (
    <DateRange
      start={new Date(exhibition.start)}
      end={new Date(exhibition.end)}
    />
  ) : (
    <HTMLDate date={new Date(exhibition.start)} />
  );

  // This is for content that we don't have the crops for in Prismic
  const maybeHeroPicture = getHeroPicture(genericFields);
  const maybeFeaturedMedia = !maybeHeroPicture
    ? getFeaturedMedia(genericFields)
    : undefined;

  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{ labels: exhibition.labels }}
      title={exhibition.title}
      Background={undefined}
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
    <PageLayout
      title={exhibition.title}
      description={exhibition.metadataDescription || exhibition.promoText || ''}
      url={{ pathname: `/exhibitions/${exhibition.id}` }}
      jsonLd={exhibitionLd(exhibition)}
      openGraphType={'website'}
      siteSection={'whats-on'}
      image={exhibition.image}
    >
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
            title={`In this exhibition`}
          />
        )}

        {exhibition.end && !isPast(exhibition.end) && (
          <InfoBox title="Visit us" items={getInfoItems(exhibition)}>
            <p className={`no-margin ${font('hnr', 5)}`}>
              <a href="/access">All our accessibility services</a>
            </p>
          </InfoBox>
        )}
        {exhibitionAbouts.length > 0 && (
          <SearchResults
            items={exhibitionAbouts}
            title={`About this exhibition`}
          />
        )}
      </ContentPage>
    </PageLayout>
  );
};
export default Exhibition;
