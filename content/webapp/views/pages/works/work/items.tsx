import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import Button from '@weco/common/views/components/Buttons';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import Modal from '@weco/common/views/components/Modal';
import Space from '@weco/common/views/components/styled/Space';
import { SearchResults } from '@weco/content/services/iiif/types/search/v3';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import {
  CompressedTransformedManifest,
  fromCompressedManifest,
} from '@weco/content/types/compressed-manifest';
import { ParentManifest } from '@weco/content/types/item-viewer';
import { Auth } from '@weco/content/types/manifest';
import {
  checkModalRequired,
  getAuthServices,
  getIframeTokenSrc,
  hasItemType,
  hasOriginalPdf,
} from '@weco/content/utils/iiif/v3';
import { removeIdiomaticTextTags } from '@weco/content/utils/string';
import { fromQuery } from '@weco/content/views/components/ItemLink';
import WorkLink from '@weco/content/views/components/WorkLink';
import CataloguePageLayout from '@weco/content/views/layouts/CataloguePageLayout';
import IIIFItemList from '@weco/content/views/pages/works/work/IIIFItemList';

import IIIFViewer, { queryParamToArrayIndex } from './IIIFViewer';

const IframeAuthMessage = styled.iframe`
  display: none;
`;

const iframeId = 'authMessage';
function reloadAuthIframe(document: Document, id: string) {
  const authMessageIframe = document.getElementById(id) as HTMLIFrameElement;
  // assigning the iframe src to itself reloads the iframe and refires the window.message event
  // eslint-disable-next-line no-self-assign
  if (authMessageIframe) authMessageIframe.src = authMessageIframe.src;
}

function getIsTotallyRestricted({
  auth,
  authV2,
}: {
  auth: Auth | undefined;
  authV2: boolean | undefined;
}) {
  return authV2 ? auth?.v2.isTotallyRestricted : auth?.v1.isTotallyRestricted;
}

export type Props = {
  compressedTransformedManifest?: CompressedTransformedManifest;
  work: WorkBasic;
  canvas: number;
  canvasOcr?: string;
  iiifImageLocation?: DigitalLocation;
  iiifPresentationLocation?: DigitalLocation;
  serverSearchResults: SearchResults | null;
  parentManifest?: ParentManifest;
  apiToolbarLinks: ApiToolbarLink[];
};

const WorkItemPage: NextPage<Props> = ({
  compressedTransformedManifest,
  work,
  canvasOcr,
  iiifImageLocation,
  iiifPresentationLocation,
  apiToolbarLinks,
  canvas: serverCanvas,
  serverSearchResults,
  parentManifest,
}) => {
  const router = useRouter();
  const [routerCanvas, setRouterCanvas] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const parsed = fromQuery(router.query);
    setRouterCanvas(parsed.canvas);
  }, [router.asPath, router.query]);

  const canvas = routerCanvas || serverCanvas;

  const { userIsStaffWithRestricted } = useUserContext();
  const { authV2, extendedViewer } = useToggles();
  const transformedManifest =
    compressedTransformedManifest &&
    fromCompressedManifest(compressedTransformedManifest);

  const workId = work.id;
  const [origin, setOrigin] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  const [showViewer, setShowViewer] = useState(true);
  const { title, isAnyImageOpen, canvases, placeholderId, auth } = {
    ...transformedManifest,
  };

  const needsModal = checkModalRequired({
    userIsStaffWithRestricted,
    auth,
    isAnyImageOpen,
    authV2,
  });
  const [accessToken, setAccessToken] = useState();
  const [searchResults, setSearchResults] = useState(serverSearchResults);
  const authServices = getAuthServices({ auth, authV2 });
  const currentCanvas = canvases?.[queryParamToArrayIndex(canvas)];

  const displayTitle =
    title || (work && removeIdiomaticTextTags(work.title)) || '';
  const { imageServiceId = '' } = { ...currentCanvas };
  const mainImageService = imageServiceId && {
    '@id': imageServiceId,
  };

  const hasImage = hasItemType(canvases, 'Image');
  const hasPdf = hasOriginalPdf(canvases);
  const isTotallyRestricted = getIsTotallyRestricted({ auth, authV2 });
  const shouldUseAuthMessageIframe =
    ((authV2 && auth?.v2.tokenService) || (!authV2 && auth?.v1.tokenService)) &&
    origin;
  const tryAndGetRestrictedAuthCookie =
    userIsStaffWithRestricted &&
    authServices?.external?.id ===
      'https://iiif.wellcomecollection.org/auth/v2/access/restrictedlogin';
  // showViewer is true by default, so the noScriptViewer is available without javascript
  // if javascript is available we set it to false and then determine whether the clickthrough modal is required
  // before setting it to true
  useEffect(() => {
    setShowViewer(false);
  }, []);

  // We have iiif manifests that contain both active and external (restricted login) services
  // If this happens we want to show the active service (clickthrough) message and link rather than the external one.
  // This will enable most users to view the images with an active service (those with a restricted service won't display)
  // For staff with a role of 'StaffWithRestricted' they will be able to see both types of image.
  const modalContent = authServices?.active || authServices?.external;

  useEffect(() => {
    setOrigin(`${window.origin}`);
  }, []);

  useEffect(() => {
    if (tryAndGetRestrictedAuthCookie) {
      const authServiceWindow = window.open(
        `${authServices?.external?.id || ''}?origin=${window.origin}`
      );
      authServiceWindow &&
        authServiceWindow.addEventListener('unload', function () {
          reloadAuthIframe(document, iframeId);
        });
    }
  }, [tryAndGetRestrictedAuthCookie]);

  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      const data = event.data;
      const tokenService = getIframeTokenSrc({
        userIsStaffWithRestricted,
        workId: work.id,
        origin: window.origin,
        auth,
        authV2,
      });
      const service = (tokenService && new URL(tokenService)) as
        | URL
        | undefined;

      // We check this is the event we are interested in
      // N.B. locally react dev tools will create a lot of events
      if (service?.origin === event.origin) {
        if (Object.prototype.hasOwnProperty.call(data, 'accessToken')) {
          setAccessToken(data.accessToken);
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
  }, [needsModal]);

  return (
    <CataloguePageLayout
      title={displayTitle}
      description=""
      url={{ pathname: `/works/${workId}/items` }}
      openGraphType="website"
      jsonLd={{ '@type': 'WebPage' }}
      siteSection="collections"
      apiToolbarLinks={apiToolbarLinks}
      hideNewsletterPromo={true}
      hideFooter={true}
      hideTopContent={true}
    >
      {shouldUseAuthMessageIframe && (
        <IframeAuthMessage
          id={iframeId}
          title="Authentication"
          src={getIframeTokenSrc({
            userIsStaffWithRestricted,
            workId: work.id,
            origin,
            auth,
            authV2,
          })}
        />
      )}

      {/*
      Pdfs that have been added to the iiif manifest using the born digital pattern
      will have a hasImage value of true.
      However, we don't show the viewer for these items,
      so we check for the presence of a pdf in the original property of the canvas.
      If it has one we show the IIIFItemList, unless we are using the extended viewer.
      */}
      {(!hasImage || hasPdf) && showViewer && !extendedViewer && (
        <ContaineredLayout gridSizes={gridSize12()}>
          <Space
            className="body-text"
            $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
          >
            <IIIFItemList
              canvases={canvases}
              exclude={['Image']}
              placeholderId={placeholderId}
            />
          </Space>
        </ContaineredLayout>
      )}

      <Modal
        id="auth-modal"
        isActive={showModal}
        setIsActive={setShowModal}
        removeCloseButton={true}
        openButtonRef={{ current: null }}
      >
        <div className={font('intr', -1)}>
          {modalContent?.label && (
            // When this modal is displayed, the rest of the page is hidden and we need to make
            // sure there is an appropriate h1 available to assistive technologies
            // https://github.com/wellcomecollection/wellcomecollection.org/issues/7545
            <h1 className={font('intb', 0)}>{modalContent?.label}</h1>
          )}
          {modalContent?.description && (
            <div
              dangerouslySetInnerHTML={{
                __html: modalContent?.description,
              }}
            />
          )}
          {isAnyImageOpen && origin && (
            <Space
              style={{ display: 'inline-flex' }}
              $h={{ size: 'm', properties: ['margin-right'] }}
              $v={{ size: 'm', properties: ['margin-top'] }}
            >
              <Button
                variant="ButtonSolid"
                dataGtmProps={{ trigger: 'show_the_content' }}
                text="Show the content"
                clickHandler={() => {
                  const authServiceWindow = window.open(
                    `${modalContent?.id || ''}?origin=${origin}`
                  );
                  authServiceWindow &&
                    authServiceWindow.addEventListener('unload', function () {
                      reloadAuthIframe(document, iframeId);
                    });
                }}
              />
            </Space>
          )}
          <WorkLink id={workId}>Take me back to the item page</WorkLink>
        </div>
      </Modal>

      {showViewer &&
        ((mainImageService && currentCanvas) ||
          iiifImageLocation ||
          extendedViewer) && (
          <IIIFViewer
            work={work}
            transformedManifest={transformedManifest}
            canvasOcr={canvasOcr}
            iiifImageLocation={iiifImageLocation}
            iiifPresentationLocation={iiifPresentationLocation}
            handleImageError={() => {
              // If the image fails to load, we check to see if it's because the cookie is missing/no longer valid
              reloadAuthIframe(document, iframeId);
            }}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            parentManifest={parentManifest}
            accessToken={accessToken}
          />
        )}
    </CataloguePageLayout>
  );
};

export default WorkItemPage;
