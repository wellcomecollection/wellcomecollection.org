// @flow
import Router from 'next/router';
import {
  type Work,
  type CatalogueApiError,
  type CatalogueApiRedirect,
} from '@weco/common/model/catalogue';
import { useEffect, useState, type Node } from 'react';
import fetch from 'isomorphic-unfetch';
import { spacing, grid, classNames } from '@weco/common/utils/classnames';
import {
  getIIIFPresentationLocation,
  getDownloadOptionsFromImageUrl,
  getEncoreLink,
} from '@weco/common/utils/works';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import { workLd } from '@weco/common/utils/json-ld';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import getLicenseInfo from '@weco/common/utils/get-license-info';
import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';
import WorkHeader from '@weco/common/views/components/WorkHeader/WorkHeader';
import BetaBar from '@weco/common/views/components/BetaBar/BetaBar';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { itemUrl } from '@weco/common/services/catalogue/urls';
import WorkDetails from '../components/WorkDetails/WorkDetails';
import SearchForm from '../components/SearchForm/SearchForm';
import ManifestContext from '@weco/common/views/components/ManifestContext/ManifestContext';
import { getWork } from '../services/catalogue/works';
import IIIFPresentationPreview from '@weco/common/views/components/IIIFPresentationPreview/IIIFPresentationPreview';
import IIIFImagePreview from '@weco/common/views/components/IIIFImagePreview/IIIFImagePreview';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import MessageBar from '@weco/common/views/components/MessageBar/MessageBar';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

type WobblyProps = {|
  children: Node,
|};

const WobblyRow = ({ children }: WobblyProps) => (
  <div
    className={classNames({
      'row bg-cream row--has-wobbly-background': true,
    })}
  >
    <div className="container">
      <div className="grid">
        <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>{children}</div>
      </div>
    </div>
    <div className="row__wobbly-background" />
  </div>
);

type Props = {|
  work: Work | CatalogueApiError,
|};

const getManifests = async function(manifests) {
  const data = Promise.all(
    manifests.map(async manifest => (await fetch(manifest['@id'])).json())
  );
  return data;
};

export const WorkPage = ({ work }: Props) => {
  const [iiifPresentationManifest, setIIIFPresentationManifest] = useState(
    null
  );
  const [iiifPresentationManifests, setIIIFPresentationManifests] = useState(
    null
  );
  const fetchIIIFPresentationManifest = async () => {
    try {
      const iiifPresentationLocation = getIIIFPresentationLocation(work);
      const iiifManifest = await fetch(iiifPresentationLocation.url);
      const manifestData = await iiifManifest.json();
      if (manifestData.manifests) {
        setIIIFPresentationManifests(
          await getManifests(manifestData.manifests)
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

  const [iiifImageLocation] = work.items
    .map(item =>
      item.locations.find(location => location.locationType.id === 'iiif-image')
    )
    .filter(Boolean);
  const iiifImageLocationUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImageLocationCredit = iiifImageLocation && iiifImageLocation.credit;
  const iiifImageLocationLicenseId =
    iiifImageLocation &&
    iiifImageLocation.license &&
    iiifImageLocation.license.id;
  const licenseInfo =
    iiifImageLocationLicenseId && getLicenseInfo(iiifImageLocationLicenseId);

  const iiifPresentationLocation = getIIIFPresentationLocation(work);

  const sierraIdFromPresentationManifestUrl =
    iiifPresentationLocation &&
    (iiifPresentationLocation.url.match(/iiif\/(.*)\/manifest/) || [])[1];

  const downloadOptions = iiifImageLocationUrl
    ? getDownloadOptionsFromImageUrl(iiifImageLocationUrl)
    : [];

  const sierraIds = work.identifiers.filter(
    i => i.identifierType.id === 'sierra-system-number'
  );

  // Assumption: a Sierra ID that _isn't_ the one in the IIIF manifest
  // will be for a physical item.
  const physicalSierraId = (
    sierraIds.find(i => i.value !== sierraIdFromPresentationManifestUrl) || {}
  ).value;

  // We strip the last character as that's what Wellcome library expect
  const encoreLink = physicalSierraId && getEncoreLink(physicalSierraId);

  const imageContentUrl =
    iiifImageLocationUrl &&
    iiifImageTemplate(iiifImageLocationUrl)({ size: `800,` });

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
      <InfoBanner
        text={[
          {
            type: 'paragraph',
            text: `Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`,
            spans: [],
          },
        ]}
        cookieName="WC_wellcomeImagesRedirect"
      />

      <Layout12>
        <TogglesContext.Consumer>
          {({ useStageApi }) =>
            useStageApi && (
              <MessageBar tagText="Dev alert">
                You are using the stage catalogue API - data mileage may vary!
              </MessageBar>
            )
          }
        </TogglesContext.Consumer>
        <BetaBar />
      </Layout12>

      <div
        className={classNames({
          'bg-cream': true,
          [spacing({ s: 4 }, { padding: ['top'] })]: true,
        })}
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
                compact={true}
              />
            </div>
          </div>

          <div className="grid">
            <div
              className={classNames({
                [grid({ s: 12 })]: true,
                [spacing({ s: 1 }, { padding: ['top', 'bottom'] })]: true,
              })}
            >
              <BackToResults />
            </div>
          </div>
        </div>
      </div>

      <div
        className={classNames({
          row: true,
          [spacing({ s: 6 }, { padding: ['top'] })]: true,
        })}
      >
        <div className="container">
          <div className="grid">
            <WorkHeader work={work} />
          </div>
        </div>
      </div>
      {iiifPresentationManifests &&
        iiifPresentationManifests.map((manifest, i) => (
          <ManifestContext.Provider value={manifest} key={i}>
            <SpacingComponent>
              <WobblyRow>
                {sierraIdFromPresentationManifestUrl && !iiifImageLocationUrl && (
                  <IIIFPresentationPreview
                    iiifPresentationLocation={iiifPresentationLocation}
                    itemUrl={itemUrl({
                      workId: work.id,
                      sierraId: sierraIdFromPresentationManifestUrl,
                      manifestId: manifest['@id'].match(
                        /^https:\/\/wellcomelibrary\.org\/iiif\/(.*)\/manifest$/
                      )[1],
                      langCode: work.language && work.language.id,
                      page: 1,
                      canvas: 1,
                    })}
                  />
                )}
              </WobblyRow>
            </SpacingComponent>
          </ManifestContext.Provider>
        ))}

      <ManifestContext.Provider value={iiifPresentationManifest}>
        {!iiifPresentationManifests && (
          <WobblyRow>
            {sierraIdFromPresentationManifestUrl && !iiifImageLocationUrl && (
              <IIIFPresentationPreview
                iiifPresentationLocation={iiifPresentationLocation}
                itemUrl={itemUrl({
                  workId: work.id,
                  sierraId: sierraIdFromPresentationManifestUrl,
                  manifestId: null,
                  langCode: work.language && work.language.id,
                  page: 1,
                  canvas: 1,
                })}
              />
            )}
            {iiifImageLocationUrl && (
              <IIIFImagePreview
                id={work.id}
                iiifUrl={iiifImageLocationUrl}
                itemUrl={itemUrl({
                  workId: work.id,
                  sierraId: null,
                  manifestId: null,
                  langCode: work.language && work.language.id,
                  page: 1,
                  canvas: 1,
                })}
                title={work.title}
              />
            )}
          </WobblyRow>
        )}
        <WorkDetails
          work={work}
          licenseInfo={licenseInfo}
          iiifImageLocationCredit={iiifImageLocationCredit}
          iiifImageLocationLicenseId={iiifImageLocationLicenseId}
          encoreLink={encoreLink}
          downloadOptions={downloadOptions}
        />
      </ManifestContext.Provider>
    </CataloguePageLayout>
  );
};

WorkPage.getInitialProps = async (
  ctx
): Promise<Props | CatalogueApiRedirect> => {
  const { id } = ctx.query;
  const { useStageApi } = ctx.query.toggles;

  const workOrError = await getWork({
    id,
    env: useStageApi ? 'stage' : 'prod',
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
