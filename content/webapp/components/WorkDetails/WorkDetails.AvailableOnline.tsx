import { useState, useEffect, useContext } from 'react';
import NextLink from 'next/link';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import WorkDetailsSection from './WorkDetails.Section';
import IIIFClickthrough from '@weco/content/components/IIIFClickthrough/IIIFClickthrough';
import Space from '@weco/common/views/components/styled/Space';
import Button from '@weco/common/views/components/Buttons';
import WorkDetailsLicence from './WorkDetails.Licence';
import { eye } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { LinkProps } from '@weco/common/model/link-props';
import {
  DownloadOption,
  TransformedManifest,
} from '@weco/content/types/manifest';
import { Note, Work } from '@weco/content/services/wellcome/catalogue/types';
import { DigitalLocationInfo } from '@weco/content/utils/works';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { UiTree } from '@weco/content/components/ArchiveTree/ArchiveTree.helpers';
import IIIFItemList from '@weco/content/components/IIIFItemList/IIIFItemList';
import DownloadLink from '@weco/content/components/DownloadLink/DownloadLink';
import Download from '@weco/content/components/Download/Download';
import {
  getLabelString,
  getFormatString,
  isAllOriginalPdfs,
} from '@weco/content/utils/iiif/v3';
import { InternationalString, ContentResource } from '@iiif/presentation-3';
import { useToggles } from '@weco/common/server-data/Context';
import {
  bornDigitalMessage,
  treeInstructions,
} from '@weco/common/data/microcopy';
import styled from 'styled-components';
import NestedList from '@weco/content/components/ArchiveTree/ArchiveTree.NestedList';
import {
  Tree,
  TreeInstructions,
} from '@weco/content/components/ArchiveTree//ArchiveTree.styles';
import {
  createDownloadTree,
  controlDimensions,
} from '@weco/content/components/ArchiveTree//ArchiveTree.helpers';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import DownloadItemRenderer from '@weco/content/components/ArchiveTree/ArchiveTree.DownloadItemRenderer';
import { DownloadTable } from '@weco/content/components/WorkDetails/WorkDetails.DownloadItem';
import { getTokenService } from '@weco/content/pages/works/[workId]/items'; // TODO move function to utils?

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
      <div style={{ display: 'flex' }}>
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
        {digitalLocationInfo?.accessCondition !== 'open-with-advisory' &&
          downloadOptions.length > 0 && (
            <Download
              ariaControlsId="itemDownloads"
              downloadOptions={downloadOptions}
            />
          )}
      </div>
      {(Boolean(collectionManifestsCount && collectionManifestsCount > 0) ||
        Boolean(canvasCount && canvasCount > 0)) && (
        <Space $v={{ size: 'm', properties: ['margin-top'] }}>
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
        </Space>
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
  const { showBornDigital, authV2 } = useToggles();
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
    showBornDigital &&
    (bornDigitalStatus === 'mixedBornDigital' ||
      bornDigitalStatus === 'allBornDigital');

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
        {showBornDigital &&
          (bornDigitalStatus === 'mixedBornDigital' ||
            bornDigitalStatus === 'allBornDigital') &&
          !allOriginalPdfs && (
            <>
              {Number(canvases?.length) > 0 && (
                <p className={font('lr', 6)}>
                  Contains {canvases?.length} files
                </p>
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

        {(!showBornDigital ||
          (showBornDigital && bornDigitalStatus === 'noBornDigital') ||
          (showBornDigital && allOriginalPdfs)) && (
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
