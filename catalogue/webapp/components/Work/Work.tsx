import { Work as WorkType } from '@weco/common/model/catalogue';
import { useContext, useEffect, FunctionComponent, ReactElement } from 'react';
import { grid, classNames, font } from '@weco/common/utils/classnames';
import {
  getDigitalLocationOfType,
  sierraIdFromPresentationManifestUrl,
} from '@weco/common/utils/works';
import { itemLink } from '@weco/common/services/catalogue/routes';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import { workLd } from '@weco/common/utils/json-ld';
import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';
import WorkHeader from '@weco/common/views/components/WorkHeader/WorkHeader';
import ArchiveBreadcrumb from '@weco/common/views/components/ArchiveBreadcrumb/ArchiveBreadcrumb';
import Space from '@weco/common/views/components/styled/Space';
import WorkDetails from '../WorkDetails/WorkDetails';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import WorkDetailsSection from '../WorkDetailsSection/WorkDetailsSection';
import Icon from '@weco/common/views/components/Icon/Icon';
import ArchiveTree from '@weco/common/views/components/ArchiveTree/ArchiveTree';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import Divider from '@weco/common/views/components/Divider/Divider';
import styled from 'styled-components';
import { WithGlobalContextData } from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
import useHotjar from '@weco/common/hooks/useHotjar';
import useIIIFManifestData from '@weco/common/hooks/useIIIFManifestData';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';

const ArchiveDetailsContainer = styled.div`
  display: block;
  ${props => props.theme.media.medium`
    display: flex;
  `}
`;

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

type Props = {
  work: WorkType;
} & WithGlobalContextData;

const Work: FunctionComponent<Props> = ({
  work,
  globalContextData,
}: Props): ReactElement<Props> => {
  const { link: searchLink } = useContext(SearchContext);

  const isInArchive = work.parts.length > 0 || work.partOf.length > 0;
  useHotjar(isInArchive);

  const {
    childManifestsCount,
    firstChildManifestLocation,
  } = useIIIFManifestData(work);
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );

  const workData = {
    workType: (work.workType ? work.workType.label : '').toLocaleLowerCase(),
  };

  useEffect(() => {
    window.dataLayer &&
      window.dataLayer.push({
        event: 'pageview',
        work: JSON.stringify(workData),
      });
  }, []);

  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');

  const imageUrl =
    iiifImageLocation && iiifImageLocation.url
      ? iiifImageTemplate(iiifImageLocation.url)({ size: `800,` })
      : null;

  const itemUrlObject = itemLink({
    workId: work.id,
    sierraId:
      (firstChildManifestLocation &&
        sierraIdFromPresentationManifestUrl(firstChildManifestLocation)) ||
      (iiifPresentationLocation &&
        sierraIdFromPresentationManifestUrl(iiifPresentationLocation.url)) ||
      null,
    // We only send a langCode if it's unambiguous -- better to send no language
    // than the wrong one.
    langCode: work?.languages?.length === 1 && work?.languages[0]?.id,
    canvas: 1,
    page: 1,
  });

  return (
    <CataloguePageLayout
      title={work.title}
      description={work.description || work.title}
      url={{ pathname: `/works/${work.id}`, query: {} }}
      openGraphType={'website'}
      jsonLd={workLd(work)}
      siteSection={'collections'}
      oEmbedUrl={`https://wellcomecollection.org/oembed/works/${work.id}`}
      imageUrl={imageUrl}
      imageAltText={work.title}
      hideNewsletterPromo={true}
      globalContextData={globalContextData}
    >
      <div className="container">
        <div className="grid">
          <div
            className={classNames({
              [grid({ s: 12, m: 12, l: 12, xl: 12 })]: true,
            })}
          >
            <Space v={{ size: 'l', properties: ['margin-top'] }}>
              <SearchTabs
                query={searchLink.as.query?.query?.toString() || ''}
                sort={searchLink.as.query?.sort?.toString()}
                sortOrder={searchLink.as.query?.sortOrder?.toString()}
                worksFilters={[]}
                imagesFilters={[]}
                shouldShowDescription={false}
                shouldShowFilters={false}
                showSortBy={false}
              />
            </Space>
          </div>
        </div>
        <div className="grid">
          <Space
            v={{
              size: 's',
              properties: ['padding-top', 'padding-bottom'],
            }}
            className={classNames({
              [grid({ s: 12 })]: true,
            })}
          >
            <BackToResults />
          </Space>
        </div>
      </div>

      {isInArchive ? (
        <>
          <div className="container">
            <div className="grid">
              <Space
                v={{
                  size: 's',
                  properties: ['padding-top', 'padding-bottom'],
                }}
                className={classNames({
                  [grid({ s: 12 })]: true,
                })}
              >
                <ArchiveBreadcrumb work={work} />
              </Space>
            </div>
          </div>

          <div className="container">
            <div className="grid">
              <WorkHeader
                work={work}
                childManifestsCount={childManifestsCount}
              />
            </div>
          </div>

          <div className="container">
            <Divider extraClasses="divider--pumice divider--keyline" />
            <ArchiveDetailsContainer>
              <ArchiveTree work={work} />
              <Space v={{ size: 'l', properties: ['padding-top'] }}>
                <WorkDetails work={work} itemUrl={itemUrlObject} />
              </Space>
            </ArchiveDetailsContainer>
          </div>
        </>
      ) : (
        <>
          <div className="container">
            <div className="grid">
              <WorkHeader
                work={work}
                childManifestsCount={childManifestsCount}
              />
            </div>
          </div>
          <WorkDetails work={work} itemUrl={itemUrlObject} />
        </>
      )}

      <Layout12>
        <WorkDetailsSection>
          <div className="flex flex--v-center">
            <Icon name="underConstruction" extraClasses="margin-right-s2" />
            <p className={`${font('hnl', 5)} no-margin`}>
              We’re improving the information on this page.{' '}
              <a href="/works/progress">Find out more</a>.
            </p>
          </div>
        </WorkDetailsSection>
      </Layout12>
    </CataloguePageLayout>
  );
};

export default Work;
