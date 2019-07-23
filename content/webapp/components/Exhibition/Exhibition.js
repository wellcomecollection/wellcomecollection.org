// @flow
import { Fragment, useState, useEffect } from 'react';
import { getExhibitionRelatedContent } from '@weco/common/services/prismic/exhibitions';
import { isPast, isFuture } from '@weco/common/utils/dates';
import { formatDate } from '@weco/common/utils/format-date';
import { exhibitionLd } from '@weco/common/utils/json-ld';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import PageHeader, {
  getFeaturedMedia,
  getHeroPicture,
} from '@weco/common/views/components/PageHeader/PageHeader';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import StatusIndicator from '@weco/common/views/components/StatusIndicator/StatusIndicator';
import Contributors from '@weco/common/views/components/Contributors/Contributors';
import SearchResults from '@weco/common/views/components/SearchResults/SearchResults';
import Body from '@weco/common/views/components/Body/Body';
import InfoBox from '@weco/common/views/components/InfoBox/InfoBox';
import BookPromo from '@weco/common/views/components/BookPromo/BookPromo';
import { font, grid } from '@weco/common/utils/classnames';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import type { UiExhibition } from '@weco/common/model/exhibitions';
import VerticalSpace from '@weco/common/views/components/styled/VerticalSpace';

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
        icon: 'calendar',
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
    icon: 'ticket',
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
    icon: 'clock',
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
      icon: 'location',
    }
  );
}

function getResourcesItems(exhibition) {
  return exhibition.resources.map(resource => {
    return {
      id: null,
      title: null,
      description: resource.description,
      icon: resource.icon,
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
      icon: 'a11y',
    },
    {
      id: null,
      title: null,
      description: [
        {
          type: 'paragraph',
          text:
            'Large-print guides, transcripts and magnifiers are available in the gallery',
          spans: [],
        },
      ],
      icon: 'a11yVisual',
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

type Props = {|
  exhibition: UiExhibition,
|};

const Exhibition = ({ exhibition }: Props) => {
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
    contributors: exhibition.contributors,
    contributorsTitle: exhibition.contributorsTitle,
    promo: exhibition.promo,
    body: exhibition.body,
    standfirst: exhibition.standfirst,
    promoImage: exhibition.promoImage,
    promoText: exhibition.promoText,
    image: exhibition.image,
    squareImage: exhibition.squareImage,
    widescreenImage: exhibition.widescreenImage,
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
            <VerticalSpace size="xs">{DateInfo}</VerticalSpace>
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
      imageAltText={exhibition.image && exhibition.image.alt}
    >
      <ContentPage
        id={exhibition.id}
        Header={Header}
        Body={<Body body={exhibition.body} pageId={exhibition.id} />}
      >
        {exhibition.contributors.length > 0 && (
          <Contributors
            titleOverride={exhibition.contributorsTitle}
            contributors={exhibition.contributors}
          />
        )}
        {exhibitionOfs.length > 0 && (
          <SearchResults items={exhibitionOfs} title={`In this exhibition`} />
        )}
        {exhibition.end && !isPast(exhibition.end) && (
          <InfoBox title="Visit us" items={getInfoItems(exhibition)}>
            <p className={`no-margin ${font({ s: 'HNL4' })}`}>
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

        {/* TODO: hack - rendering deprecated book content on exhibitions, until we decide how to handle them properly  */}
        {exhibition.relatedBooks && exhibition.relatedBooks.length > 0 && (
          <Fragment>
            <h2 className="h2">From the bookshop</h2>
            <VerticalSpace
              size="l"
              properties={['margin-top']}
              className={`grid`}
            >
              {exhibition.relatedBooks.map(item => (
                <div
                  key={item.title}
                  className={grid({ s: 12, m: 6, l: 6, xl: 6 })}
                >
                  <BookPromo
                    url={item.url}
                    title={item.title}
                    subtitle={null}
                    image={item.image}
                    description={item.description}
                  />
                </div>
              ))}
            </VerticalSpace>
          </Fragment>
        )}
      </ContentPage>
    </PageLayout>
  );
};
export default Exhibition;
