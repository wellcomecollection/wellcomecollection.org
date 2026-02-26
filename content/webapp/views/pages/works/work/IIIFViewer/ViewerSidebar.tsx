import NextLink from 'next/link';
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { arrow, chevron, info2 } from '@weco/common/icons';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { classNames, font } from '@weco/common/utils/classnames';
import { getCatalogueLicenseData } from '@weco/common/utils/licenses';
import { OptionalToUndefined } from '@weco/common/utils/utility-types';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import {
  getAuthServices,
  getMultiVolumeLabel,
  getOriginalFiles,
} from '@weco/content/utils/iiif/v3';
import { removeTrailingFullStop, toHtmlId } from '@weco/content/utils/string';
import { getDigitalLocationInfo } from '@weco/content/utils/works';
import LinkLabels from '@weco/content/views/components/LinkLabels';
import WorkLink from '@weco/content/views/components/WorkLink';
import WorkTitle from '@weco/content/views/components/WorkTitle';
import NestedList from '@weco/content/views/pages/works/work/ArchiveTree/ArchiveTree.NestedList';
import DownloadItemRenderer from '@weco/content/views/pages/works/work/work.DownloadItemRenderer';
import { createDownloadTree } from '@weco/content/views/pages/works/work/work.helpers';
import { UiTree } from '@weco/content/views/pages/works/work/work.types';
import WorksTree from '@weco/content/views/pages/works/work/workDetails/WorkDetails.Tree'; //TODO need items tree to use here and on works page?

import IIIFSearchWithin from './IIIFSearchWithin';
import MultipleManifestList from './MultipleManifestList';
import ViewerStructures from './ViewerStructures';

const RestrictedMessage = styled(Space).attrs({
  $h: { size: 'sm', properties: ['margin-left', 'margin-right'] },
})`
  background: ${props => props.theme.color('neutral.200')};
  color: ${props => props.theme.color('black')};
  border-radius: 3px;
  border-left: 5px solid #1672f3;
`;

const RestrictedMessageTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  h2 {
    padding-left: 8px;
    margin-bottom: 0;
    color: ${props => props.theme.color('accent.blue')};
  }
`;

const Inner = styled(Space).attrs({
  $h: { size: 'sm', properties: ['padding-left', 'padding-right'] },
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
})`
  h1 {
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
    overflow: hidden;
  }
`;

const AccordionInner = styled(Space).attrs({
  className: font('sans-bold', -1),
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
})`
  button {
    width: 100%;
    font-family: inherit;
    color: inherit;
    font-size: inherit;

    span {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  p {
    margin-bottom: 0.5em;
  }
`;

const Item = styled.div`
  border-bottom: 1px solid ${props => props.theme.color('neutral.600')};

  &:first-child {
    border-top: 1px solid ${props => props.theme.color('neutral.600')};
  }
`;

const AccordionButton = styled.button`
  padding: 0;

  h2 {
    margin-bottom: 0;
  }
`;

type AccordionItemProps = PropsWithChildren<{
  title: string;
  testId?: string;
  defaultOpen?: boolean;
}>;

const AccordionItem = ({
  title,
  children,
  testId,
  defaultOpen = false,
}: AccordionItemProps) => {
  const [isActive, setIsActive] = useState(defaultOpen);

  useEffect(() => {
    setIsActive(defaultOpen);
  }, [defaultOpen]);

  return (
    <Item data-testid={testId}>
      <AccordionInner onClick={() => setIsActive(!isActive)}>
        <AccordionButton
          aria-expanded={isActive ? 'true' : 'false'}
          aria-controls={toHtmlId(title)}
        >
          <span>
            <h2 className={font('sans-bold', -1)}>{title}</h2>
            <Icon
              icon={chevron}
              iconColor="white"
              rotate={isActive ? undefined : 270}
            />
          </span>
        </AccordionButton>
      </AccordionInner>
      <AccordionInner
        id={toHtmlId(title)}
        className={classNames({
          'is-hidden': !isActive,
        })}
      >
        {children}
      </AccordionInner>
    </Item>
  );
};

type ViewerSidebarProps = OptionalToUndefined<{
  iiifImageLocation?: DigitalLocation;
  iiifPresentationLocation?: DigitalLocation;
  hasMultipleCanvases?: boolean;
}>;

const ViewerSidebar: FunctionComponent<ViewerSidebarProps> = ({
  iiifImageLocation,
  iiifPresentationLocation,
  hasMultipleCanvases,
}) => {
  const { work, transformedManifest, parentManifest, useFixedSizeList } =
    useItemViewerContext();
  const { userIsStaffWithRestricted } = useUserContext();

  const [tabbableId, setTabbableId] = useState<string>();
  const [archiveTree, setArchiveTree] = useState<UiTree>([]);
  const canvases = transformedManifest?.canvases ?? [];
  const canvasIndexById = canvases.reduce(
    (acc, canvas, index) => {
      acc[canvas.id] = index + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const matchingManifest =
    parentManifest &&
    parentManifest.canvases.find(canvas => {
      return !transformedManifest
        ? false
        : canvas.id === transformedManifest.id;
    });

  const manifestLabel =
    matchingManifest?.label &&
    getMultiVolumeLabel(matchingManifest.label, work?.title || '');

  const { structures, searchService, auth } = { ...transformedManifest };

  const digitalLocation: DigitalLocation | undefined =
    iiifPresentationLocation || iiifImageLocation;

  const license =
    digitalLocation?.license &&
    getCatalogueLicenseData(digitalLocation.license);

  const locationOfWork = work.notes.find(
    note => note.noteType.id === 'location-of-original'
  );

  const digitalLocationInfo =
    digitalLocation && getDigitalLocationInfo(digitalLocation);

  const isWorkVisibleWithPermission =
    digitalLocationInfo?.accessCondition === 'restricted' &&
    userIsStaffWithRestricted;

  const authServices = getAuthServices({ auth });

  const manifestNeedsRegeneration =
    authServices?.external?.id ===
    'https://iiif.wellcomecollection.org/auth/restrictedlogin';

  // Create tree from structures if available, otherwise flat tree from canvases
  useEffect(() => {
    if (hasMultipleCanvases && !useFixedSizeList) {
      let tree: UiTree = [];

      if (structures && structures.length > 0) {
        // Use structures to build hierarchical tree, but skip the wrapper
        tree = createDownloadTree(structures, canvases);
        // Skip the top-level "objects" wrapper if present
        if (
          tree.length === 1 &&
          tree[0].work.id === 'objects' &&
          tree[0].children
        ) {
          tree = tree[0].children;
        }
      } else {
        // Build flat tree from canvases
        tree = canvases.map((canvas, index) => ({
          openStatus: true,
          work: {
            ...canvas,
            title: `File ${index + 1}`,
            downloads: getOriginalFiles(canvas),
            totalParts: 0,
          },
        }));
      }

      // Expand all items by default
      const expandAll = (items: UiTree): UiTree => {
        return items.map(item => ({
          ...item,
          openStatus: true,
          children: item.children ? expandAll(item.children) : undefined,
        }));
      };

      setArchiveTree(expandAll(tree));
    }
  }, [canvases, hasMultipleCanvases, useFixedSizeList, structures]);

  useEffect(() => {
    const elementToFocus = tabbableId && document.getElementById(tabbableId);
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }, [archiveTree, tabbableId]);

  return (
    <>
      {isWorkVisibleWithPermission && (
        <RestrictedMessage>
          <Space
            $h={{ size: 'sm', properties: ['padding-left', 'padding-right'] }}
            $v={{ size: 'xs', properties: ['padding-top', 'padding-bottom'] }}
            className={font('sans', -1)}
          >
            <RestrictedMessageTitle>
              <Icon icon={info2} iconColor="accent.blue" />
              <h2 className={font('sans-bold', -1)}>Restricted item</h2>
            </RestrictedMessageTitle>

            <p style={{ marginBottom: manifestNeedsRegeneration ? '1rem' : 0 }}>
              Only staff with the right permissions can view this item online.
            </p>

            {manifestNeedsRegeneration && (
              <p style={{ marginBottom: 0 }}>
                The manifest for this work needs to be regenerated in order for
                staff with restricted access to be able to view it.
              </p>
            )}
          </Space>
        </RestrictedMessage>
      )}
      <Inner className={font('sans-bold', -1)}>
        {manifestLabel && (
          <span className={font('sans', -1)}>{manifestLabel}</span>
        )}
        <h1>
          <WorkTitle title={work.title} />
        </h1>

        {work.primaryContributorLabel && (
          <Space $h={{ size: 'sm', properties: ['margin-right'] }}>
            <LinkLabels items={[{ text: work.primaryContributorLabel }]} />
          </Space>
        )}

        {work.productionDates.length > 0 && (
          <LinkLabels
            heading="Date"
            items={[{ text: work.productionDates[0] }]}
          />
        )}

        {work.referenceNumber && (
          <LinkLabels
            heading="Reference"
            items={[{ text: work.referenceNumber }]}
          />
        )}

        <Space $v={{ size: 'sm', properties: ['margin-top'] }}>
          <WorkLink
            id={work.id}
            className={font('sans', -1)}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            Catalogue details
            <Space
              $h={{ size: 'xs', properties: ['margin-left'] }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Icon icon={arrow} matchText={true} iconColor="white" />
            </Space>
          </WorkLink>
        </Space>
      </Inner>
      <Inner>
        <AccordionItem title="Licence and re-use">
          <div className={font('sans', -2)}>
            {license && license.label && (
              <p>
                <strong>Licence:</strong>{' '}
                {license.url ? (
                  <NextLink href={license.url}>{license.label}</NextLink>
                ) : (
                  <span>{license.label}</span>
                )}
              </p>
            )}
            <p>
              <strong>Credit:</strong> {removeTrailingFullStop(work.title)}.{' '}
              {digitalLocation?.credit && <>{digitalLocation?.credit}. </>}
              Source: <WorkLink id={work.id}>Wellcome Collection</WorkLink>.
            </p>

            {locationOfWork && (
              <p>
                <strong>Provider: </strong>
                {locationOfWork.contents}
              </p>
            )}
          </div>
        </AccordionItem>

        {hasMultipleCanvases && !useFixedSizeList && archiveTree.length > 0 && (
          <AccordionItem title="Contents" defaultOpen={true}>
            <WorksTree
              darkMode={true}
              hasStructures={Boolean(structures && structures.length > 0)}
            >
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
                darkMode={true}
                itemRendererProps={{
                  linkToCanvas: true,
                  workId: work.id,
                  canvasIndexById,
                }}
              />
            </WorksTree>
          </AccordionItem>
        )}

        {Boolean(structures && structures.length > 0) && useFixedSizeList && (
          <AccordionItem title="Contents">
            <ViewerStructures />
          </AccordionItem>
        )}
        {/*
          Note: this check for `behavior === 'multi-part'` is repeated in items.tsx to
          avoid sending unnecessary data about parent manifests that we're not going
          to render.  If you change the display condition here, you'll likely want to
          update it there also.
        */}
        {parentManifest &&
          parentManifest.behavior?.[0] === 'multi-part' &&
          parentManifest.canvases && (
            <AccordionItem title="Volumes">
              <MultipleManifestList />
            </AccordionItem>
          )}
      </Inner>
      {searchService && (
        <Inner>
          <IIIFSearchWithin />
        </Inner>
      )}
    </>
  );
};

export default ViewerSidebar;
