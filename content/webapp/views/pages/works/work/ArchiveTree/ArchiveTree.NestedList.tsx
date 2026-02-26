import { FunctionComponent } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { font } from '@weco/common/utils/classnames';
import { UiTree } from '@weco/content/views/pages/works/work/work.types';

import { ListProps } from './ArchiveTree.helpers';
import ListItem from './ArchiveTree.ListItem';

type NestedListProps = Omit<ListProps, 'item'> & {
  archiveTree: UiTree;
  shouldFetchChildren: boolean;
  flatMode?: boolean;
  darkMode?: boolean;
  itemRendererProps?: Record<string, unknown>;
};

const NestedList: FunctionComponent<NestedListProps> = ({
  currentWorkId,
  archiveTree,
  fullTree,
  setArchiveTree,
  level,
  tabbableId,
  setTabbableId,
  archiveAncestorArray,
  firstItemTabbable,
  showFirstLevelGuideline,
  ItemRenderer,
  shouldFetchChildren,
  flatMode = false,
  darkMode = false,
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
      className={font('sans', -1)}
    >
      {archiveTree &&
        archiveTree.map((item, i) => {
          return (
            item.work && (
              <ListItem
                index={i}
                key={item.work.id}
                item={item}
                currentWorkId={currentWorkId}
                fullTree={fullTree}
                setArchiveTree={setArchiveTree}
                level={level}
                setSize={archiveTree.length}
                posInSet={i + 1}
                tabbableId={tabbableId}
                setTabbableId={setTabbableId}
                archiveAncestorArray={archiveAncestorArray}
                firstItemTabbable={firstItemTabbable}
                showFirstLevelGuideline={showFirstLevelGuideline}
                ItemRenderer={ItemRenderer}
                shouldFetchChildren={shouldFetchChildren}
                flatMode={flatMode}
                darkMode={darkMode}
                itemRendererProps={itemRendererProps}
              />
            )
          );
        })}
    </ul>
  );
};

export default NestedList;
