import { FunctionComponent } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { typography } from '@weco/common/utils/classnames';
import { UiTree } from '@weco/content/views/pages/works/work/work.types';

import { ListProps } from './NestedList.helpers';
import ListItem from './NestedList.ListItem';

type NestedListProps = Omit<ListProps, 'item'> & {
  items: UiTree;
  shouldFetchChildren: boolean;
  isDarkMode?: boolean;
  itemRendererProps?: Record<string, unknown>;
};

const NestedList: FunctionComponent<NestedListProps> = ({
  currentWorkId,
  items, // Current level's items to render (changes at each recursion level)
  tree, // Complete tree structure from root (used for navigation/state updates)
  setTree,
  level,
  tabbableId,
  setTabbableId,
  workAncestors,
  firstItemTabbable,
  showFirstLevelGuideline,
  ItemRenderer,
  shouldFetchChildren,
  isDarkMode = false,
  itemRendererProps,
}: NestedListProps) => {
  const { isEnhanced } = useAppContext();
  return (
    <ul
      aria-labelledby={
        level === 1 && isEnhanced ? 'tree-instructions' : undefined
      }
      tabIndex={level === 1 && isEnhanced ? 0 : undefined}
      role={isEnhanced ? (level === 1 ? 'tree' : 'group') : undefined}
      className={typography('body', 'md', 'regular')}
    >
      {items &&
        items.map((item, i) => {
          return (
            item.data && (
              <ListItem
                index={i}
                key={item.data.id}
                item={item}
                currentWorkId={currentWorkId}
                tree={tree}
                setTree={setTree}
                level={level}
                setSize={items.length}
                posInSet={i + 1}
                tabbableId={tabbableId}
                setTabbableId={setTabbableId}
                workAncestors={workAncestors}
                firstItemTabbable={firstItemTabbable}
                showFirstLevelGuideline={showFirstLevelGuideline}
                ItemRenderer={ItemRenderer}
                shouldFetchChildren={shouldFetchChildren}
                isDarkMode={isDarkMode}
                itemRendererProps={itemRendererProps}
              />
            )
          );
        })}
    </ul>
  );
};

export default NestedList;

export { TreeControl } from './NestedList.styles';
export { isTreeDataWork } from './NestedList.helpers';
