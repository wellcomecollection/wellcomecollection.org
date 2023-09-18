import { FunctionComponent, useContext } from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import ListItem from './ArchiveTree.ListItem';
import { font } from '@weco/common/utils/classnames';
import { ListProps, UiTree } from './ArchiveTree.helpers';

type NestedListProps = ListProps & {
  archiveTree: UiTree;
};

const NestedList: FunctionComponent<NestedListProps> = ({
  currentWorkId,
  archiveTree,
  selected,
  fullTree,
  setArchiveTree,
  level,
  tabbableId,
  setTabbableId,
  setShowArchiveTree,
  archiveAncestorArray,
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
                key={item.work.id}
                item={item}
                currentWorkId={currentWorkId}
                selected={selected}
                fullTree={fullTree}
                setArchiveTree={setArchiveTree}
                level={level}
                setSize={archiveTree.length}
                posInSet={i + 1}
                tabbableId={tabbableId}
                setTabbableId={setTabbableId}
                setShowArchiveTree={setShowArchiveTree}
                archiveAncestorArray={archiveAncestorArray}
              />
            )
          );
        })}
    </ul>
  );
};

export default NestedList;
