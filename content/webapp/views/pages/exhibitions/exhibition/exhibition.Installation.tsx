import { FunctionComponent, useEffect, useState } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { isPast } from '@weco/common/utils/dates';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import HeaderBackground from '@weco/common/views/components/HeaderBackground';
import { gridSize8 } from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import { fetchExhibitExhibition } from '@weco/content/services/prismic/fetch/exhibitions';
import { EventBasic } from '@weco/content/types/events';
import {
  AboutThisExhibitionContent,
  Exhibition as InstallationType,
} from '@weco/content/types/exhibitions';
import { Page as PageType } from '@weco/content/types/pages';
import { getFeaturedMedia } from '@weco/content/utils/page-header';
import Body from '@weco/content/views/components/Body';
import BslLeafletVideo from '@weco/content/views/components/BslLeafletVideo';
import ContentPage from '@weco/content/views/components/ContentPage';
import InfoBox from '@weco/content/views/components/InfoBox';
import SearchResults from '@weco/content/views/components/SearchResults';
import StatusIndicator from '@weco/content/views/components/StatusIndicator';

import DateAndStatusIndicator from './exhibition.DateAndStatusIndicator';
import { getInfoItems } from './exhibition.helpers';

type Props = {
  installation: InstallationType;
  relatedContent: (InstallationType | EventBasic | PageType)[];
  aboutThisExhibitionContent: AboutThisExhibitionContent[];
};

const Installation: FunctionComponent<Props> = ({
  installation,
  relatedContent,
  aboutThisExhibitionContent,
}) => {
  const [partOf, setPartOf] = useState<InstallationType>();
  const [isModalActive, setIsModalActive] = useState(false);

  useEffect(() => {
    fetchExhibitExhibition(installation.id).then(exhibition => {
      if (isNotUndefined(exhibition)) {
        setPartOf(exhibition);
      }
    });
  }, [installation.id]);

  const FeaturedMedia = getFeaturedMedia(installation);

  const extraBreadcrumbs = [
    {
      url: '/exhibitions',
      text: 'Exhibitions',
    },
    partOf
      ? {
          url: linkResolver(partOf),
          text: partOf.shortTitle || partOf.title,
          prefix: 'Part of',
        }
      : undefined,
    {
      url: linkResolver(installation),
      text: installation.title,
      isHidden: true,
    },
  ].filter(isNotUndefined);

  const Header = (
    <>
      <PageHeader
        variant="basic"
        breadcrumbs={getBreadcrumbItems('whats-on', extraBreadcrumbs)}
        labels={{ labels: installation.labels }}
        title={installation.title}
        FeaturedMedia={FeaturedMedia}
        Background={<HeaderBackground hasWobblyEdge={true} />}
        ContentTypeInfo={
          <>
            {installation.start && !installation.statusOverride && (
              <DateAndStatusIndicator
                start={installation.start}
                end={installation.end}
              />
            )}
            {installation.statusOverride && (
              <StatusIndicator
                start={installation.start}
                end={installation.end || new Date()}
                statusOverride={installation.statusOverride}
              />
            )}
          </>
        }
        isContentTypeInfoBeforeMedia={true}
      />

      {installation.bslLeafletVideo && (
        <BslLeafletVideo
          video={installation.bslLeafletVideo}
          isModalActive={isModalActive}
          setIsModalActive={setIsModalActive}
        />
      )}
    </>
  );

  const hasRelatedContent =
    relatedContent.length > 0 || aboutThisExhibitionContent.length > 0;

  return (
    <ContentPage
      id={installation.id}
      uid={installation.uid}
      Header={Header}
      Body={
        <Body
          untransformedBody={installation.untransformedBody}
          pageId={installation.id}
          pageUid={installation.uid}
          gridSizes={gridSize8()}
        />
      }
      seasons={installation.seasons}
      contributors={installation.contributors}
    >
      {installation.end && !isPast(installation.end) && (
        <InfoBox title="Visit us" items={getInfoItems(installation)}>
          <p className={font('sans', -1)} style={{ margin: 0 }}>
            For more information, please visit our{' '}
            <a href={`/visit-us/${prismicPageIds.access}`}>Accessibility</a>{' '}
            page. If you have any queries about accessibility, please email us
            at{' '}
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
          </p>
        </InfoBox>
      )}

      {hasRelatedContent && (
        <Space $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}>
          {relatedContent.length > 0 && (
            <SearchResults
              variant="default"
              id="events-list"
              items={relatedContent}
              title="Installation events"
            />
          )}

          {aboutThisExhibitionContent.length > 0 && (
            <Space
              $v={{
                size: 'xl',
                properties: relatedContent.length > 0 ? ['margin-top'] : [],
              }}
            >
              <SearchResults
                variant="default"
                items={aboutThisExhibitionContent}
                title="Related stories"
              />
            </Space>
          )}
        </Space>
      )}
    </ContentPage>
  );
};

export default Installation;
