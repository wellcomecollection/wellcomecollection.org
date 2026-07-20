import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { typography } from '@weco/common/utils/classnames';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';
import Button from '@weco/common/views/components/Buttons';
import Modal from '@weco/common/views/components/Modal';
import Space from '@weco/common/views/components/styled/Space';
import { SearchResults } from '@weco/content/services/iiif/types/search/v3';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import {
  CompressedTransformedManifest,
  fromCompressedManifest,
} from '@weco/content/types/compressed-manifest';
import { ParentManifest } from '@weco/content/types/item-viewer';
import {
  checkModalRequired,
  getAuthServices,
  getIframeTokenSrc,
} from '@weco/content/utils/iiif/v3';
import { removeIdiomaticTextTags } from '@weco/content/utils/string';
import WorkLink from '@weco/content/views/components/WorkLink';
import CataloguePageLayout from '@weco/content/views/layouts/CataloguePageLayout';
import { UiTree } from '@weco/content/views/pages/works/work/work.types';

import IIIFViewer from './IIIFViewer';

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

export type Props = {
  compressedTransformedManifest?: CompressedTransformedManifest;
  work: WorkBasic;
  canvasOcr?: string;
  iiifImageLocation?: DigitalLocation;
  iiifPresentationLocation?: DigitalLocation;
  serverSearchResults: SearchResults | null;
  parentManifest?: ParentManifest;
  apiToolbarLinks: ApiToolbarLink[];
  tree?: UiTree;
};

const WorkItemPage: NextPage<Props> = ({
  compressedTransformedManifest,
  work,
  canvasOcr,
  iiifImageLocation,
  iiifPresentationLocation,
  apiToolbarLinks,
  serverSearchResults,
  parentManifest,
  tree,
}) => {
  const { userIsStaffWithRestricted } = useUserContext();
  const transformedManifest =
    compressedTransformedManifest &&
    fromCompressedManifest(compressedTransformedManifest);

  const workId = work.id;
  const [origin, setOrigin] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  const [showViewer, setShowViewer] = useState(true);
  const { title, auth } = {
    ...transformedManifest,
  };

  const needsModal = checkModalRequired({
    userIsStaffWithRestricted,
    auth,
  });
  const [accessToken, setAccessToken] = useState();
  const clickThroughTimerRef = useRef<
    ReturnType<typeof setInterval> | undefined
  >(undefined);
  useEffect(() => () => clearInterval(clickThroughTimerRef.current), []);
  const [searchResults, setSearchResults] = useState(serverSearchResults);
  const authServices = getAuthServices({ auth });
  const displayTitle =
    title || (work && removeIdiomaticTextTags(work.title)) || '';
  const isTotallyRestricted =
    auth?.accessRequirements &&
    auth.accessRequirements.length > 0 &&
    auth.accessRequirements.every(
      requirement => requirement === 'Restricted files'
    );
  const shouldUseAuthMessageIframe = auth?.tokenService && origin;
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

  // IMPORTANT FOR DEVELOPMENT: This popup may be blocked by browser popup blockers.
  // When testing restricted items, ensure popups are allowed for the site.
  // See docs/restricted-access-authentication-flow.md for details.
  useEffect(() => {
    if (userIsStaffWithRestricted && authServices?.external && origin) {
      const authServiceWindow = window.open(
        `${authServices?.external?.id || ''}?origin=${window.origin}`
      );
      if (authServiceWindow) {
        const timer = setInterval(() => {
          if (authServiceWindow.closed) {
            clearInterval(timer);
            reloadAuthIframe(document, iframeId);
          }
        }, 500);
        return () => clearInterval(timer);
      }
    }
  }, [userIsStaffWithRestricted, authServices?.external?.id, origin]);

  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      const data = event.data;
      const tokenService = getIframeTokenSrc({
        workId: work.id,
        origin: window.origin,
        auth,
      });
      const service = (tokenService && new URL(tokenService)) as
        URL | undefined;

      // We check this is the event we are interested in
      // N.B. locally react dev tools will create a lot of events
      if (service?.origin === event.origin) {
        if (Object.prototype.hasOwnProperty.call(data, 'accessToken')) {
          setAccessToken(data.accessToken);
          if (needsModal) {
            setShowModal(!!isTotallyRestricted);
            setShowViewer(!isTotallyRestricted);
          }
        } else if (needsModal) {
          setShowModal(true);
          setShowViewer(false);
        }
      }
    }
    window.addEventListener('message', receiveMessage);
    if (!needsModal) {
      setShowModal(false);
      setShowViewer(true);
    }
    return () => window.removeEventListener('message', receiveMessage);
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
            workId: work.id,
            origin,
            auth,
          })}
        />
      )}

      <Modal
        id="auth-modal"
        isActive={showModal}
        setIsActive={setShowModal}
        removeCloseButton={true}
        openButtonRef={{ current: null }}
      >
        <div className={typography('body', 'md', 'regular')}>
          {modalContent?.label && (
            // When this modal is displayed, the rest of the page is hidden and we need to make
            // sure there is an appropriate h1 available to assistive technologies
            // https://github.com/wellcomecollection/wellcomecollection.org/issues/7545
            <h1 className={typography('body', 'lg', 'strong')}>
              {modalContent?.label}
            </h1>
          )}
          {modalContent?.description && (
            <div
              dangerouslySetInnerHTML={{
                __html: modalContent?.description,
              }}
            />
          )}
          {auth?.accessRequirements.includes('Open with advisory') &&
            origin && (
              <Space
                style={{ display: 'inline-flex' }}
                $h={{ size: 'sm', properties: ['margin-right'] }}
                $v={{ size: 'sm', properties: ['margin-top'] }}
              >
                <Button
                  variant="ButtonSolid"
                  dataGtmProps={{ trigger: 'show_the_content' }}
                  text="Show the content"
                  clickHandler={() => {
                    const authServiceWindow = window.open(
                      `${modalContent?.id || ''}?origin=${origin}`
                    );
                    if (authServiceWindow) {
                      clickThroughTimerRef.current = setInterval(() => {
                        if (authServiceWindow.closed) {
                          clearInterval(clickThroughTimerRef.current);
                          clickThroughTimerRef.current = undefined;
                          reloadAuthIframe(document, iframeId);
                        }
                      }, 500);
                    }
                  }}
                />
              </Space>
            )}
          <WorkLink id={workId}>Take me back to the item page</WorkLink>
        </div>
      </Modal>

      {showViewer && (
        <IIIFViewer
          work={work}
          transformedManifest={transformedManifest}
          canvasOcr={canvasOcr}
          iiifImageLocation={iiifImageLocation}
          iiifPresentationLocation={iiifPresentationLocation}
          initialTree={tree}
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
