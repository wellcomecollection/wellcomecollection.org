// @flow
import type {Work, CatalogueApiError, CatalogueApiRedirect} from '../services/catalogue/works';
import {Fragment} from 'react';
import Router from 'next/router';
import {spacing, grid, classNames} from '@weco/common/utils/classnames';
import {iiifImageTemplate} from '@weco/common/utils/convert-image-uri';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import {workLd} from '@weco/common/utils/json-ld';
import WorkMedia from '@weco/common/views/components/WorkMedia/WorkMedia';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import getLicenseInfo from '@weco/common/utils/get-license-info';
import {getWork} from '../services/catalogue/works';
import {worksUrl} from '../services/catalogue/urls';
import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';
import WorkDetails from '../components/WorkDetails/WorkDetails';
import WorkDetailsNewDataGrouping from '../components/WorkDetails/WorkDetailsNewDataGrouping';
import SearchForm from '../components/SearchForm/SearchForm';

type Props = {|
  work: Work | CatalogueApiError,
  query: ?string,
  page: ?number,
  showSearchBoxOnWork: boolean,
  showNewMetaDataGrouping: boolean
|}

export const WorkPage = ({
  work,
  query,
  page,
  showSearchBoxOnWork,
  showNewMetaDataGrouping
}: Props) => {
  if (work.type === 'Error') {
    return (
      <ErrorPage
        title={work.httpStatus === 410 ? 'This catalogue item has been removed.' : null}
        statusCode={work.httpStatus}
      />
    );
  }

  const [iiifImageLocation] = work.items.map(
    item => item.locations.find(
      location => location.locationType.id === 'iiif-image'
    )
  ).filter(Boolean);

  const iiifImageLocationUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImageLocationCredit = iiifImageLocation && iiifImageLocation.credit;
  const iiifImageLocationLicenseId = iiifImageLocation && iiifImageLocation.license && iiifImageLocation.license.id;
  const licenseInfo = iiifImageLocationLicenseId && getLicenseInfo(iiifImageLocationLicenseId);

  const sierraId = (work.identifiers.find(identifier =>
    identifier.identifierType.id === 'sierra-system-number'
  ) || {}).value;
  // We strip the last character as that's what Wellcome Library expect
  const encoreLink = sierraId && `http://search.wellcomelibrary.org/iii/encore/record/C__R${sierraId.substr(0, sierraId.length - 1)}`;

  const imageContentUrl = iiifImageLocationUrl && iiifImageTemplate(iiifImageLocationUrl)({ size: `800,` });
  return (
    <PageLayout
      title={work.title}
      description={work.description || work.title}
      url={{pathname: `/works/${work.id}`}}
      openGraphType={'website'}
      jsonLd={workLd(work)}
      siteSection={'works'}
      oEmbedUrl={`https://wellcomecollection.org/oembed/works/${work.id}`}
      imageUrl={imageContentUrl}
      imageAltText={work.title}>
      <InfoBanner text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`} cookieName='WC_wellcomeImagesRedirect' />

      {showSearchBoxOnWork &&
        <div className={classNames({
          'bg-cream': true,
          [spacing({s: 4}, {padding: ['top']})]: true,
          [spacing({s: 4}, {padding: ['bottom']})]: !query
        })}>
          <div className='container'>
            <div className='grid'>
              <div className={classNames({
                [grid({s: 12, m: 10, l: 8, xl: 8})]: true
              })}>
                {/* TODO: if this survives the A/B test, we'll have to pass
                in workType etc. instead of hard-coding */}
                <SearchForm
                  initialQuery={query || ''}
                  initialWorkType={['k', 'q']}
                  initialItemsLocationsLocationType={['iiif-image']}
                  showFilters={false}
                  ariaDescribedBy='search-form-description' />
              </div>
            </div>

            {query &&
              <div className='grid'>
                <div className={classNames({
                  [grid({s: 12})]: true,
                  [spacing({s: 1}, {padding: ['top', 'bottom']})]: true
                })}>
                  <BackToResults nextLink={worksUrl({query, page})} />
                </div>
              </div>
            }

          </div>
        </div>
      }

      {query && !showSearchBoxOnWork &&
        <div className='row'>
          <div className='container'>
            <div className='grid'>
              <div className={grid({s: 12})}>
                <BackToResults nextLink={worksUrl({query, page})} />
              </div>
            </div>
          </div>
        </div>
      }

      <Fragment>
        {iiifImageLocationUrl && <WorkMedia
          id={work.id}
          iiifUrl={iiifImageLocationUrl}
          title={work.title} />}

        {showNewMetaDataGrouping
          ? <WorkDetailsNewDataGrouping
            work={work}
            iiifImageLocationUrl={iiifImageLocationUrl}
            licenseInfo={licenseInfo}
            iiifImageLocationCredit={iiifImageLocationCredit}
            iiifImageLocationLicenseId={iiifImageLocationLicenseId}
            encoreLink={encoreLink} />
          : <WorkDetails
            work={work}
            iiifImageLocationUrl={iiifImageLocationUrl}
            licenseInfo={licenseInfo}
            iiifImageLocationCredit={iiifImageLocationCredit}
            iiifImageLocationLicenseId={iiifImageLocationLicenseId}
            encoreLink={encoreLink} />}
      </Fragment>

    </PageLayout>
  );
};

WorkPage.getInitialProps = async (ctx): Promise<Props | CatalogueApiRedirect> => {
  const {id, query, page} = ctx.query;
  const workOrError = await getWork({ id });
  const showSearchBoxOnWork = Boolean(ctx.query.toggles.showSearchBoxOnWork);
  const showNewMetaDataGrouping = Boolean(ctx.query.toggles.showWorkMetaDataGrouping);

  if (workOrError && workOrError.type === 'Redirect') {
    const {res} = ctx;
    if (res) {
      res.writeHead(workOrError.status, {
        Location: workOrError.redirectToId
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
      showSearchBoxOnWork,
      showNewMetaDataGrouping: true
    };
  }
};

export default WorkPage;
