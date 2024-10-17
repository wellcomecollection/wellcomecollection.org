import { ContentResource, InternationalString } from '@iiif/presentation-3';
import NextLink from 'next/link';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  bornDigitalMessage,
  treeInstructions,
} from '@weco/common/data/microcopy';
import { eye, info2 } from '@weco/common/icons';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { LinkProps } from '@weco/common/model/link-props';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import Button from '@weco/common/views/components/Buttons';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import Icon from '@weco/common/views/components/Icon/Icon';
import Layout, { gridSize8 } from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';
import {
  controlDimensions,
  createDownloadTree,
} from '@weco/content/components/ArchiveTree//ArchiveTree.helpers';
import {
  Tree,
  TreeInstructions,
} from '@weco/content/components/ArchiveTree//ArchiveTree.styles';
import DownloadItemRenderer from '@weco/content/components/ArchiveTree/ArchiveTree.DownloadItemRenderer';
import { UiTree } from '@weco/content/components/ArchiveTree/ArchiveTree.helpers';
import NestedList from '@weco/content/components/ArchiveTree/ArchiveTree.NestedList';
import Download from '@weco/content/components/Download/Download';
import DownloadLink from '@weco/content/components/DownloadLink/DownloadLink';
import IIIFClickthrough from '@weco/content/components/IIIFClickthrough/IIIFClickthrough';
import IIIFItemList from '@weco/content/components/IIIFItemList/IIIFItemList';
import { DownloadTable } from '@weco/content/components/WorkDetails/WorkDetails.DownloadItem';
import { getTokenService } from '@weco/content/pages/works/[workId]/items'; // TODO move function to utils?
import { Note, Work } from '@weco/content/services/wellcome/catalogue/types';
import {
  DownloadOption,
  TransformedManifest,
} from '@weco/content/types/manifest';
import {
  getFormatString,
  getLabelString,
  isAllOriginalPdfs,
} from '@weco/content/utils/iiif/v3';
import { DigitalLocationInfo } from '@weco/content/utils/works';

import WorkDetailsLicence from './WorkDetails.Licence';
import WorkDetailsSection from './WorkDetails.Section';

const RestrictedMessage = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  className: font('intr', 5),
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
  className: font('intr', 5),
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
  downloadOptions: DownloadOption[];
  itemUrl: LinkProps;
  shouldShowItemLink: boolean;
  digitalLocation?: DigitalLocation;
  digitalLocationInfo?: DigitalLocationInfo;
  locationOfWork?: Note;
  transformedManifest?: TransformedManifest;
};

const ItemPageLink = ({
  work,
  itemUrl,
  downloadOptions,
  collectionManifestsCount,
  canvasCount,
  digitalLocationInfo,
}) => {
  const { user } = useUser();

  const isDownloadable =
    digitalLocationInfo?.accessCondition !== 'open-with-advisory' &&
    downloadOptions.length > 0;

  const isWorkVisibleWithPermission =
    digitalLocationInfo?.accessCondition === 'restricted' &&
    user?.role === 'StaffWithRestricted';

  const manifestNeedsRegeneration = false;

  return (
    <>
      {work.thumbnail && (
        <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
          <ConditionalWrapper
            condition={Boolean(itemUrl)}
            wrapper={children =>
              itemUrl && (
                <NextLink
                  style={{
                    display: 'inline-block',
                  }}
                  href={itemUrl.href}
                  as={itemUrl.as}
                >
                  {children}
                </NextLink>
              )
            }
          >
            <img
              style={{
                width: 'auto',
                height: 'auto',
                display: 'block',
              }}
              alt={`view ${work.title}`}
              src={work.thumbnail.url}
            />
          </ConditionalWrapper>
        </Space>
      )}

      <ConditionalWrapper
        condition={isWorkVisibleWithPermission}
        wrapper={children => (
          <Layout gridSizes={gridSize8(false)}>
            <RestrictedMessage>
              <RestrictedMessageTitle>
                <Icon icon={info2} attrs={{}} />
                <h3 className={font('intsb', 4)}>Restricted item</h3>
              </RestrictedMessageTitle>

              <p style={{ marginBottom: '1rem' }}>
                This item is hidden from the public and can only be viewed by
                staff.
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
        <ConditionalWrapper
          condition={isWorkVisibleWithPermission}
          wrapper={children => (
            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              {children}
            </Space>
          )}
        >
          {(Boolean(collectionManifestsCount && collectionManifestsCount > 0) ||
            Boolean(canvasCount && canvasCount > 0)) && (
            <p className={`${font('lr', 6)}`} style={{ marginBottom: 0 }}>
              Contains:{' '}
              {collectionManifestsCount && collectionManifestsCount > 0
                ? `${collectionManifestsCount} ${
                    collectionManifestsCount === 1 ? 'volume' : 'volumes'
                  }`
                : canvasCount && canvasCount > 0
                  ? `${canvasCount} ${canvasCount === 1 ? 'image' : 'images'}`
                  : ''}
            </p>
          )}
        </ConditionalWrapper>

        {(itemUrl || isDownloadable) && (
          <Space
            $v={{ size: 's', properties: ['margin-top'] }}
            style={{ display: 'flex' }}
          >
            {itemUrl && (
              <Space as="span" $h={{ size: 'm', properties: ['margin-right'] }}>
                <Button
                  variant="ButtonSolidLink"
                  icon={eye}
                  text="View"
                  link={{ ...itemUrl }}
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
  const { authV2 } = useToggles();
  const {
    collectionManifestsCount,
    canvasCount,
    auth,
    structures,
    bornDigitalStatus,
    canvases,
    placeholderId,
    rendering,
  } = { ...transformedManifest };
  const tokenService = getTokenService({ auth, authV2 });
  const activeAccessService = authV2
    ? auth?.v2.activeAccessService || auth?.v1.activeAccessService
    : auth?.v1.activeAccessService; // TODO should this include externalAccessSerice too?

  const isBornDigital =
    bornDigitalStatus === 'mixedBornDigital' ||
    bornDigitalStatus === 'allBornDigital';

  const [tabbableId, setTabbableId] = useState<string>();
  const [archiveTree, setArchiveTree] = useState<UiTree>([]);
  const allOriginalPdfs = isAllOriginalPdfs(canvases || []);

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
  const { isEnhanced } = useContext(AppContext);

  return (
    <WorkDetailsSection
      headingText={`Available ${isBornDigital ? 'to download' : 'online'}`}
    >
      <ConditionalWrapper
        condition={Boolean(tokenService && !shouldShowItemLink)}
        wrapper={children =>
          itemUrl && (
            <IIIFClickthrough
              clickThroughService={activeAccessService}
              tokenService={tokenService}
            >
              {children}
            </IIIFClickthrough>
          )
        }
      >
        {isBornDigital && !allOriginalPdfs && (
          <>
            {Number(canvases?.length) > 0 && (
              <p className={font('lr', 6)}>Contains {canvases?.length} files</p>
            )}
            <MessageBox>{bornDigitalMessage}</MessageBox>
            <div style={{ overflow: 'visible' }}>
              <div
                style={{
                  display: 'inline-table',
                  minWidth: '100%',
                }}
              >
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

        {(!isBornDigital || allOriginalPdfs) && (
          <>
            {!shouldShowItemLink && (
              <>
                <IIIFItemList
                  canvases={canvases}
                  exclude={['Image', 'Text']}
                  placeholderId={placeholderId}
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
                          format={getFormatString(rendering.format || '')}
                          mimeType={rendering.format || ''}
                          trackingTags={['annotation']}
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
                collectionManifestsCount={collectionManifestsCount}
                canvasCount={canvasCount}
                downloadOptions={downloadOptions}
                digitalLocationInfo={digitalLocationInfo}
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
