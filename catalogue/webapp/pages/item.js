// @flow
import { type Context } from 'next';
import {
  type Work,
  type CatalogueApiError,
} from '@weco/common/model/catalogue';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { itemUrl, workUrl } from '@weco/common/services/catalogue/urls';
import { getDownloadOptionsFromManifest } from '@weco/common/utils/works';
import { getWork } from '../services/catalogue/works';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import { classNames, spacing, font } from '@weco/common/utils/classnames';
import Raven from 'raven-js';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import TruncatedText from '@weco/common/views/components/TruncatedText/TruncatedText';
import IIIFViewer from '@weco/common/views/components/IIIFViewer/IIIFViewer';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import ImageViewer from '@weco/common/views/components/ImageViewer/ImageViewer';
import styled from 'styled-components';

const IframePdfViewer = styled.iframe`
  width: 90vw;
  height: 90vh;
  margin: 0 auto 24px;
  display: block;
  border: none;
`;

type Props = {|
  workId: string,
  sierraId: string,
  langCode: string,
  manifest: ?IIIFManifest,
  work: ?(Work | CatalogueApiError),
  pageSize: number,
  pageIndex: number,
  canvasIndex: number,
  canvasOcr: ?string,
  itemsLocationsLocationType: ?(string[]),
  workType: ?(string[]),
  query: ?string,
|};

async function getCanvasOcr(canvas) {
  const textContent =
    canvas.otherContent &&
    canvas.otherContent.find(
      content =>
        content['@type'] === 'sc:AnnotationList' &&
        content.label === 'Text of this page'
    );

  const textService = textContent && textContent['@id'];

  if (textService) {
    try {
      const textJson = await fetch(textService);
      const text = await textJson.json();
      const textString = text.resources
        .filter(resource => {
          return resource.resource['@type'] === 'cnt:ContentAsText';
        })
        .map(resource => resource.resource.chars)
        .join(' ');
      return textString.length > 0 ? textString : null;
    } catch (e) {
      Raven.captureException(new Error(`IIIF text service error: ${e}`), {
        tags: {
          service: 'dlcs',
        },
      });

      return null;
    }
  }
}

const ItemPage = ({
  workId,
  sierraId,
  langCode,
  manifest,
  work,
  pageSize,
  pageIndex,
  canvasIndex,
  canvasOcr,
  itemsLocationsLocationType,
  workType,
  query,
}: Props) => {
  const canvases =
    manifest && manifest.sequences && manifest.sequences[0].canvases;
  const currentCanvas = canvases && canvases[canvasIndex];
  const title = (manifest && manifest.label) || (work && work.title) || '';
  const [iiifImageLocation] =
    work && work.items
      ? work.items
          .map(item =>
            item.locations.find(
              location => location.locationType.id === 'iiif-image'
            )
          )
          .filter(Boolean)
      : [null];

  const iiifImageLocationUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImage =
    iiifImageLocationUrl && iiifImageTemplate(iiifImageLocationUrl);
  const imageUrl = iiifImage && iiifImage({ size: '800,' });

  const mainImageService =
    currentCanvas && currentCanvas.images[0].resource.service
      ? {
          '@id': currentCanvas.images[0].resource.service['@id'],
        }
      : null;
  const downloadOptions = manifest && getDownloadOptionsFromManifest(manifest);
  const pdfRendering =
    (downloadOptions &&
      downloadOptions.find(option => option.label === 'Download PDF')) ||
    null;
  const navigationCanvases =
    canvases &&
    [...Array(pageSize)]
      .map((_, i) => pageSize * pageIndex + i)
      .map(i => canvases[i])
      .filter(Boolean);

  const sharedPaginatorProps = {
    totalResults: canvases ? canvases.length : 1,
    link: itemUrl({
      workId,
      page: pageIndex + 1,
      canvas: canvasIndex + 1,
      langCode,
      sierraId,
    }),
  };

  const mainPaginatorProps = {
    currentPage: canvasIndex + 1,
    pageSize: 1,
    linkKey: 'canvas',
    ...sharedPaginatorProps,
  };

  const thumbsPaginatorProps = {
    currentPage: pageIndex + 1,
    pageSize: pageSize,
    linkKey: 'page',
    ...sharedPaginatorProps,
  };

  return (
    <CataloguePageLayout
      title={title}
      description={''}
      url={{ pathname: `/works/${workId}/items`, query: { sierraId } }}
      openGraphType={'website'}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection={'works'}
      imageUrl={'imageContentUrl'}
      imageAltText={''}
      hideNewsletterPromo={true}
    >
      <Layout12>
        <div
          className={classNames({
            [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
            [spacing({ s: 6 }, { padding: ['top'] })]: true,
          })}
        >
          <TruncatedText
            text={title}
            as="h1"
            className={classNames({
              [font({ s: 'HNM3', m: 'HNM2', l: 'HNM1' })]: true,
            })}
            title={title}
            lang={langCode}
          >
            {title}
          </TruncatedText>
          <NextLink
            {...workUrl({
              id: workId,
            })}
          >
            <a
              className={classNames({
                [font({ s: 'HNM5', m: 'HNM4' })]: true,
              })}
            >
              Overview
            </a>
          </NextLink>
        </div>
        {!pdfRendering && !mainImageService && !iiifImageLocationUrl && (
          <div
            className={classNames({
              [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
            })}
          >
            <BetaMessage message="We are working to make this item available online in April 2019." />
          </div>
        )}
      </Layout12>
      {imageUrl && iiifImageLocationUrl && (
        <Layout12>
          <ImageViewer
            infoUrl={iiifImageLocationUrl}
            src={imageUrl}
            id={imageUrl}
            width={800}
            srcSet={''}
            canvasOcr={null}
            lang={null}
          />
        </Layout12>
      )}
      {pdfRendering && !mainImageService && (
        <IframePdfViewer title={`PDF: ${title}`} src={pdfRendering['@id']} />
      )}
      {mainImageService && currentCanvas && navigationCanvases && (
        <IIIFViewer
          mainPaginatorProps={mainPaginatorProps}
          thumbsPaginatorProps={thumbsPaginatorProps}
          currentCanvas={currentCanvas}
          lang={langCode}
          canvasOcr={canvasOcr}
          navigationCanvases={navigationCanvases}
          workId={workId}
          query={query}
          workType={workType}
          itemsLocationsLocationType={itemsLocationsLocationType}
          pageIndex={pageIndex}
          sierraId={sierraId}
          pageSize={pageSize}
          canvasIndex={canvasIndex}
        />
      )}
    </CataloguePageLayout>
  );
};

ItemPage.getInitialProps = async (ctx: Context): Promise<Props> => {
  const {
    workId,
    sierraId,
    langCode,
    query,
    page = 1,
    pageSize = 4,
    canvas = 1,
  } = ctx.query;
  const pageIndex = page - 1;
  const canvasIndex = canvas - 1;
  const manifest = sierraId
    ? await (await fetch(
        `https://wellcomelibrary.org/iiif/${sierraId}/manifest`
      )).json()
    : null;
  const work = !sierraId ? await getWork({ id: workId }) : null;

  const canvases =
    manifest && manifest.sequences && manifest.sequences[0].canvases;
  const currentCanvas = canvases && canvases[canvasIndex];
  const canvasOcr = currentCanvas ? await getCanvasOcr(currentCanvas) : null;

  return {
    workId,
    sierraId,
    langCode,
    manifest,
    pageSize,
    pageIndex,
    canvasIndex,
    canvasOcr,
    work,
    // TODO: add these back in, it's just makes it easier to check the URLs
    itemsLocationsLocationType: null,
    workType: null,
    query,
  };
};

export default ItemPage;

// TODO initial view of image on item page?
// TODO make use of localStorage for work, so don't have to get it again?
