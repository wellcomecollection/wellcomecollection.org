// @flow
import { Fragment } from 'react';
import Router from 'next/router';
import {
  type Work,
  type CatalogueApiError,
  type CatalogueApiRedirect,
} from '@weco/common/model/catalogue';
import { spacing, grid, classNames } from '@weco/common/utils/classnames';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import { workLd } from '@weco/common/utils/json-ld';
import WorkMedia from '@weco/common/views/components/WorkMedia/WorkMedia';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import getLicenseInfo from '@weco/common/utils/get-license-info';
import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';
import IIIFPresentationDisplay from '@weco/common/views/components/IIIFPresentationDisplay/IIIFPresentationDisplay';
import WorkHeader from '@weco/common/views/components/WorkHeader/WorkHeader';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import WorkDetails from '../components/WorkDetails/WorkDetails';
import SearchForm from '../components/SearchForm/SearchForm';
import { getWork } from '../services/catalogue/works';

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
                ariaDescribedBy="search-form-description"
                compact={true}
                works={null}
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

        <WorkDetails
          work={work}
          iiifImageLocationUrl={iiifImageLocationUrl}
          licenseInfo={licenseInfo}
          iiifImageLocationCredit={iiifImageLocationCredit}
          iiifImageLocationLicenseId={iiifImageLocationLicenseId}
          encoreLink={encoreLink}
        />
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
    };
  }
};

export default WorkPage;
