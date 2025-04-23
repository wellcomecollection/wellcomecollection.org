import { FunctionComponent, useEffect, useState } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { isPast } from '@weco/common/utils/dates';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb/Breadcrumb';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Body from '@weco/content/components/Body/Body';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import DateAndStatusIndicator from '@weco/content/components/DateAndStatusIndicator/DateAndStatusIndicator';
import {
  AccessibilityServices,
  getInfoItems,
} from '@weco/content/components/Exhibition/Exhibition';
import InfoBox from '@weco/content/components/InfoBox/InfoBox';
import StatusIndicator from '@weco/content/components/StatusIndicator/StatusIndicator';
import { fetchExhibitExhibition } from '@weco/content/services/prismic/fetch/exhibitions';
import { Exhibition as InstallationType } from '@weco/content/types/exhibitions';
import { getFeaturedMedia } from '@weco/content/utils/page-header';

type Props = {
  installation: InstallationType;
};

const Installation: FunctionComponent<Props> = ({ installation }) => {
  const [partOf, setPartOf] = useState<InstallationType>();
  useEffect(() => {
    fetchExhibitExhibition(installation.id).then(exhibition => {
      if (isNotUndefined(exhibition)) {
        setPartOf(exhibition);
      }
    });
  }, []);

  const FeaturedMedia = getFeaturedMedia(installation);

  const extraBreadcrumbs = [
    {
      text: 'Installations',
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
    <PageHeader
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
  );
  return (
    <ContentPage
      id={installation.id}
      Header={Header}
      Body={
        <Body
          untransformedBody={installation.untransformedBody}
          pageId={installation.id}
        />
      }
      seasons={installation.seasons}
      contributors={installation.contributors}
    >
      {installation.end && !isPast(installation.end) && (
        <InfoBox title="Visit us" items={getInfoItems(installation)}>
          <AccessibilityServices>
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
          </AccessibilityServices>
        </InfoBox>
      )}
    </ContentPage>
  );
};

export default Installation;
