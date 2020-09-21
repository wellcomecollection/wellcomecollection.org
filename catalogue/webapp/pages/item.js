// @flow
import { type ComponentType } from 'react';
import { type Context } from 'next';
import {
  type Work,
  type CatalogueApiError,
} from '@weco/common/model/catalogue';
import fetch from 'isomorphic-unfetch';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { itemLink } from '@weco/common/services/catalogue/routes';
import { getDigitalLocationOfType } from '@weco/common/utils/works';
import {
  getDownloadOptionsFromManifest,
  getVideo,
  getAudio,
  getServiceId,
  getUiExtensions,
  isUiEnabled,
} from '@weco/common/utils/iiif';
import { getWork, getCanvasOcr } from '../services/catalogue/works';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import IIIFViewer from '@weco/common/views/components/IIIFViewer/IIIFViewer';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import styled from 'styled-components';
import Space, {
  type SpaceComponentProps,
} from '@weco/common/views/components/styled/Space';

const IframePdfViewer: ComponentType<SpaceComponentProps> = styled(Space).attrs(
  {
    className: 'h-center',
  }
)`
  width: 90vw;
  height: 90vh;
  display: block;
  border: 0;
  margin-top: 98px;
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
  canvases: [],
  currentCanvas: ?any,
  video: ?{
    '@id': string,
    format: string,
  },
  audio: ?{
    '@id': string,
  },
|};

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
  canvases,
  currentCanvas,
  video,
  audio,
}: Props) => {
  const title = (manifest && manifest.label) || (work && work.title) || '';
  const iiifImageLocation =
    work && getDigitalLocationOfType(work, 'iiif-image');

  const serviceId = getServiceId(currentCanvas);
  const mainImageService = serviceId && {
    '@id': serviceId,
  };

  const showDownloadOptions = manifest
    ? isUiEnabled(getUiExtensions(manifest), 'mediaDownload')
    : true;

  const downloadOptions =
    showDownloadOptions && manifest && getDownloadOptionsFromManifest(manifest);

  const pdfRendering =
    (downloadOptions &&
      downloadOptions.find(option => option.label === 'Download PDF')) ||
    null;

  const sharedPaginatorProps = {
    totalResults: canvases ? canvases.length : 1,
    link: itemLink({
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
      hideFooter={true}
      hideInfoBar={true}
    >
      {audio && (
        <Layout12>
          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <audio
              controls
              style={{
                maxWidth: '100%',
                display: 'block',
                margin: '98px auto 0',
              }}
              src={audio['@id']}
              controlsList={!showDownloadOptions ? 'nodownload' : null}
            >
              {`Sorry, your browser doesn't support embedded audio.`}
            </audio>
          </Space>
        </Layout12>
      )}

      {video && (
        <Layout12>
          <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
            <video
              controls
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                display: 'block',
                margin: '98px auto auto',
              }}
              controlsList={!showDownloadOptions ? 'nodownload' : null}
            >
              <source src={video['@id']} type={video.format} />
              {`Sorry, your browser doesn't support embedded video.`}
            </video>
          </Space>
        </Layout12>
      )}
      {!audio &&
        !video &&
        !pdfRendering &&
        !mainImageService &&
        !iiifImageLocation && (
          <Layout12>
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <div style={{ marginTop: '98px' }}>
                <BetaMessage message="We are working to make this item available online." />
              </div>
            </Space>
          </Layout12>
        )}
      {pdfRendering && !mainImageService && (
        <IframePdfViewer
          v={{
            size: 'l',
            properties: ['margin-bottom'],
          }}
          as="iframe"
          title={`PDF: ${title}`}
          src={pdfRendering['@id']}
        />
      )}

      {((mainImageService && currentCanvas) || iiifImageLocation) && (
        <IIIFViewer
          title={title}
          mainPaginatorProps={mainPaginatorProps}
          thumbsPaginatorProps={thumbsPaginatorProps}
          currentCanvas={currentCanvas}
          lang={langCode}
          canvasOcr={canvasOcr}
          canvases={canvases}
          workId={workId}
          pageIndex={pageIndex}
          sierraId={sierraId}
          pageSize={pageSize}
          canvasIndex={canvasIndex}
          iiifImageLocation={iiifImageLocation}
          work={work}
          manifest={manifest}
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
    page = 1,
    pageSize = 4,
    canvas = 1,
  } = ctx.query;
  const pageIndex = page - 1;
  const canvasIndex = canvas - 1;
  const manifestUrl = sierraId
    ? `https://wellcomelibrary.org/iiif/${sierraId}/manifest`
    : null;
  const manifest = manifestUrl ? await (await fetch(manifestUrl)).json() : null;
  const video = manifest && getVideo(manifest);
  const audio = manifest && getAudio(manifest);
  const work = await getWork({
    id: workId,
    toggles: ctx.query.toggles,
  });
  const canvases =
    manifest && manifest.sequences && manifest.sequences[0].canvases
      ? manifest.sequences[0].canvases
      : [];
  const currentCanvas = canvases[canvasIndex] ? canvases[canvasIndex] : null;
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
    canvases,
    currentCanvas,
    video,
    audio,
  };
};

export default ItemPage;
