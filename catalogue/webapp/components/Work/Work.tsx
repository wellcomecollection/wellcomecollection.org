import { Work as WorkType } from '@weco/common/model/catalogue';
import {
  useEffect,
  useState,
  useContext,
  FunctionComponent,
  ReactElement,
} from 'react';
import fetch from 'isomorphic-unfetch';
import { grid, classNames, font } from '@weco/common/utils/classnames';
import {
  getDigitalLocationOfType,
  sierraIdFromPresentationManifestUrl,
} from '@weco/common/utils/works';
import {
  getFirstChildManifestLocation,
  getCanvases,
} from '@weco/common/utils/iiif';
import { itemLink } from '@weco/common/services/catalogue/routes';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import { workLd } from '@weco/common/utils/json-ld';
import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';
import WorkHeader from '@weco/common/views/components/WorkHeader/WorkHeader';
import WorkHeaderPrototype from '@weco/common/views/components/WorkHeaderPrototype/WorkHeaderPrototype';
import ArchiveBreadcrumb from '@weco/common/views/components/ArchiveBreadcrumb/ArchiveBreadcrumb';
import Space from '@weco/common/views/components/styled/Space';
import useSavedSearchState from '@weco/common/hooks/useSavedSearchState';
import SearchForm from '@weco/common/views/components/SearchForm/SearchForm';
import WorkDetails from '../WorkDetails/WorkDetails';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import WorkDetailsSection from '../WorkDetailsSection/WorkDetailsSection';
import Icon from '@weco/common/views/components/Icon/Icon';
import ArchiveTree from '@weco/common/views/components/ArchiveTree/ArchiveTree';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import Divider from '@weco/common/views/components/Divider/Divider';
import styled from 'styled-components';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { WithGlobalContextData } from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';

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
  const { searchPrototype } = useContext(TogglesContext);
  const [savedSearchFormState] = useSavedSearchState({
    query: '',
    page: 1,
    workType: [],
    itemsLocationsLocationType: [],
    sort: null,
    sortOrder: null,
    productionDatesFrom: null,
    productionDatesTo: null,
    search: null,
  });

  const isInArchive = work.parts.length > 0 || work.partOf.length > 0;

  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );
  const [iiifPresentationManifest, setIIIFPresentationManifest] = useState(
    null
  );
  const [imageTotal, setImageTotal] = useState(0);
  const [childManifestsCount, setChildManifestsCount] = useState(0);
  const fetchIIIFPresentationManifest = async () => {
    try {
      const iiifManifest =
        iiifPresentationLocation && (await fetch(iiifPresentationLocation.url));
      const manifestData = iiifManifest && (await iiifManifest.json());
      if (manifestData) {
        setImageTotal(getCanvases(manifestData).length);
      }
      if (manifestData && manifestData.manifests) {
        setChildManifestsCount(manifestData.manifests.length);
      }
      setIIIFPresentationManifest(manifestData);
    } catch (e) {}
  };
  const workData = {
    workType: (work.workType ? work.workType.label : '').toLocaleLowerCase(),
  };

  useEffect(() => {
    window.dataLayer &&
      window.dataLayer.push({
        event: 'pageview',
        work: JSON.stringify(workData),
      });
    fetchIIIFPresentationManifest();
  }, []);

  const firstChildManifestLocation =
    iiifPresentationManifest &&
    getFirstChildManifestLocation(iiifPresentationManifest);

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
    langCode: work.language && work.language.id,
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
            {searchPrototype ? (
              <>
                <SearchTabs
                  worksRouteProps={savedSearchFormState}
                  imagesRouteProps={{
                    ...savedSearchFormState,
                    locationsLicense: null,
                    color: null,
                  }}
                  workTypeAggregations={[]}
                  shouldShowDescription={false}
                  activeTabIndex={0}
                />
              </>
            ) : (
              <SearchForm
                ariaDescribedBy="search-form-description"
                shouldShowFilters={false}
                worksRouteProps={savedSearchFormState}
                workTypeAggregations={[]}
              />
            )}
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
              <WorkHeaderPrototype
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
                <WorkDetails
                  work={work}
                  itemUrl={itemUrlObject}
                  iiifPresentationManifest={iiifPresentationManifest}
                  childManifestsCount={childManifestsCount}
                  imageCount={imageTotal}
                />
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
          <WorkDetails
            work={work}
            itemUrl={itemUrlObject}
            iiifPresentationManifest={iiifPresentationManifest}
            childManifestsCount={childManifestsCount}
            imageCount={imageTotal}
          />
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
