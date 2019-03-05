// @flow
import { Fragment, useState, useEffect } from 'react';
import Router from 'next/router';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';
import {
  type Work,
  type CatalogueApiError,
  type CatalogueApiRedirect,
} from '@weco/common/model/catalogue';
import { spacing, grid, classNames } from '@weco/common/utils/classnames';
import { getIiifPresentationLocation } from '@weco/common/utils/works';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import { workLd } from '@weco/common/utils/json-ld';
import WorkMedia from '@weco/common/views/components/WorkMedia/WorkMedia';
import ErrorPage from '@weco/common/views/components/ErrorPage/ErrorPage';
import getLicenseInfo from '@weco/common/utils/get-license-info';
import BackToResults from '@weco/common/views/components/BackToResults/BackToResults';
import WorkHeader from '@weco/common/views/components/WorkHeader/WorkHeader';
import BetaBar from '@weco/common/views/components/BetaBar/BetaBar';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { worksUrl, itemUrl } from '@weco/common/services/catalogue/urls';
import WorkDetails from '../components/WorkDetails/WorkDetails';
import SearchForm from '../components/SearchForm/SearchForm';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { getWork } from '../services/catalogue/works';

// TODO flow
// Ideal preview thumbnails order: Title page, Front Cover, first page of Table of Contents, 2 random.
// If we don't have any of the sructured pages, we fill with random ones, so there are always 5 images if possible.
function randomImages(iiifManifest = null, structuredImages = [], n = 1) {
  const images = [];
  const canvases = iiifManifest
    ? iiifManifest.sequences
        .find(sequence => sequence['@type'] === 'sc:Sequence')
        .canvases.filter(canvas => {
          // Don't include the structured pages we're using when getting random ones
          return (
            structuredImages
              .map(type => {
                return type.images.find(image => {
                  return canvas['@id'] === image.canvasId;
                });
              })
              .filter(Boolean).length === 0
          );
        })
    : [];

  const numberOfImages = canvases.length < n ? canvases.length : n;

  for (var i = 1; i <= numberOfImages; i++) {
    const randomNumber = Math.floor(Math.random() * canvases.length);
    const randomCanvas = canvases.splice(randomNumber, 1)[0];
    images.push({
      orientation:
        randomCanvas.thumbnail.service.width >
        randomCanvas.thumbnail.service.height
          ? 'landscape'
          : 'portrait',
      uri: iiifImageTemplate(randomCanvas.thumbnail.service['@id'])({
        size: '!400,400',
      }),
      canvasId: randomCanvas['@id'],
    });
  }
  return {
    label: 'random',
    images,
  };
}

function structuredImages(iiifManifest = null) {
  const structures = iiifManifest ? iiifManifest.structures : [];
  return structures.map(structure => {
    const images = structure.canvases.map(canvasId => {
      const matchingCanvas = iiifManifest.sequences
        .find(sequence => sequence['@type'] === 'sc:Sequence')
        .canvases.find(canvas => {
          return canvas['@id'] === canvasId;
        });
      return {
        orientation:
          matchingCanvas.thumbnail.service.width >
          matchingCanvas.thumbnail.service.height
            ? 'landscape'
            : 'portrait',
        uri: iiifImageTemplate(matchingCanvas.thumbnail.service['@id'])({
          size: '!400,400',
        }),
        canvasId,
      };
    });
    return {
      label: structure.label,
      images,
    };
  });
}

function orderedStructuredImages(structuredImages) {
  const titlePage = structuredImages.find(
    structuredImage => structuredImage.label === 'Title Page'
  );
  const frontCover = structuredImages.find(
    structuredImage =>
      structuredImage.label === 'Front Cover' ||
      structuredImage.label === 'Cover'
  );
  const firstTableOfContents = structuredImages.find(
    structuredImage => structuredImage.label === 'Table of Contents'
  );
  return [titlePage, frontCover, firstTableOfContents].filter(Boolean);
}

function previewThumbnails(
  iiifManifest = {},
  structuredImages = [],
  idealNumber = 5
) {
  return structuredImages.length < idealNumber
    ? structuredImages.concat(
        randomImages(
          iiifManifest,
          structuredImages,
          idealNumber - structuredImages.length
        )
      )
    : structuredImages;
}
type Props = {|
  work: Work | CatalogueApiError,
  iiifManifest: ?{},
  workType: string[],
  query: ?string,
  page: ?number,
  itemsLocationsLocationType: string[],
|};

export const WorkPage = ({
  work,
  iiifManifest,
  query,
  page,
  workType,
  itemsLocationsLocationType,
}: Props) => {
  const [imageThumbnails, setImageThumbnails] = useState(false);
  useEffect(() => {
    setImageThumbnails(
      previewThumbnails(
        iiifManifest,
        orderedStructuredImages(structuredImages(iiifManifest)),
        5
      )
    );
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

  const sierraId = (
    work.identifiers.find(
      identifier => identifier.identifierType.id === 'sierra-system-number'
    ) || {}
  ).value;
  // We strip the last character as that's what Wellcome library expect
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

      {imageThumbnails &&
        imageThumbnails.map(pageType => {
          return pageType.images.map(image => (
            <img
              style={{ width: 'auto', maxHeight: '300px' }}
              key={image.uri}
              src={image.uri}
            />
          ));
        })}

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

      {iiifManifest && (
        <Layout12>
          <NextLink
            {...itemUrl({
              workId: work.id,
              query,
              page,
              workType,
              itemsLocationsLocationType,
            })}
          >
            <a>View item</a>
          </NextLink>
        </Layout12>
      )}

      <TogglesContext.Consumer>
        {({ showWorkPreview, showMultiImageWorkPreview }) => (
          <Fragment>
            {iiifImageLocationUrl && !showWorkPreview && (
              <WorkMedia
                id={work.id}
                iiifUrl={iiifImageLocationUrl}
                title={work.title}
              />
            )}

            <WorkDetails
              work={work}
              iiifManifest={iiifManifest}
              iiifImageLocationUrl={iiifImageLocationUrl}
              licenseInfo={licenseInfo}
              iiifImageLocationCredit={iiifImageLocationCredit}
              iiifImageLocationLicenseId={iiifImageLocationLicenseId}
              encoreLink={encoreLink}
              showWorkPreview={showWorkPreview}
              showMultiImageWorkPreview={showMultiImageWorkPreview}
            />
          </Fragment>
        )}
      </TogglesContext.Consumer>
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
  const iiifPresentationLocation = getIiifPresentationLocation(workOrError);
  let iiifManifest = null;
  if (iiifPresentationLocation) {
    try {
      iiifManifest = await fetch(iiifPresentationLocation.url);
    } catch (e) {}
  }

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
      iiifManifest: iiifManifest ? await iiifManifest.json() : null,
      page: page ? parseInt(page, 10) : null,
      workType,
      itemsLocationsLocationType,
    };
  }
};

export default WorkPage;
