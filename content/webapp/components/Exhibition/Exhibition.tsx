import React, { Fragment, useState, useEffect, FunctionComponent } from 'react';
import { getExhibitionRelatedContent } from '@weco/common/services/prismic/exhibitions';
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
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { UiExhibition } from '@weco/common/model/exhibitions';
import { Page } from '@weco/common/model/pages';
import Space from '@weco/common/views/components/styled/Space';
import {
  calendar,
  clock,
  ticket,
  location,
  a11Y,
  a11YVisual,
  information,
  family,
} from '@weco/common/icons';
import Body from '../Body/Body';
import SearchResults from '../SearchResults/SearchResults';
import ContentPage from '../ContentPage/ContentPage';
import Contributors from '../Contributors/Contributors';
import { exhibitionLd } from '../../services/prismic/transformers/json-ld';

function getUpcomingExhibitionObject(exhibition) {
  return isFuture(exhibition.start)
    ? {
        id: null,
        title: null,
        description: [
          {
            type: 'paragraph',
            text: `Opening on ${formatDate(exhibition.start)}`,
            spans: [],
          },
        ],
        icon: calendar,
      }
    : null;
}

function getadmissionObject() {
  return {
    id: null,
    title: null,
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

function getTodaysHoursObject() {
  const todaysHoursText = 'Galleries open Tuesday–Sunday, Opening times';

  return {
    id: null,
    title: null,
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

function getPlaceObject(exhibition) {
  return (
    exhibition.place && {
      id: null,
      title: null,
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

// These options are defined in exhibition-resources.js
const resourceIcons: { [key: string]: FunctionComponent } = {
  information: information,
  family: family,
};

function getResourcesItems(exhibition) {
  return exhibition.resources.map(resource => {
    return {
      id: null,
      title: null,
      description: resource.description,
      icon: resource.icon ? resourceIcons[resource.icon] : undefined,
    };
  });
}

function getAccessibilityItems() {
  return [
    {
      id: null,
      title: null,
      description: [
        {
          type: 'paragraph',
          text: 'Step-free access is available to all floors of the building',
          spans: [],
        },
      ],
      icon: a11Y,
    },
    {
      id: null,
      title: null,
      description: [
        {
          type: 'paragraph',
          text: 'Large-print guides, transcripts and magnifiers are available in the gallery',
          spans: [],
        },
      ],
      icon: a11YVisual,
    },
  ];
}

export function getInfoItems(exhibition: UiExhibition) {
  return [
    getUpcomingExhibitionObject(exhibition),
    getadmissionObject(),
    getTodaysHoursObject(),
    getPlaceObject(exhibition),
    ...getResourcesItems(exhibition),
    ...getAccessibilityItems(),
  ].filter(Boolean);
}

type Props = {
  exhibition: UiExhibition;
  pages: Page[];
};

const Exhibition = ({ exhibition, pages }: Props) => {
  const [exhibitionOfs, setExhibitionOfs] = useState([]);
  const [exhibitionAbouts, setExhibitionAbouts] = useState([]);

  useEffect(() => {
    const ids = exhibition.relatedIds;
    getExhibitionRelatedContent(null, ids).then(
      ({ exhibitionOfs, exhibitionAbouts }) => {
        setExhibitionOfs(exhibitionOfs);
        setExhibitionAbouts(exhibitionAbouts);
      }
    );
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
    : null;

  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{ labels: exhibition.labels }}
      title={exhibition.title}
      Background={null}
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
      imageUrl={
        exhibition.image && convertImageUri(exhibition.image.contentUrl, 800)
      }
      imageAltText={exhibition.image ? exhibition.image.alt : undefined}
    >
      <ContentPage
        id={exhibition.id}
        Header={Header}
        Body={<Body body={exhibition.body} pageId={exhibition.id} />}
        seasons={exhibition.seasons}
        document={exhibition.prismicDocument}
        // We hide contributors as we show then further up the page
        hideContributors={true}
      >
        {exhibition.prismicDocument.contributors.length > 0 && (
          <Contributors document={exhibition.prismicDocument} />
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
