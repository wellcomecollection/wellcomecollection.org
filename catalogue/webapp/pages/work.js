// @flow
import type {
  Work,
  CatalogueApiError,
  CatalogueApiRedirect,
} from '../services/catalogue/works';
import { Fragment } from 'react';
import Router from 'next/router';
import { font, spacing, grid, classNames } from '@weco/common/utils/classnames';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import { workLd } from '@weco/common/utils/json-ld';
import WorkMedia from '@weco/common/views/components/WorkMedia/WorkMedia';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import getLicenseInfo from '@weco/common/utils/get-license-info';
import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';
import IIIFPresentationDisplay from '@weco/common/views/components/IIIFPresentationDisplay/IIIFPresentationDisplay';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import WorkDetails from '../components/WorkDetails/WorkDetails';
import WorkDetailsNewDataGrouping from '../components/WorkDetails/WorkDetailsNewDataGrouping';
import SearchForm from '../components/SearchForm/SearchForm';
import { getWork } from '../services/catalogue/works';
import { worksUrl } from '../services/catalogue/urls';
import {
  getPhysicalLocations,
  getDigitalLocations,
  getProductionDates,
} from '@weco/common/utils/works';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';

type Props = {|
  work: Work | CatalogueApiError,
  workType: string[],
  query: ?string,
  page: ?number,
  itemsLocationsLocationType: string[],
  showNewMetaDataGrouping: boolean,
  showWorkHeader: boolean,
  showCatalogueSearchFilters: boolean,
|};

export const WorkPage = ({
  work,
  query,
  page,
  workType,
  itemsLocationsLocationType,
  showNewMetaDataGrouping,
  showWorkHeader,
  showCatalogueSearchFilters,
}: Props) => {
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

  const [iiifPresentationLocation] = work.items
    .map(item =>
      item.locations.find(
        location => location.locationType.id === 'iiif-presentation'
      )
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

  const sierraId = (
    work.identifiers.find(
      identifier => identifier.identifierType.id === 'sierra-system-number'
    ) || {}
  ).value;
  // We strip the last character as that's what Wellcome Library expect
  const encoreLink =
    sierraId &&
    `http://search.wellcomelibrary.org/iii/encore/record/C__R${sierraId.substr(
      0,
      sierraId.length - 1
    )}`;

  const imageContentUrl =
    iiifImageLocationUrl &&
    iiifImageTemplate(iiifImageLocationUrl)({ size: `800,` });

  const digitalLocations = getDigitalLocations(work);
  const physicalLocations = getPhysicalLocations(work);
  const productionDates = getProductionDates(work);

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
    >
      <InfoBanner
        text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`}
        cookieName="WC_wellcomeImagesRedirect"
      />

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
              <SearchForm
                initialQuery={query || ''}
                initialWorkType={workType}
                initialItemsLocationsLocationType={itemsLocationsLocationType}
                showFilters={showCatalogueSearchFilters}
                ariaDescribedBy="search-form-description"
              />
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

      {showWorkHeader && (
        <div
          className={`row ${spacing({ s: 6 }, { padding: ['top', 'bottom'] })}`}
        >
          <div className="container">
            <div className="grid">
              <div
                className={classNames([
                  grid({ s: 12, m: 12, l: 10, xl: 10 }),
                  spacing({ s: 4 }, { margin: ['bottom'] }),
                ])}
              >
                <SpacingComponent>
                  <div
                    className={classNames({
                      [font({ s: 'HNL3' })]: true,
                    })}
                  >
                    {work.workType.label}
                  </div>

                  <h1
                    id="work-info"
                    className={classNames([
                      font({ s: 'HNM3', m: 'HNM2', l: 'HNM1' }),
                      spacing({ s: 0 }, { margin: ['top'] }),
                    ])}
                  >
                    {work.title}
                  </h1>

                  <div
                    className={classNames({
                      flex: true,
                    })}
                  >
                    {work.contributors.length > 0 && (
                      <LinkLabels
                        items={work.contributors.map(({ agent }) => ({
                          text: agent.label,
                          url: `/works?query="${agent.label}"`,
                        }))}
                      />
                    )}
                    {productionDates && (
                      <div
                        className={classNames({
                          [spacing({ s: 2 }, { margin: ['left'] })]: true,
                        })}
                      >
                        <LinkLabels
                          heading={'Date'}
                          items={productionDates.map(date => ({
                            text: date,
                            url: null,
                          }))}
                        />
                      </div>
                    )}
                  </div>

                  {(digitalLocations.length > 0 ||
                    physicalLocations.length > 0) && (
                    <div
                      className={classNames({
                        [spacing({ s: 2 }, { margin: ['top'] })]: true,
                      })}
                    >
                      <LinkLabels
                        heading={'See it'}
                        items={[
                          digitalLocations.length > 0
                            ? {
                                text: 'Online',
                                url: null,
                              }
                            : null,
                          physicalLocations.length > 0
                            ? {
                                text: 'Wellcome Library',
                                url: null,
                              }
                            : null,
                        ].filter(Boolean)}
                      />
                    </div>
                  )}
                </SpacingComponent>
              </div>
            </div>
          </div>
        </div>
      )}

      <Fragment>
        {iiifPresentationLocation && (
          <IIIFPresentationDisplay
            manifestLocation={iiifPresentationLocation.url}
          />
        )}
        {iiifImageLocationUrl && (
          <WorkMedia
            id={work.id}
            iiifUrl={iiifImageLocationUrl}
            title={work.title}
          />
        )}

        {showNewMetaDataGrouping ? (
          <WorkDetailsNewDataGrouping
            work={work}
            iiifImageLocationUrl={iiifImageLocationUrl}
            licenseInfo={licenseInfo}
            iiifImageLocationCredit={iiifImageLocationCredit}
            iiifImageLocationLicenseId={iiifImageLocationLicenseId}
            encoreLink={encoreLink}
          />
        ) : (
          <WorkDetails
            work={work}
            iiifImageLocationUrl={iiifImageLocationUrl}
            licenseInfo={licenseInfo}
            iiifImageLocationCredit={iiifImageLocationCredit}
            iiifImageLocationLicenseId={iiifImageLocationLicenseId}
            encoreLink={encoreLink}
          />
        )}
      </Fragment>
    </PageLayout>
  );
};

WorkPage.getInitialProps = async (
  ctx
): Promise<Props | CatalogueApiRedirect> => {
  const workTypeQuery = ctx.query.workType;
  const workType = Array.isArray(workTypeQuery)
    ? workTypeQuery
    : typeof workTypeQuery === 'string'
    ? workTypeQuery.split(',')
    : ['k', 'q'];
  const itemsLocationsLocationType =
    'items.locations.locationType' in ctx.query
      ? ctx.query['items.locations.locationType'].split(',')
      : ['iiif-image'];

  const { id, query, page } = ctx.query;
  const workOrError = await getWork({ id });
  const showNewMetaDataGrouping = Boolean(
    ctx.query.toggles.showWorkMetaDataGrouping
  );
  const showWorkHeader = Boolean(ctx.query.toggles.showWorkHeader);
  const showCatalogueSearchFilters = Boolean(
    ctx.query.toggles.showCatalogueSearchFilters
  );

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
      workType,
      itemsLocationsLocationType,
      showNewMetaDataGrouping,
      showWorkHeader,
      showCatalogueSearchFilters,
    };
  }
};

export default WorkPage;
