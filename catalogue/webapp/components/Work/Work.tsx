import { Work as WorkType } from '@weco/common/model/catalogue';
import { useEffect, useState, useContext } from 'react';
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
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import RelatedArchiveWorks from '@weco/common/views/components/RelatedArchiveWorks/RelatedArchiveWorks';
import SearchForm from '../SearchForm/SearchForm';
import WorkDetails from '../WorkDetails/WorkDetails';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import WorkDetailsSection from '../WorkDetailsSection/WorkDetailsSection';
import Icon from '@weco/common/views/components/Icon/Icon';
import ArchiveTree from '@weco/common/views/components/ArchiveTree/ArchiveTree';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

type Props = {
  work: WorkType;
};

const Work = ({ work }: Props) => {
  const { archivesPrototype, archivesPrototypeSidePanel } = useContext(TogglesContext);
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
      url={{ pathname: `/works/${work.id}` }}
      openGraphType={'website'}
      jsonLd={workLd(work)}
      siteSection={'works'}
      oEmbedUrl={`https://wellcomecollection.org/oembed/works/${work.id}`}
      imageUrl={imageUrl}
      imageAltText={work.title}
      hideNewsletterPromo={true}
    >
      <div className="container">
        <div className="grid">
          <div
            className={classNames({
              [grid({ s: 12, m: 10, l: 8, xl: 8 })]: true,
            })}
          >
            <SearchForm
              ariaDescribedBy="search-form-description"
              shouldShowFilters={false}
              worksRouteProps={savedSearchFormState}
              workTypeAggregations={[]}
            />
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
        {(archivesPrototype || archivesPrototypeSidePanel) && (
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
        )}

{archivesPrototypeSidePanel && isInArchive ? (
        <>
          <div className="container">
            <div className="grid">
              <WorkHeaderPrototype work={work} childManifestsCount={childManifestsCount} />
            </div>
          </div>
          <div className="container">
            <div className="grid">
              <div
                className={classNames({
                  [grid({
                    s: 12,
                    m: 5,
                    l: 4,
                    xl: 3,
                  })]: true,
                })}
              >
                <ArchiveTree work={work} withModal={false} />
              </div>
              <div
                className={classNames({
                  [grid({
                    s: 12,
                    m: 7,
                    l: 8,
                    xl: 9,
                  })]: true,
                })}
              >
                <WorkDetails
                  work={work}
                  itemUrl={itemUrlObject}
                  iiifPresentationManifest={iiifPresentationManifest}
                  childManifestsCount={childManifestsCount}
                  imageCount={imageTotal}
                />
              </div>
            </div>
          </div>
        </>
        ) : (
      <>
        <div className="container">
          <div className="grid">
            <WorkHeader work={work} childManifestsCount={childManifestsCount} />
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

      {archivesPrototype && !archivesPrototypeSidePanel && <RelatedArchiveWorks work={work} />}
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
