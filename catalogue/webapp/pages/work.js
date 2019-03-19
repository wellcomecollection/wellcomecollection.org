// @flow
import Router from 'next/router';
import {
  type Work,
  type CatalogueApiError,
  type CatalogueApiRedirect,
} from '@weco/common/model/catalogue';
import { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { spacing, grid, classNames } from '@weco/common/utils/classnames';
import {
  getIIIFPresentationLocation,
  getDownloadOptionsFromImageUrl,
  getEncoreLink,
} from '@weco/common/utils/works';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import { workLd } from '@weco/common/utils/json-ld';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import getLicenseInfo from '@weco/common/utils/get-license-info';
import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';
import WorkHeader from '@weco/common/views/components/WorkHeader/WorkHeader';
import BetaBar from '@weco/common/views/components/BetaBar/BetaBar';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { worksUrl, itemUrl } from '@weco/common/services/catalogue/urls';
import WorkDetails from '../components/WorkDetails/WorkDetails';
import { SearchProvider } from '../components/SearchContext/SearchContext';
import SearchForm from '../components/SearchForm/SearchForm';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import ManifestContext from '@weco/common/views/components/ManifestContext/ManifestContext';
import { getWork } from '../services/catalogue/works';
import IIIFPresentationPreview from '@weco/common/views/components/IIIFPresentationPreview/IIIFPresentationPreview';
import IIIFImagePreview from '@weco/common/views/components/IIIFImagePreview/IIIFImagePreview';

type Props = {|
  work: Work | CatalogueApiError,
  workType: string[],
  query: ?string,
  page: ?number,
  itemsLocationsLocationType: string[],
|};

export const WorkPage = ({
  work,
  query,
  page,
  workType,
  itemsLocationsLocationType,
}: Props) => {
  const [iiifPresentationManifest, setIIIFPresentationManifest] = useState(
    null
  );
  const fetchIIIFPresentationManifest = async () => {
    try {
      const iiifPresentationLocation = getIIIFPresentationLocation(work);
      const iiifManifest = await fetch(iiifPresentationLocation.url);
      const manifestData = await iiifManifest.json();
      setIIIFPresentationManifest(manifestData);
    } catch (e) {}
  };

  useEffect(() => {
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
    <PageLayout
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
        text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`}
        cookieName="WC_wellcomeImagesRedirect"
      />

      <TogglesContext.Consumer>
        {({ betaBar }) =>
          betaBar && (
            <Layout12>
              <BetaBar />
            </Layout12>
          )
        }
      </TogglesContext.Consumer>

      <div
        className={classNames({
          'bg-cream': true,
          [spacing({ s: 4 }, { padding: ['top'] })]: true,
          [spacing({ s: 4 }, { padding: ['bottom'] })]: !query,
        })}
      >
        <div className="container">
          <div className="grid">
            <div
              className={classNames({
                [grid({ s: 12, m: 10, l: 8, xl: 8 })]: true,
              })}
            >
              <SearchProvider
                initialState={{
                  query: query || '',
                  page: page || 1,
                  workType,
                  itemsLocationsLocationType,
                }}
              >
                <SearchForm
                  ariaDescribedBy="search-form-description"
                  compact={true}
                  works={null}
                />
              </SearchProvider>
            </div>
          </div>

          {query && (
            <div className="grid">
              <div
                className={classNames({
                  [grid({ s: 12 })]: true,
                  [spacing({ s: 1 }, { padding: ['top', 'bottom'] })]: true,
                })}
              >
                <BackToResults
                  nextLink={worksUrl({
                    query,
                    page,
                    workType,
                    itemsLocationsLocationType,
                  })}
                />
              </div>
            </div>
          )}
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
      <ManifestContext.Provider value={iiifPresentationManifest}>
        {sierraIdFromPresentationManifestUrl && (
          <div className="container">
            <IIIFPresentationPreview
              iiifPresentationLocation={iiifPresentationLocation}
              itemUrl={itemUrl({
                workId: work.id,
                query,
                workType,
                itemsLocationsLocationType,
                sierraId: sierraIdFromPresentationManifestUrl,
                page: 1,
                canvas: 1,
              })}
            />
          </div>
        )}
        {iiifImageLocationUrl && (
          <IIIFImagePreview
            id={work.id}
            iiifUrl={iiifImageLocationUrl}
            title={work.title}
          />
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
    </PageLayout>
  );
};

WorkPage.getInitialProps = async (
  ctx
): Promise<Props | CatalogueApiRedirect> => {
  const workTypeQuery = ctx.query.workType;
  const itemsLocationsLocationTypeQuery =
    ctx.query['items.locations.locationType'];

  const { id, query, page } = ctx.query;
  const workOrError = await getWork({ id });

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
      query,
      work: workOrError,
      page: page ? parseInt(page, 10) : null,
      workType: workTypeQuery && workTypeQuery.split(',').filter(Boolean),
      itemsLocationsLocationType:
        itemsLocationsLocationTypeQuery &&
        itemsLocationsLocationTypeQuery.split(',').filter(Boolean),
    };
  }
};

export default WorkPage;
