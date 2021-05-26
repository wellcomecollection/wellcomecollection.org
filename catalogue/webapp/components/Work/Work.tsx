import { Work as WorkType } from '@weco/common/model/catalogue';
import { useContext, useEffect, FunctionComponent, ReactElement } from 'react';
import { grid, classNames } from '@weco/common/utils/classnames';
import { getDigitalLocationOfType } from '@weco/common/utils/works';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import { workLd } from '@weco/common/utils/json-ld';
import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';
import WorkHeader from '@weco/common/views/components/WorkHeader/WorkHeader';
import ArchiveBreadcrumb from '@weco/common/views/components/ArchiveBreadcrumb/ArchiveBreadcrumb';
import Space from '@weco/common/views/components/styled/Space';
import WorkDetails from '../WorkDetails/WorkDetails';
import ArchiveTree from '@weco/common/views/components/ArchiveTree/ArchiveTree';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import Divider from '@weco/common/views/components/Divider/Divider';
import styled from 'styled-components';
import { WithGlobalContextData } from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';
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

  return (
    <CataloguePageLayout
      title={work.title}
      description={work.description || work.title}
      url={{ pathname: `/works/${work.id}`, query: {} }}
      openGraphType={'website'}
      jsonLd={workLd(work)}
      siteSection={'collections'}
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
              <WorkHeader work={work} />
            </div>
          </div>

          <div className="container">
            <Divider extraClasses="divider--pumice divider--keyline" />
            <ArchiveDetailsContainer>
              <ArchiveTree work={work} />
              <Space v={{ size: 'l', properties: ['padding-top'] }}>
                <WorkDetails work={work} />
              </Space>
            </ArchiveDetailsContainer>
          </div>
        </>
      ) : (
        <>
          <div className="container">
            <div className="grid">
              <WorkHeader work={work} />
            </div>
          </div>
          <WorkDetails work={work} />
        </>
      )}
    </CataloguePageLayout>
  );
};

export default Work;
