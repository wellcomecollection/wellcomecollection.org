import NextLink from 'next/link';
import { FunctionComponent, useState } from 'react';

import { getCrop } from '@weco/common/model/image';
import {
  ExhibitionHighlightToursDocument,
  ExhibitionTextsDocument,
} from '@weco/common/prismicio-types';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { isPast } from '@weco/common/utils/dates';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';
import { gridSize8 } from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { EventBasic } from '@weco/content/types/events';
import {
  AboutThisExhibitionContent,
  Exhibition as ExhibitionType,
} from '@weco/content/types/exhibitions';
import { Link } from '@weco/content/types/link';
import { Page as PageType } from '@weco/content/types/pages';
import { getFeaturedMedia, HeroPicture } from '@weco/content/utils/page-header';
import Body from '@weco/content/views/components/Body';
import BslLeafletVideo from '@weco/content/views/components/BslLeafletVideo';
import Contact from '@weco/content/views/components/Contact';
import ContentPage from '@weco/content/views/components/ContentPage';
import Contributors from '@weco/content/views/components/Contributors';
import DateRange from '@weco/content/views/components/DateRange';
import InfoBox from '@weco/content/views/components/InfoBox';
import SearchResults from '@weco/content/views/components/SearchResults';
import StatusIndicator from '@weco/content/views/components/StatusIndicator';

import ExhibitionAccessAccordion from './exhibition.AccessAccordion';
import ExhibitionBeingHuman from './exhibition.BeingHuman';
import { getInfoItems } from './exhibition.helpers';

type Props = {
  exhibition: ExhibitionType;
  relatedContent: (ExhibitionType | EventBasic | PageType)[];
  aboutThisExhibitionContent: AboutThisExhibitionContent[];
  accessResourceLinks: (Link & { type: string })[];
  exhibitionTexts: ExhibitionTextsDocument[];
  exhibitionHighlightTours: ExhibitionHighlightToursDocument[];
  shouldHideRelatedStories: boolean;
};

export type ExhibitionOf = (ExhibitionType | EventBasic)[];

const DateInfo = ({
  endDate,
  startDate,
}: {
  endDate?: Date;
  startDate: Date;
}) => {
  return endDate ? (
    <DateRange start={startDate} end={endDate} />
  ) : (
    <HTMLDateAndTime variant="date" date={startDate} />
  );
};

const Exhibition: FunctionComponent<Props> = ({
  exhibition,
  relatedContent,
  aboutThisExhibitionContent,
  accessResourceLinks,
  exhibitionTexts,
  exhibitionHighlightTours,
  shouldHideRelatedStories,
}) => {
  const [isModalActive, setIsModalActive] = useState(false);

  const visualStoryLink = accessResourceLinks.find(
    link => link.type === 'visual-story'
  );

  const extraBreadcrumbs = [
    {
      url: '/exhibitions',
      text: 'Exhibitions',
    },
    {
      url: linkResolver(exhibition),
      text: exhibition.title,
      isHidden: true,
    },
  ];

  // This is for content that we don't have the crops for in Prismic.
  const squareImage = getCrop(exhibition.image, 'square');
  const widescreenImage = getCrop(exhibition.image, '16:9');
  const hasHeroPicture = squareImage && widescreenImage;
  const maybeFeaturedMedia = !hasHeroPicture
    ? getFeaturedMedia(exhibition)
    : undefined;

  const exhibitionFormat =
    !exhibition.format || exhibition.format?.title === 'Permanent exhibition'
      ? 'Exhibition'
      : exhibition.format.title;

  const isCurrentExhibition = Boolean(
    exhibition.end && !isPast(exhibition.end)
  );

  const Header = (
    <>
      <PageHeader
        variant="basic"
        breadcrumbs={getBreadcrumbItems('whats-on', extraBreadcrumbs)}
        labels={{ labels: exhibition.labels }}
        title={exhibition.title}
        fullWidth={true}
        ContentTypeInfo={
          <>
            {!exhibition.isPermanent && (
              <Space
                $v={{ size: '2xs', properties: ['margin-bottom'] }}
                style={{ display: 'flex', flexWrap: 'wrap' }}
              >
                <Space $h={{ size: 'sm', properties: ['margin-right'] }}>
                  <DateInfo
                    startDate={exhibition.start}
                    endDate={exhibition.end}
                  />
                </Space>
                <StatusIndicator
                  start={exhibition.start}
                  end={exhibition.end || new Date()}
                  statusOverride={exhibition.statusOverride}
                  isLarge={true}
                />
              </Space>
            )}
          </>
        }
        FeaturedMedia={maybeFeaturedMedia}
        HeroPicture={
          hasHeroPicture ? <HeroPicture fields={exhibition} /> : undefined
        }
        isFree={true}
        isContentTypeInfoBeforeMedia={true}
        includeAccessibilityProvision={true}
      />

      {exhibition.bslLeafletVideo && (
        <BslLeafletVideo
          video={exhibition.bslLeafletVideo}
          isModalActive={isModalActive}
          setIsModalActive={setIsModalActive}
        />
      )}
    </>
  );

  return (
    <ContentPage
      id={exhibition.id}
      uid={exhibition.uid}
      contentApiType="exhibitions"
      Header={Header}
      Body={
        <Body
          untransformedBody={exhibition.untransformedBody}
          pageId={exhibition.id}
          pageUid={exhibition.uid}
          gridSizes={gridSize8()}
        />
      }
      seasons={exhibition.seasons}
      hideContributors={true} // We hide contributors as we show them further up the page
    >
      {exhibition.uid === 'being-human' ? (
        <ExhibitionBeingHuman
          exhibition={exhibition}
          accessResourceLinks={accessResourceLinks}
          exhibitionFormat={exhibitionFormat}
          relatedContent={relatedContent}
          aboutThisExhibitionContent={aboutThisExhibitionContent}
        />
      ) : (
        <>
          {isCurrentExhibition && (
            <InfoBox title="Visit us" items={getInfoItems(exhibition)} />
          )}

          {relatedContent.length > 0 && (
            <Space
              $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
            >
              <SearchResults
                variant="default"
                id="events-list"
                items={relatedContent}
                title={`${exhibitionFormat} events`}
              />
            </Space>
          )}

          {isCurrentExhibition && (
            <>
              <Grid>
                <GridCell $sizeMap={{ s: [12] }}>
                  <Space
                    as="h2"
                    className={font('brand-bold', 1)}
                    $v={{
                      size: 'md',
                      properties: ['margin-top', 'margin-bottom'],
                    }}
                  >
                    Access resources
                  </Space>
                </GridCell>
              </Grid>

              {visualStoryLink && (
                <>
                  <h3 className={font('sans-bold', 0)}>Plan your visit</h3>
                  <NextLink href={visualStoryLink.url}>
                    Exhibition visual story
                  </NextLink>{' '}
                  <Space as="p" $v={{ size: 'sm', properties: ['margin-top'] }}>
                    This visual story provides images and information to help
                    you plan and prepare for your visit to the exhibition.
                  </Space>
                </>
              )}

              <h3 className={font('sans-bold', 0)}>{`When you're here`}</h3>
              <p>
                Resources designed to support your visit are available online
                and in the gallery.
              </p>

              <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
                <ExhibitionAccessAccordion
                  exhibitionTexts={exhibitionTexts}
                  exhibitionHighlightTours={exhibitionHighlightTours}
                  visualStoryLink={visualStoryLink}
                />
              </Space>

              <Space
                as="h3"
                className={font('sans-bold', 0)}
                $v={{ size: 'md', properties: ['margin-bottom'] }}
              >
                Access information, tours and queries
              </Space>
              <Contact
                link={{
                  text: 'Visit our accessibility page ',
                  url: '/visit-us/accessibility',
                }}
                phone="020 7611 2222"
                email="access@wellcomecollection.org"
              />
            </>
          )}

          {!shouldHideRelatedStories &&
            aboutThisExhibitionContent.length > 0 && (
              <Space
                $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
              >
                <SearchResults
                  variant="default"
                  items={aboutThisExhibitionContent}
                  title="Related stories"
                />
              </Space>
            )}

          {exhibition.contributors.length > 0 && (
            <Contributors contributors={exhibition.contributors} />
          )}
        </>
      )}
    </ContentPage>
  );
};

export default Exhibition;
