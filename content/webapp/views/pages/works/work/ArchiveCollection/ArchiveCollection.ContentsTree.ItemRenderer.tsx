import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { chevron, file, folder } from '@weco/common/icons';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Icon from '@weco/common/views/components/Icon';
import { toWorkLink } from '@weco/content/views/components/WorkLink';
import WorkTitle from '@weco/content/views/components/WorkTitle';
import { TreeControl } from '@weco/content/views/pages/works/work/NestedList';
import { controlDimensions } from '@weco/content/views/pages/works/work/work.helpers';
import {
  TreeDataWork,
  UiTreeNode,
} from '@weco/content/views/pages/works/work/work.types';

import {
  ChevronSpacer,
  ContentsTable,
  NameCell,
} from './ArchiveCollection.ContentsTree.styles';

const levelLabel = (type: TreeDataWork['type']) =>
  type === 'Work' ? 'Item' : type;

export type ContentsTreeItemRendererProps = {
  item: UiTreeNode;
  hasControl: boolean;
  level: number;
  highlightCondition?: 'primary' | 'secondary';
  isDarkMode?: boolean;
};

const ContentsTreeItemRenderer: FunctionComponent<
  ContentsTreeItemRendererProps
> = ({ item, hasControl, level, highlightCondition, isDarkMode }) => {
  const { isEnhanced } = useAppContext();
  // Safe assertion: this renderer is only used in the archive collection
  // contents tree, where data is always TreeDataWork
  const data = item.data as TreeDataWork;

  // Nested <ul>s indent each row via padding-left (see work.styles.tsx),
  // so a row's own <table> starts further right the deeper it's nested --
  // this is exactly how much, so it can be cancelled out and the row's
  // background can span the tree's full width regardless of depth.
  const indentPx = level > 2 ? (level - 2) * controlDimensions.controlWidth : 0;

  return (
    <ContentsTable
      $isEvenRow={item.rowIndex !== undefined && item.rowIndex % 2 === 0}
      $indentPx={indentPx}
    >
      <tbody>
        <tr>
          <td>
            <NameCell>
              {isEnhanced && hasControl ? (
                <TreeControl
                  $highlightCondition={highlightCondition}
                  $isDarkMode={isDarkMode}
                >
                  <Icon
                    rotate={item.openStatus ? undefined : 270}
                    icon={chevron}
                  />
                </TreeControl>
              ) : (
                <ChevronSpacer />
              )}

              <Icon
                icon={hasControl ? folder : file}
                matchText
                sizeOverride="height: 16px; width: 16px;"
              />

              <NextLink
                {...toWorkLink({ id: data.id, scroll: false })}
                onClick={event => {
                  // Don't toggle the branch when the link itself is activated
                  event.stopPropagation();
                }}
                tabIndex={isEnhanced ? 0 : undefined}
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
          <td>{levelLabel(data.type)}</td>
        </tr>
      </tbody>
    </ContentsTable>
  );
};

export default ContentsTreeItemRenderer;
