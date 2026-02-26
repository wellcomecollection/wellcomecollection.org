import { ContentResource, InternationalString } from '@iiif/presentation-3';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { bornDigitalMessage } from '@weco/common/data/microcopy';
import { eye, info2 } from '@weco/common/icons';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { LinkProps } from '@weco/common/model/link-props';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import DownloadLink from '@weco/common/views/components/DownloadLink';
import Icon from '@weco/common/views/components/Icon';
import Layout, {
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { Note, Work } from '@weco/content/services/wellcome/catalogue/types';
import {
  DownloadOption,
  ItemsStatus,
  TransformedCanvas,
  TransformedManifest,
} from '@weco/content/types/manifest';
import {
  AuthServices,
  getAuthServices,
  getFileTypeLabel,
  getFormatString,
  getIframeTokenSrc,
  getLabelString,
  hasItemType,
  isPDFCanvas,
} from '@weco/content/utils/iiif/v3';
import { DigitalLocationInfo } from '@weco/content/utils/works';
import Download from '@weco/content/views/components/Download';
import NestedList from '@weco/content/views/pages/works/work/ArchiveTree/ArchiveTree.NestedList';
import IIIFItemList from '@weco/content/views/pages/works/work/IIIFItemList';
import DownloadItemRenderer from '@weco/content/views/pages/works/work/work.DownloadItemRenderer';
import { createDownloadTree } from '@weco/content/views/pages/works/work/work.helpers';
import { UiTree } from '@weco/content/views/pages/works/work/work.types';

import IIIFClickthrough from './WorkDetails.IIIFClickthrough';
import WorkDetailsLicence from './WorkDetails.Licence';
import WorkDetailsSection from './WorkDetails.Section';
import WorksTree from './WorkDetails.Tree';

const RestrictedMessage = styled(Space).attrs({
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
  className: font('sans', -1),
})`
  position: relative;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.color('black')};
  background-color: ${props => props.theme.color('white')};

  &::after {
    position: absolute;
    content: '';
    bottom: -4px;
    left: -1px;
    height: 8px;
    width: calc(100% + 2px);
    border-radius: 3px;
    background-color: ${props => props.theme.color('black')};
    z-index: -1;
  }
`;

const RestrictedMessageTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  h3 {
    padding-left: 8px;
    margin-bottom: 0;
  }
`;

const MessageBox = styled(Space).attrs({
  className: font('sans', -1),
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};

  h2 {
    margin: 0;
  }

  p:last-child {
    margin: 0;
  }
`;

type Props = {
  work: Work;
  itemUrl: LinkProps;
  downloadOptions: DownloadOption[];
  shouldShowItemLink: boolean;
  digitalLocation?: DigitalLocation;
  digitalLocationInfo?: DigitalLocationInfo;
  locationOfWork?: Note;
  transformedManifest?: TransformedManifest;
};

type ItemPageLinkProps = {
  work: Work;
  itemUrl: LinkProps;
  downloadOptions: DownloadOption[];
  collectionManifestsCount?: number;
  canvasCount?: number;
  canvases?: TransformedCanvas[];
  digitalLocationInfo?: DigitalLocationInfo;
  authServices?: AuthServices;
  itemsStatus?: ItemsStatus;
};
const ItemPageLink = ({
  work,
  itemUrl,
  downloadOptions,
  collectionManifestsCount,
  canvasCount,
  canvases,
  digitalLocationInfo,
  authServices,
  itemsStatus,
}: ItemPageLinkProps) => {
  const { userIsStaffWithRestricted } = useUserContext();
  const { extendedViewer } = useToggles();

  // TODO can remove when we move over to extendedViewer permanently
  const isDownloadable =
    digitalLocationInfo?.accessCondition !== 'open-with-advisory' &&
    downloadOptions.length > 0;

  const isWorkVisibleWithPermission =
    digitalLocationInfo?.accessCondition === 'restricted' &&
    userIsStaffWithRestricted;

  const manifestNeedsRegeneration =
    authServices?.external?.id ===
    'https://iiif.wellcomecollection.org/auth/restrictedlogin';

  const hasNonStandardItems =
    itemsStatus !== undefined && itemsStatus !== 'allStandard';
  return (
    <>
      {work.thumbnail && (
        <Space $v={{ size: 'xs', properties: ['margin-bottom'] }}>
          <ConditionalWrapper
            condition={Boolean(itemUrl)}
            wrapper={children =>
              itemUrl && (
                <NextLink
                  href={itemUrl.href}
                  style={{ display: 'inline-block' }}
                >
                  {children}
                </NextLink>
              )
            }
          >
            <img
              style={{ width: 'auto', height: 'auto', display: 'block' }}
              alt={`view ${work.title}`}
              src={work.thumbnail.url}
            />
          </ConditionalWrapper>
        </Space>
      )}
      <ConditionalWrapper
        condition={isWorkVisibleWithPermission}
        wrapper={children => (
          <Layout gridSizes={extendedViewer ? gridSize12() : gridSize8(false)}>
            <RestrictedMessage>
              <RestrictedMessageTitle>
                <Icon icon={info2} />
                <h3 className={font('sans-bold', 0)}>Restricted item</h3>
              </RestrictedMessageTitle>

              <p style={{ marginBottom: '1rem' }}>
                Only staff with the right permissions can view this item online.
              </p>

              {manifestNeedsRegeneration && (
                <p style={{ marginBottom: '1rem' }}>
                  The manifest for this work needs to be regenerated in order
                  for staff with restricted access to be able to view it.
                </p>
              )}
              {children}
            </RestrictedMessage>
          </Layout>
        )}
      >
        {((collectionManifestsCount && collectionManifestsCount > 0) ||
          (canvasCount && canvasCount > 0)) && (
          <ConditionalWrapper
            condition={isWorkVisibleWithPermission}
            wrapper={children => (
              <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
                {children}
              </Space>
            )}
          >
            <p className={font('mono', -2)} style={{ marginBottom: 0 }}>
              Contains:{' '}
              {(collectionManifestsCount && collectionManifestsCount > 0) ||
              canvasCount
                ? getFileTypeLabel(
                    collectionManifestsCount,
                    canvasCount || 0,
                    hasNonStandardItems,
                    canvases
                  )
                : null}
            </p>
          </ConditionalWrapper>
        )}

        {(itemUrl || (isDownloadable && !extendedViewer)) && (
          <Space
            $v={{ size: 'xs', properties: ['margin-top'] }}
            style={{ display: 'flex' }}
          >
            {itemUrl && (
              <Space
                as="span"
                $h={{ size: 'sm', properties: ['margin-right'] }}
              >
                <Button
                  variant="ButtonSolidLink"
                  icon={eye}
                  text="View"
                  link={itemUrl}
                />
              </Space>
            )}
            {isDownloadable && !extendedViewer && (
              <Download
                ariaControlsId="itemDownloads"
                downloadOptions={downloadOptions}
              />
            )}
          </Space>
        )}
      </ConditionalWrapper>
    </>
  );
};

const WorkDetailsAvailableOnline = ({
  work,
  downloadOptions,
  itemUrl,
  shouldShowItemLink,
  digitalLocationInfo,
  digitalLocation,
  locationOfWork,
  transformedManifest,
}: Props) => {
  const [origin, setOrigin] = useState<string | undefined>();

  const {
    collectionManifestsCount,
    canvasCount,
    auth,
    structures,
    itemsStatus,
    canvases,
    placeholderId,
    rendering,
  } = { ...transformedManifest };

  const { extendedViewer } = useToggles();

  const tokenService = getIframeTokenSrc({
    workId: work.id,
    origin,
    auth,
  });

  const authServices = getAuthServices({ auth });

  const hasNonStandardItems = itemsStatus !== 'allStandard';

  const [tabbableId, setTabbableId] = useState<string>();
  const [archiveTree, setArchiveTree] = useState<UiTree>([]);
  const allOriginalPdfs =
    canvases?.every(canvas => isPDFCanvas(canvas)) || false;
  const clickThroughService = authServices?.active;

  // Check for audio/video content
  const hasVideo = hasItemType(canvases, 'Video');
  const hasAudio =
    hasItemType(canvases, 'Sound') || hasItemType(canvases, 'Audio');

  // We temporarily want to show the download tree for multiple PDFs
  // See: https://github.com/wellcomecollection/wellcomecollection.org/issues/12089
  const shouldShowDownloadTree =
    hasNonStandardItems &&
    (!allOriginalPdfs || (allOriginalPdfs && Number(canvases?.length) > 1));

  useEffect(() => {
    const downloads = createDownloadTree(structures, canvases);
    setArchiveTree(downloads);
  }, [structures]);

  useEffect(() => {
    const elementToFocus = tabbableId && document.getElementById(tabbableId);
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }, [archiveTree, tabbableId]);

  useEffect(() => {
    setOrigin(window.origin);
  }, []);

  return (
    <WorkDetailsSection
      headingText={`Available ${hasNonStandardItems ? 'to download' : 'online'}`}
    >
      <ConditionalWrapper
        condition={Boolean(
          tokenService && clickThroughService && !shouldShowItemLink
        )}
        wrapper={children => (
          <IIIFClickthrough
            clickThroughService={clickThroughService}
            tokenService={tokenService || ''}
            origin={origin}
          >
            {children}
          </IIIFClickthrough>
        )}
      >
        {shouldShowDownloadTree && (
          <>
            {Number(canvases?.length) > 0 && (
              <p className={font('mono', -2)}>
                Contains {canvases?.length} files
              </p>
            )}
            <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
              <MessageBox>{bornDigitalMessage}</MessageBox>
            </Space>
            <div style={{ overflow: 'visible' }}>
              <div style={{ display: 'inline-table', minWidth: '100%' }}>
                <WorksTree>
                  <NestedList
                    currentWorkId={work.id}
                    fullTree={archiveTree}
                    setArchiveTree={setArchiveTree}
                    archiveTree={archiveTree}
                    level={1}
                    tabbableId={tabbableId}
                    setTabbableId={setTabbableId}
                    archiveAncestorArray={[]}
                    firstItemTabbable={true}
                    showFirstLevelGuideline={true}
                    ItemRenderer={DownloadItemRenderer}
                    shouldFetchChildren={false}
                  />
                </WorksTree>
              </div>
            </div>
          </>
        )}

        {/*
          We temporarily want to prevent showing the link for multiple pdfs
          See: https://github.com/wellcomecollection/wellcomecollection.org/issues/12089
        */}
        {(!hasNonStandardItems ||
          (allOriginalPdfs && canvases?.length === 1)) && (
          <>
            {(hasVideo || hasAudio) &&
              !extendedViewer && ( // TODO extendedViewer: we can remove this whole block once we are happy to use the item page for audio/video content, as we will always show the item page link for these types of content once the toggle is removed.
                <>
                  <IIIFItemList
                    canvases={canvases}
                    exclude={['Image', 'Text']}
                    placeholderId={placeholderId}
                    itemUrl={itemUrl}
                  />
                  {rendering?.map(r => {
                    const rendering = r as ContentResource & {
                      format?: string;
                    };
                    if (rendering.id && 'label' in rendering) {
                      const labelString = getLabelString(
                        rendering.label as InternationalString
                      );
                      const label = labelString
                        ?.toLowerCase()
                        .includes('transcript')
                        ? `Transcript of ${work.title}`
                        : labelString;

                      return (
                        <Space
                          key={rendering.id}
                          $v={{ size: 'xs', properties: ['margin-top'] }}
                        >
                          <DownloadLink
                            href={rendering.id}
                            linkText={label || 'Download'}
                            format={getFormatString(rendering.format)}
                            mimeType={rendering.format || ''}
                          />
                        </Space>
                      );
                    } else {
                      return null;
                    }
                  })}
                </>
              )}

            {shouldShowItemLink && (
              <ItemPageLink
                work={work}
                itemUrl={itemUrl}
                canvases={canvases}
                collectionManifestsCount={collectionManifestsCount}
                canvasCount={canvasCount}
                downloadOptions={downloadOptions}
                digitalLocationInfo={digitalLocationInfo}
                authServices={authServices}
              />
            )}
          </>
        )}
      </ConditionalWrapper>

      {digitalLocationInfo?.license && (
        <WorkDetailsLicence
          digitalLocationLicense={digitalLocationInfo.license}
          accessConditionsTerms={digitalLocation?.accessConditions[0]?.terms}
          credit={digitalLocation?.credit}
          locationOfWork={locationOfWork}
          workId={work.id}
          workTitle={work.title}
        />
      )}
    </WorkDetailsSection>
  );
};

export default WorkDetailsAvailableOnline;
