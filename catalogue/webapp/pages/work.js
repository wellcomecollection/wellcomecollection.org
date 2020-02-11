// @flow
import Router from 'next/router';
import {
  type Work,
  type CatalogueApiError,
  type CatalogueApiRedirect,
} from '@weco/common/model/catalogue';
import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { grid, classNames } from '@weco/common/utils/classnames';
import {
  getDigitalLocationOfType,
  getFirstChildManifestLocation,
  type DigitalLocation,
  getAudio,
  getVideo,
  getCanvases,
} from '@weco/common/utils/works';
import { itemLink } from '@weco/common/services/catalogue/routes';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import { workLd } from '@weco/common/utils/json-ld';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';
import WorkHeader from '@weco/common/views/components/WorkHeader/WorkHeader';
import WorkDetails from '../components/WorkDetails/WorkDetails';
import SearchForm from '../components/SearchForm/SearchForm';
import { getWork } from '../services/catalogue/works';
import WobblyRow from '@weco/common/views/components/WobblyRow/WobblyRow';
import Space from '@weco/common/views/components/styled/Space';
import VideoPlayer from '@weco/common/views/components/VideoPlayer/VideoPlayer';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import useSavedSearchState from '@weco/common/hooks/useSavedSearchState';
type Props = {|
  work: Work | CatalogueApiError,
|};

export const WorkPage = ({ work }: Props) => {
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

  const [iiifPresentationManifest, setIIIFPresentationManifest] = useState(
    null
  );
  const [imageTotal, setImageTotal] = useState(0);
  const [childManifestsCount, setChildManifestsCount] = useState(0);
  const fetchIIIFPresentationManifest = async () => {
    try {
      const iiifPresentationLocation = getDigitalLocationOfType(
        work,
        'iiif-presentation'
      );
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

  const video = iiifPresentationManifest && getVideo(iiifPresentationManifest);
  const audio = iiifPresentationManifest && getAudio(iiifPresentationManifest);

  useEffect(() => {
    window.dataLayer &&
      window.dataLayer.push({
        event: 'pageview',
        work: JSON.stringify(workData),
      });
    fetchIIIFPresentationManifest();
  }, []);

  if (work.type === 'Error') {
    return (
      <ErrorPage
        title={
          work.httpStatus === 410
            ? 'This catalogue item has been removed.'
            : null
        }
        statusCode={work.httpStatus}
      />
    );
  }

  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );
  const firstChildManifestLocation =
    iiifPresentationManifest &&
    getFirstChildManifestLocation(iiifPresentationManifest);

  function sierraIdFromPresentationManifestUrl(
    iiifPresentationLocation: string
  ): string {
    return (iiifPresentationLocation.match(/iiif\/(.*)\/manifest/) || [])[1];
  }

  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');

  const digitalLocation: ?DigitalLocation =
    iiifImageLocation && iiifImageLocation.type === 'DigitalLocation'
      ? iiifImageLocation
      : null;

  // const iiifImageLocationUrl = digitalLocation && digitalLocation.url;

  const imageContentUrl =
    digitalLocation && digitalLocation.url
      ? iiifImageTemplate(digitalLocation.url)({ size: `800,` })
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
      imageUrl={imageContentUrl}
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
              workTypeAggregations={null}
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
      <Space
        v={{
          size: 'xl',
          properties: ['padding-top'],
        }}
        className={classNames({
          row: true,
        })}
      >
        <div className="container">
          <div className="grid">
            <WorkHeader
              work={work}
              childManifestsCount={childManifestsCount}
              itemUrl={itemUrlObject}
            />
          </div>
        </div>
      </Space>
      {/* // TODO where do these fit in relation to available online */}
      {video && (
        <WobblyRow>
          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <VideoPlayer video={video} />
          </Space>
        </WobblyRow>
      )}
      {audio && (
        <WobblyRow>
          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <AudioPlayer audio={audio} />
          </Space>
        </WobblyRow>
      )}
      <WorkDetails
        work={work}
        iiifPresentationManifest={iiifPresentationManifest}
        childManifestsCount={childManifestsCount}
        imageCount={imageTotal}
      />
    </CataloguePageLayout>
  );
};

WorkPage.getInitialProps = async (
  ctx
): Promise<Props | CatalogueApiRedirect> => {
  const { id } = ctx.query;

  const workOrError = await getWork({
    id,
  });

  if (workOrError && workOrError.type === 'Redirect') {
    const { res } = ctx;
    if (res) {
      res.writeHead(workOrError.status, {
        Location: workOrError.redirectToId,
      });
      res.end();
    } else {
      Router.push(workOrError.redirectToId);
    }
    return workOrError;
  } else {
    return {
      work: workOrError,
    };
  }
};

export default WorkPage;
