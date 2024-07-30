import { FunctionComponent, useContext } from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import ListItem from './ArchiveTree.ListItem';
import { font } from '@weco/common/utils/classnames';
import { ListProps, UiTree } from './ArchiveTree.helpers';

type NestedListProps = Omit<ListProps, 'item'> & {
  archiveTree: UiTree;
  shouldFetchChildren: boolean;
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
}: NestedListProps) => {
  const { isEnhanced } = useContext(AppContext);
  return (
    <ul
      aria-labelledby={
        level === 1 && isEnhanced ? 'tree-instructions' : undefined
      }
      tabIndex={level === 1 && isEnhanced ? 0 : undefined}
      role={isEnhanced ? (level === 1 ? 'tree' : 'group') : undefined}
      className={font('intr', 5)}
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
              />
            )
          );
        })}
    </ul>
  );
};

export default NestedList;
