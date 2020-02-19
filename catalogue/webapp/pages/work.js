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
  sierraIdFromPresentationManifestUrl,
  type DigitalLocation,
  getDownloadOptionsFromImageUrl,
} from '@weco/common/utils/works';
import {
  getFirstChildManifestLocation,
  getCanvases,
  getAudio,
  getVideo,
  getDownloadOptionsFromManifest,
  getIIIFPresentationCredit,
} from '@weco/common/utils/iiif';
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
import Space from '@weco/common/views/components/styled/Space';
import useSavedSearchState from '@weco/common/hooks/useSavedSearchState';

import ManifestContext from '@weco/common/views/components/ManifestContext/ManifestContext';
import IIIFPresentationPreview from '@weco/common/views/components/IIIFPresentationPreview/IIIFPresentationPreview';
import IIIFImagePreview from '@weco/common/views/components/IIIFImagePreview/IIIFImagePreview';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import VideoPlayer from '@weco/common/views/components/VideoPlayer/VideoPlayer';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import WobblyRow from '@weco/common/views/components/WobblyRow/WobblyRow';
import Download from '@weco/catalogue/components/Download/Download';
import { downloadUrl } from '@weco/common/services/catalogue/urls';
import NextLink from 'next/link';
import WorkDetailsText from '@weco/catalogue/components/WorkDetailsText/WorkDetailsText';
import ExplanatoryText from '@weco/common/views/components/ExplanatoryText/ExplanatoryText';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
type Props = {|
  work: Work | CatalogueApiError,
|};

const getFirstChildManifest = async function(manifests) {
  const firstManifestUrl = manifests.find(manifest => manifest['@id'])['@id'];
  const data = await (await fetch(firstManifestUrl)).json();
  return data;
};

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

  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );
  const [iiifPresentationManifest, setIIIFPresentationManifest] = useState(
    null
  );
  const [imageTotal, setImageTotal] = useState(0);
  const [childManifestsCount, setChildManifestsCount] = useState(0);
  const [firstChildManifest, setFirstChildManifest] = useState(null);
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
        setFirstChildManifest(
          await getFirstChildManifest(manifestData.manifests)
        );
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

  const iiifImageLocation: ?DigitalLocation = getDigitalLocationOfType(
    work,
    'iiif-image'
  );

  const imageUrl =
    iiifImageLocation && iiifImageLocation.url
      ? iiifImageTemplate(iiifImageLocation.url)({ size: `800,` })
      : null;

  const itemUrlObject =
    work && work.type !== 'Error'
      ? itemLink({
          workId: work.id,
          sierraId:
            (firstChildManifestLocation &&
              sierraIdFromPresentationManifestUrl(
                firstChildManifestLocation
              )) ||
            (iiifPresentationLocation &&
              sierraIdFromPresentationManifestUrl(
                iiifPresentationLocation.url
              )) ||
            null,
          langCode: work.language && work.language.id,
          canvas: 1,
          page: 1,
        })
      : null;

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

  const video = iiifPresentationManifest && getVideo(iiifPresentationManifest);
  const audio = iiifPresentationManifest && getAudio(iiifPresentationManifest);
  const iiifImageLocationUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImageDownloadOptions = iiifImageLocationUrl
    ? getDownloadOptionsFromImageUrl(iiifImageLocationUrl)
    : [];
  const iiifPresentationDownloadOptions = iiifPresentationManifest
    ? getDownloadOptionsFromManifest(iiifPresentationManifest)
    : [];

  const downloadOptions = [
    ...iiifImageDownloadOptions,
    ...iiifPresentationDownloadOptions,
  ];

  const sierraIdFromManifestUrl =
    iiifPresentationLocation &&
    sierraIdFromPresentationManifestUrl(iiifPresentationLocation.url);

  const digitalLocation: ?DigitalLocation =
    iiifPresentationLocation || iiifImageLocation;

  const license =
    digitalLocation && getAugmentedLicenseInfo(digitalLocation.license);

  const credit =
    (digitalLocation && digitalLocation.credit) ||
    (iiifPresentationManifest &&
      getIIIFPresentationCredit(iiifPresentationManifest));

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
            <WorkHeader work={work} childManifestsCount={childManifestsCount} />
          </div>
        </div>
      </Space>
      <>
        {!imageUrl && (
          <ManifestContext.Provider
            value={firstChildManifest || iiifPresentationManifest}
          >
            <SpacingComponent>
              <IIIFPresentationPreview
                childManifestsCount={childManifestsCount}
                itemUrl={itemUrlObject}
              />
            </SpacingComponent>
          </ManifestContext.Provider>
        )}
        {imageUrl && itemUrlObject && (
          <WobblyRow>
            <IIIFImagePreview iiifUrl={imageUrl} itemUrl={itemUrlObject} />
          </WobblyRow>
        )}
        {video && (
          <WobblyRow>
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <div style={{ textAlign: 'center' }}>
                <VideoPlayer video={video} />
              </div>
            </Space>
          </WobblyRow>
        )}
        {audio && (
          <WobblyRow>
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <div style={{ textAlign: 'center' }}>
                <AudioPlayer audio={audio} />
              </div>
            </Space>
          </WobblyRow>
        )}
        <Layout12>
          <Space
            v={{
              size: 'm',
              properties: ['padding-top'],
            }}
            className={classNames({
              [grid({ s: 12 })]: true,
            })}
          >
            <div className="flex">
              <Space
                h={{
                  size: 'm',
                  properties: ['margin-right'],
                }}
              >
                <Download
                  ariaControlsId="itemDownloads"
                  workId={work.id}
                  downloadOptions={downloadOptions}
                />

                {!(downloadOptions.length > 0) &&
                  sierraIdFromManifestUrl &&
                  childManifestsCount === 0 && (
                    <NextLink
                      {...downloadUrl({
                        workId: work.id,
                        sierraId: sierraIdFromManifestUrl,
                      })}
                    >
                      <a>Download options</a>
                    </NextLink>
                  )}
              </Space>
              {license && (
                <WorkDetailsText title="License" text={[license.label]} />
              )}
            </div>
            {license && (
              <Space
                v={{
                  size: 'l',
                  properties: ['margin-top'],
                }}
              >
                <ExplanatoryText
                  id="licenseDetail"
                  controlText="Can I use this?"
                >
                  <>
                    {license.humanReadableText.length > 0 && (
                      <WorkDetailsText text={license.humanReadableText} />
                    )}

                    <WorkDetailsText
                      text={[
                        `Credit: ${work.title.replace(/\.$/g, '')}.${' '}
                ${
                  credit
                    ? `Credit: <a href="https://wellcomecollection.org/works/${work.id}">${credit}</a>. `
                    : ` `
                }
              ${
                license.url
                  ? `<a href="${license.url}">${license.label}</a>`
                  : license.label
              }`,
                      ]}
                    />
                  </>
                </ExplanatoryText>
              </Space>
            )}
          </Space>
        </Layout12>
      </>

      <WorkDetails
        work={work}
        itemUrl={itemUrlObject}
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
