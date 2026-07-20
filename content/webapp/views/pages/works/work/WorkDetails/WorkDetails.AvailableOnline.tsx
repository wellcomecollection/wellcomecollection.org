import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useKiosk } from '@weco/common/contexts/KioskContext';
import { useUserContext } from '@weco/common/contexts/UserContext';
import { bornDigitalMessage } from '@weco/common/data/microcopy';
import { eye } from '@weco/common/icons';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { LinkProps } from '@weco/common/model/link-props';
import { typography } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Layout, { gridSize12 } from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { Note, Work } from '@weco/content/services/wellcome/catalogue/types';
import {
  DownloadOption,
  ItemsStatus,
  TransformedCanvas,
  TransformedManifest,
} from '@weco/content/types/manifest';
import {
  getAuthServices,
  getFileTypeLabel,
  getIframeTokenSrc,
  isPDFCanvas,
} from '@weco/content/utils/iiif/v3';
import { DigitalLocationInfo } from '@weco/content/utils/works';
import Download from '@weco/content/views/components/Download';
import NestedList from '@weco/content/views/pages/works/work/NestedList';
import DownloadItemRenderer from '@weco/content/views/pages/works/work/work.DownloadItemRenderer';
import { createDownloadTree } from '@weco/content/views/pages/works/work/work.helpers';
import RestrictedItemMessage from '@weco/content/views/pages/works/work/work.RestrictedItemMessage';
import { UiTree } from '@weco/content/views/pages/works/work/work.types';

import IIIFClickthrough from './WorkDetails.IIIFClickthrough';
import WorkDetailsLicence from './WorkDetails.Licence';
import WorkDetailsSection from './WorkDetails.Section';
import WorksTree from './WorkDetails.Tree';

const RestrictedMessage = styled(Space).attrs({
  $v: { size: 'md', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
  className: typography('body', 'md', 'regular'),
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

const MessageBox = styled(Space).attrs({
  className: typography('body', 'md', 'regular'),
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
  itemsStatus,
}: ItemPageLinkProps) => {
  const { userIsStaffWithRestricted } = useUserContext();

  const hasNonStandardItems =
    itemsStatus !== undefined && itemsStatus !== 'allStandard';

  const isDownloadable =
    digitalLocationInfo?.accessCondition !== 'open-with-advisory' &&
    downloadOptions.length > 0;

  const canDownload =
    isDownloadable &&
    !hasNonStandardItems &&
    (digitalLocationInfo?.accessCondition !== 'restricted' ||
      userIsStaffWithRestricted);

  const isWorkVisibleWithPermission =
    digitalLocationInfo?.accessCondition === 'restricted' &&
    userIsStaffWithRestricted;

  const { isKiosk } = useKiosk();
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
          <Layout gridSizes={gridSize12()}>
            <RestrictedMessage>
              <RestrictedItemMessage headingLevel={3} plural={true}>
                {children}
              </RestrictedItemMessage>
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
            <p
              className={typography('caption', 'md', 'regular')}
              style={{ marginBottom: 0 }}
            >
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

        {(itemUrl || canDownload) && (
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
            {canDownload && !isKiosk && (
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
  } = { ...transformedManifest };

  const tokenService = getIframeTokenSrc({
    workId: work.id,
    origin,
    auth,
  });

  const authServices = getAuthServices({ auth });

  const hasNonStandardItems = itemsStatus !== 'allStandard';

  const [tabbableId, setTabbableId] = useState<string>();
  const [tree, setTree] = useState<UiTree>([]);
  const allOriginalPdfs =
    canvases?.every(canvas => isPDFCanvas(canvas)) || false;
  const clickThroughService = authServices?.active;

  // We temporarily want to show the download tree for multiple PDFs
  // See: https://github.com/wellcomecollection/wellcomecollection.org/issues/12089
  const shouldShowDownloadTree =
    hasNonStandardItems &&
    (!allOriginalPdfs || (allOriginalPdfs && Number(canvases?.length) > 1));

  useEffect(() => {
    const downloads = createDownloadTree(structures, canvases);
    setTree(downloads);
  }, [canvases, structures]);

  useEffect(() => {
    const elementToFocus = tabbableId && document.getElementById(tabbableId);
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }, [tree, tabbableId]);

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
              <p className={typography('caption', 'md', 'regular')}>
                Contains {canvases?.length} files
              </p>
            )}
            <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
              <MessageBox>{bornDigitalMessage}</MessageBox>
            </Space>
            {shouldShowItemLink ? (
              <ItemPageLink
                work={work}
                itemUrl={itemUrl}
                canvases={canvases}
                collectionManifestsCount={collectionManifestsCount}
                canvasCount={canvasCount}
                downloadOptions={downloadOptions}
                digitalLocationInfo={digitalLocationInfo}
                itemsStatus={itemsStatus}
              />
            ) : (
              <WorksTree>
                <NestedList
                  currentWorkId={work.id}
                  tree={tree}
                  setTree={setTree}
                  items={tree}
                  level={1}
                  tabbableId={tabbableId}
                  setTabbableId={setTabbableId}
                  firstItemTabbable={true}
                  showFirstLevelGuideline={true}
                  ItemRenderer={DownloadItemRenderer}
                  shouldFetchChildren={false}
                  itemRendererProps={{}}
                />
              </WorksTree>
            )}
          </>
        )}

        {/*
          We temporarily want to prevent showing the link for multiple pdfs
          See: https://github.com/wellcomecollection/wellcomecollection.org/issues/12089
        */}
        {(!hasNonStandardItems ||
          (allOriginalPdfs && canvases?.length === 1)) &&
          shouldShowItemLink && (
            <ItemPageLink
              work={work}
              itemUrl={itemUrl}
              canvases={canvases}
              collectionManifestsCount={collectionManifestsCount}
              canvasCount={canvasCount}
              downloadOptions={downloadOptions}
              digitalLocationInfo={digitalLocationInfo}
              itemsStatus={itemsStatus}
            />
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
