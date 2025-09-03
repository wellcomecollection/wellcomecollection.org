import NextLink from 'next/link';
import { FunctionComponent, useEffect, useState } from 'react';

import {
  ExhibitionHighlightToursDocument,
  ExhibitionTextsDocument,
} from '@weco/common/prismicio-types';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { isPast } from '@weco/common/utils/dates';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import PageHeader from '@weco/common/views/components/PageHeader';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { fetchExhibitionRelatedContentClientSide } from '@weco/content/services/prismic/fetch/exhibitions';
import { EventBasic } from '@weco/content/types/events';
import {
  ExhibitionAbout,
  Exhibition as ExhibitionType,
} from '@weco/content/types/exhibitions';
import { Link } from '@weco/content/types/link';
import { Page as PageType } from '@weco/content/types/pages';
import {
  getFeaturedMedia,
  getHeroPicture,
} from '@weco/content/utils/page-header';
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
  pages: PageType[];
  accessResourceLinks: (Link & { type: string })[];
  exhibitionTexts: ExhibitionTextsDocument[];
  exhibitionHighlightTours: ExhibitionHighlightToursDocument[];
  serverData: SimplifiedServerData;
};

export type ExhibitionOf = (ExhibitionType | EventBasic)[];

const Exhibition: FunctionComponent<Props> = ({
  exhibition,
  pages,
  accessResourceLinks,
  exhibitionTexts,
  exhibitionHighlightTours,
  serverData,
}) => {
  const [exhibitionOfs, setExhibitionOfs] = useState<ExhibitionOf>([]);
  const [exhibitionAbouts, setExhibitionAbouts] = useState<ExhibitionAbout[]>(
    []
  );
  const [isModalActive, setIsModalActive] = useState(false);

  const visualStoryLink = accessResourceLinks.find(
    link => link.type === 'visual-story'
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

  const DateInfo = exhibition.end ? (
    <DateRange start={exhibition.start} end={exhibition.end} />
  ) : (
    <HTMLDate date={exhibition.start} />
  );

  // This is for content that we don't have the crops for in Prismic.
  const maybeHeroPicture = getHeroPicture(exhibition);
  const maybeFeaturedMedia = !maybeHeroPicture
    ? getFeaturedMedia(exhibition)
    : undefined;

  const exhibitionFormat =
    !exhibition.format || exhibition.format?.title === 'Permanent exhibition'
      ? 'Exhibition'
      : exhibition.format.title;

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
                $v={{ size: 'xs', properties: ['margin-bottom'] }}
                style={{ display: 'flex', flexWrap: 'wrap' }}
              >
                <Space $h={{ size: 'm', properties: ['margin-right'] }}>
                  {DateInfo}
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
        HeroPicture={maybeHeroPicture}
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
      contentApiType="exhibitions"
      serverData={serverData}
      Header={Header}
      Body={
        <Body
          untransformedBody={exhibition.untransformedBody}
          pageId={exhibition.id}
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
          exhibitionOfs={exhibitionOfs}
          exhibitionAbouts={exhibitionAbouts}
          pages={pages}
        />
      ) : (
        <>
          {exhibition.end && !isPast(exhibition.end) && (
            <InfoBox title="Visit us" items={getInfoItems(exhibition)} />
          )}

          {(exhibitionOfs.length > 0 || pages.length > 0) && (
            <Space
              $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
            >
              <SearchResults
                variant="default"
                id="events-list"
                items={[...exhibitionOfs, ...pages]}
                title={`${exhibitionFormat} events`}
              />
            </Space>
          )}

          {exhibition.end && !isPast(exhibition.end) && (
            <>
              <Grid>
                <GridCell $sizeMap={{ s: [12] }}>
                  <Space
                    as="h2"
                    className={font('wb', 3)}
                    $v={{
                      size: 'l',
                      properties: ['margin-top', 'margin-bottom'],
                    }}
                  >
                    Access resources
                  </Space>
                </GridCell>
              </Grid>

              {visualStoryLink && (
                <>
                  <h3 className={font('intb', 4)}>Plan your visit</h3>
                  <NextLink href={visualStoryLink.url}>
                    Exhibition visual story
                  </NextLink>{' '}
                  <Space as="p" $v={{ size: 'm', properties: ['margin-top'] }}>
                    This visual story provides images and information to help
                    you plan and prepare for your visit to the exhibition.
                  </Space>
                </>
              )}

              <h3 className={font('intb', 4)}>{`When you're here`}</h3>
              <p>
                Resources designed to support your visit are available online
                and in the gallery.
              </p>

              <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                <ExhibitionAccessAccordion
                  exhibitionTexts={exhibitionTexts}
                  exhibitionHighlightTours={exhibitionHighlightTours}
                  visualStoryLink={visualStoryLink}
                />
              </Space>

              <Space
                as="h3"
                className={font('intb', 4)}
                $v={{ size: 'l', properties: ['margin-bottom'] }}
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

          {exhibitionAbouts.length > 0 && (
            <Space
              $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
            >
              <SearchResults
                variant="default"
                items={exhibitionAbouts}
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
