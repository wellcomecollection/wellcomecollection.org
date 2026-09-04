import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import {
  archive,
  chevron,
  closedFolder,
  file,
  openFolder,
} from '@weco/common/icons';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Icon from '@weco/common/views/components/Icon';
import { toWorkLink } from '@weco/content/views/components/WorkLink';
import WorkTitle from '@weco/content/views/components/WorkTitle';
import {
  getWorkLevelLabel,
  TreeControl,
} from '@weco/content/views/pages/works/work/NestedList';
import {
  TreeDataWork,
  UiTreeNode,
} from '@weco/content/views/pages/works/work/work.types';

import {
  ChevronSpacer,
  compactControlDimensions,
  ContentsTable,
  LevelCell,
  NameCell,
} from './ArchiveCollection.ContentsTree.styles';

export type ContentsTreeItemRendererProps = {
  item: UiTreeNode;
  hasControl: boolean;
  level: number;
  isSelected: boolean;
  highlightCondition?: 'primary' | 'secondary';
  isDarkMode?: boolean;
  rowIndexById?: Record<string, number>;
};

const ContentsTreeItemRenderer: FunctionComponent<
  ContentsTreeItemRendererProps
> = ({
  item,
  hasControl,
  level,
  isSelected,
  highlightCondition,
  isDarkMode,
  rowIndexById,
}) => {
  const { isEnhanced } = useAppContext();
  // Safe assertion: this renderer is only used in the archive collection
  // contents tree, where data is always TreeDataWork
  const data = item.data as TreeDataWork;

  // This is exactly how far the ancestor <ul> nesting has already pushed
  // the row right, so ContentsTable can cancel it out and let the stripe
  // span full width. Starts from level 2, matching showFirstLevelGuideline
  // on Tree/NestedList in ArchiveCollection.Contents.tsx.
  const indentPx =
    level > 1 ? (level - 1) * compactControlDimensions.controlWidth : 0;
  const rowIndex = rowIndexById?.[data.id];
  // The collection root (level 1) represents the archive as a whole, so it
  // gets the archive icon instead of the folder/file icons used for its contents.
  const typeIcon =
    level === 1
      ? archive
      : hasControl
        ? item.openStatus
          ? openFolder
          : closedFolder
        : file;

  return (
    <ContentsTable
      $isEvenRow={rowIndex !== undefined && rowIndex % 2 === 0}
      $indentPx={indentPx}
      $hasControl={hasControl}
    >
      <tbody>
        <tr>
          <td>
            <NameCell>
              {isEnhanced && hasControl ? (
                <TreeControl
                  $highlightCondition={highlightCondition}
                  $isDarkMode={isDarkMode}
                  $isCompact
                >
                  <Icon
                    rotate={item.openStatus ? undefined : 270}
                    icon={chevron}
                    sizeOverride={`height: ${compactControlDimensions.iconSize}px; width: ${compactControlDimensions.iconSize}px;`}
                  />
                </TreeControl>
              ) : (
                <ChevronSpacer />
              )}

              <Icon
                icon={typeIcon}
                iconColor="neutral.600"
                matchText
                sizeOverride="height: 16px; width: 16px;"
              />

              <NextLink
                {...toWorkLink({ id: data.id, scroll: false })}
                onClick={event => {
                  // Don't toggle the branch when the link itself is activated
                  event.stopPropagation();
                }}
                tabIndex={isEnhanced ? (isSelected ? 0 : -1) : 0}
                {...dataGtmPropsToAttributes({
                  trigger: 'contents_tree_link',
                  label: `${data.title}${data.referenceNumber ? ` (${data.referenceNumber})` : ''}`,
                })}
              >
                <WorkTitle title={data.title} />
              </NextLink>
            </NameCell>
          </td>

          <td>{data.referenceNumber}</td>
          <td>
            <LevelCell>
              <Icon
                icon={typeIcon}
                iconColor="neutral.600"
                matchText
                sizeOverride="height: 16px; width: 16px;"
              />
              {getWorkLevelLabel(data.type)}
            </LevelCell>
          </td>
        </tr>
      </tbody>
    </ContentsTable>
  );
};

export default ContentsTreeItemRenderer;
