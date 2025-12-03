import { ContentResource, InternationalString } from '@iiif/presentation-3';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useUserContext } from '@weco/common/contexts/UserContext';
import {
  bornDigitalMessage,
  treeInstructions,
} from '@weco/common/data/microcopy';
import { eye, info2 } from '@weco/common/icons';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { LinkProps } from '@weco/common/model/link-props';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { pluralize } from '@weco/common/utils/grammar';
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
  TransformedCanvas,
  TransformedManifest,
} from '@weco/content/types/manifest';
import {
  AuthServices,
  getAuthServices,
  getCanvasPaintingItem,
  getFormatString,
  getIframeTokenSrc,
  getLabelString,
  isAllOriginalPdfs,
  isAudioCanvas,
} from '@weco/content/utils/iiif/v3';
import { DigitalLocationInfo } from '@weco/content/utils/works';
import Download from '@weco/content/views/components/Download';
import NestedList from '@weco/content/views/pages/works/work/ArchiveTree/ArchiveTree.NestedList';
import IIIFItemList from '@weco/content/views/pages/works/work/IIIFItemList';
import DownloadItemRenderer from '@weco/content/views/pages/works/work/work.DownloadItemRenderer';
import {
  controlDimensions,
  createDownloadTree,
} from '@weco/content/views/pages/works/work/work.helpers';
import {
  Tree,
  TreeInstructions,
} from '@weco/content/views/pages/works/work/work.styles';
import { UiTree } from '@weco/content/views/pages/works/work/work.types';

import { DownloadTable } from './WorkDetails.DownloadItem';
import IIIFClickthrough from './WorkDetails.IIIFClickthrough';
import WorkDetailsLicence from './WorkDetails.Licence';
import WorkDetailsSection from './WorkDetails.Section';

const RestrictedMessage = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  className: font('intr', -1),
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

const TreeHeadings = styled(Space).attrs({
  $v: { size: 'xl', properties: ['margin-top'] },
})`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

const TreeContainer = styled.div`
  background: linear-gradient(
    to bottom,
    ${props => props.theme.color('warmNeutral.200')},
    ${props => props.theme.color('warmNeutral.200')} 50%,
    ${props => props.theme.color('white')} 50%,
    ${props => props.theme.color('white')}
  );
  background-size: 100% ${controlDimensions.controlHeight * 2}px;
`;

const MessageBox = styled(Space).attrs({
  className: font('intr', -1),
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
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
}: ItemPageLinkProps) => {
  const { userIsStaffWithRestricted } = useUserContext();
  const { extendedViewer } = useToggles();

  const isDownloadable =
    digitalLocationInfo?.accessCondition !== 'open-with-advisory' &&
    downloadOptions.length > 0;

  const isWorkVisibleWithPermission =
    digitalLocationInfo?.accessCondition === 'restricted' &&
    userIsStaffWithRestricted;

  const manifestNeedsRegeneration =
    authServices?.external?.id ===
    'https://iiif.wellcomecollection.org/auth/restrictedlogin';

  // Make sure paintings are all video or audio
  const isAllAudioOrVideo = !(
    canvases?.find(canvas => !isAudioCanvas(getCanvasPaintingItem(canvas))) &&
    canvases?.find(canvas => getCanvasPaintingItem(canvas)?.type !== 'Video')
  );

  return (
    <>
      {work.thumbnail && (
        <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
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

      {isAllAudioOrVideo && extendedViewer ? (
        <IIIFItemList
          canvases={canvases}
          exclude={['Image', 'Text']}
          placeholderId="placeholderId"
          itemUrl={itemUrl}
        />
      ) : (
        <ConditionalWrapper
          condition={isWorkVisibleWithPermission}
          wrapper={children => (
            <Layout
              gridSizes={extendedViewer ? gridSize12() : gridSize8(false)}
            >
              <RestrictedMessage>
                <RestrictedMessageTitle>
                  <Icon icon={info2} />
                  <h3 className={font('intsb', 0)}>Restricted item</h3>
                </RestrictedMessageTitle>

                <p style={{ marginBottom: '1rem' }}>
                  Only staff with the right permissions can view this item
                  online.
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
                <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                  {children}
                </Space>
              )}
            >
              <p className={font('lr', -2)} style={{ marginBottom: 0 }}>
                Contains:{' '}
                {collectionManifestsCount && collectionManifestsCount > 0
                  ? pluralize(collectionManifestsCount, 'volume')
                  : canvasCount
                    ? pluralize(canvasCount, 'image')
                    : null}
              </p>
            </ConditionalWrapper>
          )}

          {(itemUrl || isDownloadable) && (
            <Space
              $v={{ size: 's', properties: ['margin-top'] }}
              style={{ display: 'flex' }}
            >
              {itemUrl && (
                <Space
                  as="span"
                  $h={{ size: 'm', properties: ['margin-right'] }}
                >
                  <Button
                    variant="ButtonSolidLink"
                    icon={eye}
                    text="View"
                    link={itemUrl}
                  />
                </Space>
              )}
              {isDownloadable && (
                <Download
                  ariaControlsId="itemDownloads"
                  downloadOptions={downloadOptions}
                />
              )}
            </Space>
          )}
        </ConditionalWrapper>
      )}
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
  const { userIsStaffWithRestricted } = useUserContext();
  const [origin, setOrigin] = useState<string | undefined>();
  const { authV2 } = useToggles();

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

  const tokenService = getIframeTokenSrc({
    userIsStaffWithRestricted,
    workId: work.id,
    origin,
    auth,
    authV2,
  });

  const authServices = getAuthServices({ auth, authV2 });

  const hasNonStandardItems = itemsStatus !== 'allStandard';

  const [tabbableId, setTabbableId] = useState<string>();
  const [archiveTree, setArchiveTree] = useState<UiTree>([]);
  const allOriginalPdfs = isAllOriginalPdfs(canvases || []);
  const clickThroughService = authServices?.active;

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
  const { isEnhanced } = useAppContext();

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
              <p className={font('lr', -2)}>
                Contains {canvases?.length} files
              </p>
            )}
            <MessageBox>{bornDigitalMessage}</MessageBox>
            <div style={{ overflow: 'visible' }}>
              <div style={{ display: 'inline-table', minWidth: '100%' }}>
                <TreeHeadings aria-hidden="true">
                  <DownloadTable>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>File format</th>
                        <th>Size</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                  </DownloadTable>
                </TreeHeadings>
                <TreeContainer>
                  <Tree
                    $isEnhanced={isEnhanced}
                    $showFirstLevelGuideline={true}
                  >
                    {isEnhanced && (
                      <TreeInstructions>{`Download tree: ${treeInstructions}`}</TreeInstructions>
                    )}
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
                  </Tree>
                </TreeContainer>
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
            {!shouldShowItemLink && (
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
                        $v={{ size: 's', properties: ['margin-top'] }}
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
