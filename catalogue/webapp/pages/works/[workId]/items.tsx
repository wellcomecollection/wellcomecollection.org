import { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import {
  DigitalLocation,
  isDigitalLocation,
  Work,
} from '@weco/common/model/catalogue';
import { Audio, Video } from '@weco/catalogue/services/iiif/types/manifest/v3';
import { getDigitalLocationOfType } from '@weco/catalogue/utils/works';
import { removeIdiomaticTextTags } from '@weco/common/utils/string';
import { getWork } from '@weco/catalogue/services/catalogue/works';
import CataloguePageLayout from '@weco/catalogue/components/CataloguePageLayout/CataloguePageLayout';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import IIIFViewer from '@weco/catalogue/components/IIIFViewer/IIIFViewer';
import VideoPlayer from '@weco/catalogue/components/VideoPlayer/VideoPlayer';
import BetaMessage from '@weco/common/views/components/BetaMessage/BetaMessage';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import Modal from '@weco/common/views/components/Modal/Modal';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { font } from '@weco/common/utils/classnames';
import { trackGaEvent } from '@weco/common/utils/ga';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { Pageview } from '@weco/common/services/conversion/track';
import {
  toLink as itemLink,
  fromQuery,
} from '@weco/common/views/components/ItemLink/ItemLink';
import WorkLink from '@weco/common/views/components/WorkLink/WorkLink';
import { getServerData } from '@weco/common/server-data';
import AudioList from '@weco/catalogue/components/AudioList/AudioList';
import { isNotUndefined } from '@weco/common/utils/array';
import { unavailableImageMessage } from '@weco/common/data/microcopy';
import { looksLikeCanonicalId } from 'services/catalogue';
import { fetchIIIFPresentationManifest } from '@weco/catalogue/services/iiif/fetch/manifest';
import { transformManifest } from '@weco/catalogue/services/iiif/transformers/manifest';
import { fetchCanvasOcr } from '@weco/catalogue/services/iiif/fetch/canvasOcr';
import { transformCanvasOcr } from '@weco/catalogue/services/iiif/transformers/canvasOcr';
import {
  TransformedCanvas,
  TransformedManifest,
  createDefaultTransformedManifest,
} from '@weco/catalogue/types/manifest';
import WorkHeader from '@weco/catalogue/components/WorkHeader/WorkHeader';
import WorkTabbedNav from '@weco/catalogue/components/WorkTabbedNav/WorkTabbedNav';
import { Container, Grid } from '@weco/catalogue/components/Work/Work';
import { useToggles } from '@weco/common/server-data/Context';
import {
  ApiToolbarLink,
  setTzitzitParams,
} from '@weco/common/views/components/ApiToolbar';

const IframeAuthMessage = styled.iframe`
  display: none;
`;

const IframePdfViewer = styled(Space)`
  width: 90vw;
  height: 90vh;
  display: block;
  border: 0;
  margin-top: 98px;
  margin-left: auto;
  margin-right: auto;
`;

const iframeId = 'authMessage';
function reloadAuthIframe(document, id: string) {
  const authMessageIframe: HTMLIFrameElement = document.getElementById(id);
  // assigning the iframe src to itself reloads the iframe and refires the window.message event
  // eslint-disable-next-line no-self-assign
  if (authMessageIframe) authMessageIframe.src = authMessageIframe.src;
}

function createTzitzitWorkLink(work: Work): ApiToolbarLink | undefined {
  // Look at digital item locations only
  const digitalLocation: DigitalLocation | undefined = work.items
    ?.map(item => item.locations.find(isDigitalLocation))
    .find(i => i);

  return setTzitzitParams({
    title: work.title,
    sourceLink: `/works/${work.id}/items`,
    licence: digitalLocation?.license,
    contributors: work.contributors,
  });
}

type Props = {
  transformedManifest: TransformedManifest;
  manifestIndex?: number;
  work: Work;
  pageSize: number;
  pageIndex: number;
  canvasIndex: number;
  canvasOcr?: string;
  currentCanvas?: TransformedCanvas;
  video?: Video; // TODO - remove as this is on manifestData
  audio?: Audio; // TODO - remove as this is on manifestData
  iiifImageLocation?: DigitalLocation;
  pageview: Pageview;
};

const ItemPage: NextPage<Props> = ({
  transformedManifest,
  manifestIndex,
  work,
  pageSize,
  pageIndex,
  canvasIndex,
  canvasOcr,
  currentCanvas,
  iiifImageLocation,
}) => {
  const workId = work.id;
  const [origin, setOrigin] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const { worksTabbedNav } = useToggles();
  const {
    title,
    downloadEnabled,
    video,
    canvases,
    needsModal,
    pdf,
    isAnyImageOpen,
    audio,
    clickThroughService,
    tokenService,
    restrictedService,
    isTotallyRestricted,
  } = transformedManifest;

  const authService = clickThroughService || restrictedService;

  const displayTitle =
    title || (work && removeIdiomaticTextTags(work.title)) || '';
  const { imageServiceId = '' } = { ...currentCanvas };
  const mainImageService = imageServiceId && {
    '@id': imageServiceId,
  };
  const sharedPaginatorProps = {
    totalResults: canvases?.length || 1,
    link: itemLink(
      {
        workId,
        page: pageIndex + 1,
        canvas: canvasIndex + 1,
        manifest: manifestIndex ? manifestIndex + 1 : undefined,
      },
      'viewer/paginator'
    ),
  };
  const mainPaginatorProps = {
    currentPage: canvasIndex + 1,
    pageSize: 1,
    linkKey: 'canvas',
    ...sharedPaginatorProps,
  };
  const thumbsPaginatorProps = {
    currentPage: pageIndex + 1,
    pageSize,
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
          setShowModal(Boolean(isTotallyRestricted));
          setShowViewer(!isTotallyRestricted);
        } else {
          setShowModal(true);
          setShowViewer(false);
        }
      }
    }

    if (needsModal) {
      window.addEventListener('message', receiveMessage);

      return () => window.removeEventListener('message', receiveMessage);
    } else {
      setShowModal(false);
      setShowViewer(true);
    }
  }, []);

  // We only send a langCode if it's unambiguous -- better to send no language
  // than the wrong one.
  const lang = (work.languages.length === 1 && work?.languages[0]?.id) || '';

  return (
    <CataloguePageLayout
      title={displayTitle}
      description=""
      url={{ pathname: `/works/${workId}/items` }}
      openGraphType="website"
      jsonLd={{ '@type': 'WebPage' }}
      siteSection="collections"
      apiToolbarLinks={[createTzitzitWorkLink(work)]}
      hideNewsletterPromo={true}
      hideFooter={true}
      hideTopContent={true}
    >
      {tokenService && origin && (
        <IframeAuthMessage
          id={iframeId}
          src={`${tokenService['@id']}?messageId=1&origin=${origin}`}
        />
      )}

      {worksTabbedNav && (
        <Space v={{ size: 'l', properties: ['margin-top'] }}>
          <Container>
            <Grid>
              <WorkHeader work={work} />
            </Grid>
            <WorkTabbedNav work={work} selected="imageViewer" />
          </Container>
        </Space>
      )}

      {isNotUndefined(audio) && audio?.sounds?.length > 0 && (
        <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
          <Layout12>
            <AudioList
              items={audio.sounds || []}
              thumbnail={audio.thumbnail}
              transcript={audio.transcript}
              workTitle={work.title}
            />
          </Layout12>
        </Space>
      )}
      {video && (
        <Layout12>
          <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
            <VideoPlayer
              video={video}
              showDownloadOptions={downloadEnabled || true}
            />
          </Space>
        </Layout12>
      )}
      {/* TODO remove this or update unavailable message to something more appropriate */}
      {!(isNotUndefined(audio) && audio?.sounds.length > 0) &&
        !video &&
        !pdf &&
        !mainImageService &&
        !iiifImageLocation && (
          <Layout12>
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <div style={{ marginTop: '98px' }}>
                <BetaMessage message={unavailableImageMessage} />
              </div>
            </Space>
          </Layout12>
        )}
      {pdf && !mainImageService && (
        <IframePdfViewer
          v={{
            size: 'l',
            properties: ['margin-bottom'],
          }}
          as="iframe"
          title={`PDF: ${displayTitle}`}
          src={pdf.id}
        />
      )}
      <Modal
        id="auth-modal"
        isActive={showModal}
        setIsActive={setShowModal}
        removeCloseButton={true}
        openButtonRef={{ current: null }}
      >
        <div className={font('intr', 5)}>
          {authService?.label && (
            <h2 className={font('intb', 4)}>{authService?.label}</h2>
          )}
          {authService?.description && (
            <div
              dangerouslySetInnerHTML={{
                __html: authService?.description,
              }}
            />
          )}
          {isAnyImageOpen && origin && (
            <Space
              className="flex flex-inline"
              h={{ size: 'm', properties: ['margin-right'] }}
              v={{ size: 'm', properties: ['margin-top'] }}
            >
              <ButtonSolid
                text="Show the content"
                clickHandler={() => {
                  trackGaEvent({
                    category: 'ButtonSolidLink',
                    action: 'follow link "Show the content"',
                    label: `workId: ${workId}`,
                  });
                  const authServiceWindow = window.open(
                    `${authService?.['@id'] || ''}?origin=${origin}`
                  );
                  authServiceWindow &&
                    authServiceWindow.addEventListener('unload', function () {
                      reloadAuthIframe(document, iframeId);
                    });
                }}
              />
            </Space>
          )}
          <WorkLink id={workId} source="item_auth_modal_back_to_work_link">
            <a
              onClick={() => {
                trackGaEvent({
                  category: 'ButtonSolidLink',
                  action: 'follow link to work page',
                  label: `workId: ${workId}`,
                });
              }}
            >
              Take me back to the item page
            </a>
          </WorkLink>
        </div>
      </Modal>
      {showViewer &&
        ((mainImageService && currentCanvas) || iiifImageLocation) && (
          <IIIFViewer
            title={displayTitle}
            mainPaginatorProps={mainPaginatorProps}
            thumbsPaginatorProps={thumbsPaginatorProps}
            currentCanvas={currentCanvas}
            lang={lang}
            canvasOcr={canvasOcr}
            workId={workId}
            pageIndex={pageIndex}
            pageSize={pageSize}
            canvasIndex={canvasIndex}
            manifestIndex={manifestIndex}
            iiifImageLocation={iiifImageLocation}
            work={work}
            transformedManifest={transformedManifest}
            handleImageError={() => {
              // If the image fails to load, we check to see if it's because the cookie is missing/no longer valid
              reloadAuthIframe(document, iframeId);
            }}
          />
        )}
    </CataloguePageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const {
      workId,
      page = 1,
      pageSize = 4,
      canvas = 1,
      manifest: manifestParam = 1,
    } = fromQuery(context.query);

    if (!looksLikeCanonicalId(workId)) {
      return { notFound: true };
    }

    const pageview = {
      name: 'item',
      properties: {},
    };

    const pageIndex = page - 1;
    // Canvas and manifest params should be 0 indexed as they reference elements in an array
    // We've chosen not to do this for some reason lost to time, but felt it better to stick
    // to the same buggy implementation than have 2 implementations

    // I imagine a fix for this could be having new parameters `m&c`
    // and then redirecting to those once we have em fixed.
    const canvasIndex = canvas - 1;
    const manifestIndex = manifestParam - 1;

    const work = await getWork({
      id: workId,
      toggles: serverData.toggles,
    });

    if (work.type === 'Error') {
      return appError(context, work.httpStatus, work.description);
    }

    if (work.type === 'Redirect') {
      // This ensures that any query parameters are preserved on redirect,
      // e.g. if you have a link to /works/$oldId/items?canvas=10, then
      // you'll go to /works/$newId/items?canvas=10
      const destination = isNotUndefined(context.req.url)
        ? context.req.url.replace(workId, work.redirectToId)
        : `/works/${work.redirectToId}/items`;

      return {
        redirect: {
          destination,
          permanent: work.status === 301,
        },
      };
    }

    const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
    const iiifPresentationLocation = getDigitalLocationOfType(
      work,
      'iiif-presentation'
    );
    const iiifManifest =
      iiifPresentationLocation &&
      (await fetchIIIFPresentationManifest(iiifPresentationLocation.url));

    const transformedManifest = iiifManifest && transformManifest(iiifManifest);

    const { isCollectionManifest, manifests } = { ...transformedManifest };
    // If the manifest is actually a Collection, .i.e. a manifest of manifests,
    // then we get the first child manifest and use the data from that
    // see: https://iiif.wellcomecollection.org/presentation/v2/b21293302
    // from: https://wellcomecollection.org/works/f6qp7m32/items
    async function getDisplayManifest(
      transformedManifest: TransformedManifest,
      manifestIndex: number
    ): Promise<TransformedManifest> {
      if (isCollectionManifest) {
        const selectedCollectionManifestLocation =
          manifests?.[manifestIndex]?.id;
        const selectedCollectionManifest = selectedCollectionManifestLocation
          ? await fetchIIIFPresentationManifest(
              selectedCollectionManifestLocation
            )
          : undefined;
        const firstChildTransformedManifest =
          selectedCollectionManifest &&
          transformManifest(selectedCollectionManifest);
        return firstChildTransformedManifest || transformedManifest;
      } else {
        return transformedManifest;
      }
    }

    if (transformedManifest) {
      const displayManifest = await getDisplayManifest(
        transformedManifest,
        manifestIndex
      );
      const { canvases } = displayManifest;
      const currentCanvas = canvases[canvasIndex];
      const canvasOcrText = await fetchCanvasOcr(currentCanvas);
      const canvasOcr = transformCanvasOcr(canvasOcrText);

      return {
        props: removeUndefinedProps({
          transformedManifest: displayManifest,
          manifestIndex,
          pageSize,
          pageIndex,
          canvasIndex,
          canvasOcr,
          work,
          currentCanvas,
          iiifImageLocation,
          pageview,
          serverData,
        }),
      };
    }

    if (iiifImageLocation) {
      return {
        props: removeUndefinedProps({
          transformedManifest: createDefaultTransformedManifest(),
          pageSize,
          pageIndex,
          canvasIndex,
          work,
          canvases: [],
          iiifImageLocation,
          pageview,
          serverData,
        }),
      };
    }

    return {
      notFound: true,
    };
  };

export default ItemPage;
