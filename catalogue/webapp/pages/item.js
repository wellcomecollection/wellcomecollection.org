// @flow
import { type ComponentType, useEffect, useState } from 'react';
import { type Context } from 'next';
import {
  type Work,
  type CatalogueApiError,
} from '@weco/common/model/catalogue';
import fetch from 'isomorphic-unfetch';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { itemLink, workLink } from '@weco/common/services/catalogue/routes';
import { getDigitalLocationOfType } from '@weco/common/utils/works';
import {
  getDownloadOptionsFromManifest,
  getVideo,
  getAudio,
  getServiceId,
  getUiExtensions,
  isUiEnabled,
  getAuthService,
} from '@weco/common/utils/iiif';
import { getWork, getCanvasOcr } from '../services/catalogue/works';
import CataloguePageLayout from '@weco/common/views/components/CataloguePageLayout/CataloguePageLayout';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import IIIFViewer, {
  IIIFViewerBackground,
} from '@weco/common/views/components/IIIFViewer/IIIFViewer';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import styled from 'styled-components';
import Space, {
  type SpaceComponentProps,
} from '@weco/common/views/components/styled/Space';
import Modal from '@weco/common/views/components/Modal/Modal';
// $FlowFixMe (tsx)
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import NextLink from 'next/link';
import { font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';

const IframeAuthMessage = styled.iframe`
  display: none;
`;

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

const iframeId = 'authMessage';
function reloadAuthIframe(document, id) {
  const authMessageIframe = ((document.getElementById(
    id
  ): any): HTMLIFrameElement);
  /* eslint-disable no-self-assign */
  authMessageIframe.src = authMessageIframe.src; // assigning the iframe src to itself reloads the iframe and refires the window.message event
}

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
  const [origin, setOrigin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
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

  const authService = getAuthService(manifest);
  const authServiceServices = authService?.authService?.service;
  const tokenService = authServiceServices
    ? authServiceServices.find(
        service => service.profile === 'http://iiif.io/api/auth/0/token'
      )
    : null;

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

  useEffect(() => {
    setOrigin(`${window.location.protocol}//${window.location.hostname}`);
  }, []);

  useEffect(() => {
    function receiveMessage(event) {
      const data = event.data;
      const serviceOrigin = tokenService && new URL(tokenService['@id']);
      if (
        serviceOrigin &&
        `${serviceOrigin.protocol}//${serviceOrigin.hostname}` === event.origin
      ) {
        if (data.hasOwnProperty('accessToken')) {
          setShowModal(false);
          setShowViewer(true);
        } else {
          setShowModal(true);
          setShowViewer(false);
        }
      }
    }

    if (authService) {
      window.addEventListener('message', receiveMessage);

      return () => window.removeEventListener('message', receiveMessage);
    } else {
      setShowModal(false);
      setShowViewer(true);
    }
  }, []);

  return (
    <CataloguePageLayout
      title={title}
      description={''}
      url={{ pathname: `/works/${workId}/items`, query: { sierraId } }}
      openGraphType={'website'}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection={'collections'}
      imageUrl={'imageContentUrl'}
      imageAltText={''}
      hideNewsletterPromo={true}
      hideFooter={true}
      hideInfoBar={true}
    >
      {tokenService && origin && (
        <IframeAuthMessage
          id={iframeId}
          src={`${tokenService['@id']}?messageId=1&origin=${origin}`}
        />
      )}
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
      {showModal && (
        <IIIFViewerBackground headerHeight={85}> </IIIFViewerBackground>
      )}
      <Modal
        id="auth-modal"
        isActive={showModal}
        setIsActive={setShowModal}
        removeCloseButton={true}
        openButtonRef={{ current: null }}
      >
        <div className={font('hnl', 5)}>
          <h2 className={font('hnm', 4)}>{authService?.authService?.label}</h2>
          <p
            dangerouslySetInnerHTML={{
              __html: authService?.authService?.description,
            }}
          />
          {authService?.authService?.['@id'] && origin && (
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <ButtonSolidLink
                text="Show the content"
                clickHandler={() => {
                  trackEvent({
                    category: 'ButtonSolidLink',
                    action: 'follow link "Show the content"',
                    label: `workId: ${workId}`,
                  });
                  const authServiceWindow = window.open(
                    `${authService?.authService['@id'] || ''}?origin=${origin}`
                  );
                  authServiceWindow.addEventListener('unload', function(event) {
                    reloadAuthIframe(document, iframeId);
                  });
                }}
              />
            </Space>
          )}
          <NextLink {...workLink({ id: workId })}>
            <a
              onClick={() => {
                trackEvent({
                  category: 'ButtonSolidLink',
                  action: 'follow link to work page',
                  label: `workId: ${workId}`,
                });
              }}
            >
              Take me back to the item page
            </a>
          </NextLink>
        </div>
      </Modal>
      {showViewer &&
        ((mainImageService && currentCanvas) || iiifImageLocation) && (
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
            handleImageError={() => {
              // If the image fails to load, we check to see if it's because the cookie is missing/no longer valid
              reloadAuthIframe(document, iframeId);
            }}
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
