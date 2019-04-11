// @flow
import { useEffect } from 'react';
import { type Context } from 'next';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { itemUrl, workUrl } from '@weco/common/services/catalogue/urls';
import { getDownloadOptionsFromManifest } from '@weco/common/utils/works';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import { classNames, spacing, font } from '@weco/common/utils/classnames';
import Raven from 'raven-js';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import TruncatedText from '@weco/common/views/components/TruncatedText/TruncatedText';
import IIIFViewer from '@weco/common/views/components/IIIFViewer/IIIFViewer';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import useSearchLogger from '@weco/common/views/components/useSearchLogger/useSearchLogger';
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
  manifest: IIIFManifest,
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
    Raven.captureException(e);
    return null;
  }
}

const ItemPage = ({
  workId,
  sierraId,
  langCode,
  manifest,
  pageSize,
  pageIndex,
  canvasIndex,
  canvasOcr,
  itemsLocationsLocationType,
  workType,
  query,
}: Props) => {
  const canvases = manifest.sequences && manifest.sequences[0].canvases;
  const currentCanvas = canvases && canvases[canvasIndex];
  const title = manifest.label;
  const mainImageService =
    currentCanvas && currentCanvas.images[0].resource.service
      ? {
          '@id': currentCanvas.images[0].resource.service['@id'],
        }
      : null;
  const downloadOptions = getDownloadOptionsFromManifest(manifest);
  const pdfRendering =
    downloadOptions.find(option => option.label === 'Download PDF') || null;
  const navigationCanvases =
    canvases &&
    [...Array(pageSize)]
      .map((_, i) => pageSize * pageIndex + i)
      .map(i => canvases[i])
      .filter(Boolean);

  const sharedPaginatorProps = {
    totalResults: canvases && canvases.length,
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

  const searchLogger = useSearchLogger();
  useEffect(() => {
    const event = {
      event: 'Catalogue View Item',
      service: 'search_logs',
      resource: {
        title: title,
        id: workId,
        type: 'Item',
      },
    };
    searchLogger.track(event);
  }, []);

  return (
    <PageLayout
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
        {!pdfRendering && !mainImageService && (
          <div
            className={classNames({
              [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
            })}
          >
            <BetaMessage message="We are working to make this item available online in April 2019." />
          </div>
        )}
      </Layout12>
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
    </PageLayout>
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
  const manifest = await (await fetch(
    `https://wellcomelibrary.org/iiif/${sierraId}/manifest`
  )).json();

  const canvases = manifest.sequences && manifest.sequences[0].canvases;
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
    // TODO: add these back in, it's just makes it easier to check the URLs
    itemsLocationsLocationType: null,
    workType: null,
    query,
  };
};

export default ItemPage;
