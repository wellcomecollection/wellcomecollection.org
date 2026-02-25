import { FunctionComponent } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { getWorkClientSide } from '@weco/content/services/wellcome/catalogue/works';
import {
  UiTree,
  UiTreeNode,
} from '@weco/content/views/pages/works/work/work.types';

import {
  getAriaLabel,
  getTabbableIds,
  ListProps,
  updateChildren,
} from './ArchiveTree.helpers';
import NestedList from './ArchiveTree.NestedList';
import { TreeItem } from './ArchiveTree.styles';

const LEFT = [37, 'ArrowLeft'];
const RIGHT = [39, 'ArrowRight'];
const DOWN = [40, 'ArrowDown'];
const UP = [38, 'ArrowUp'];

function updateOpenStatus({
  id,
  tree,
  value,
}: {
  id: string;
  tree: UiTree;
  value: boolean;
}): UiTree {
  const newTree = tree.map(node => {
    if (node.work.id === id) {
      return {
        ...node,
        openStatus: value,
      };
    } else if (node.work.id !== id && node.children) {
      return {
        ...node,
        children: updateOpenStatus({ id, tree: node.children, value }),
      };
    } else {
      return node;
    }
  });
  return newTree;
}

async function getChildren(workId: string): Promise<UiTree> {
  const work = await getWorkClientSide(workId);

  return work.type !== 'Error' && work.type !== 'Redirect' && work.parts
    ? work.parts.map(part => ({
        work: part,
        openStatus: false,
        parentId: workId,
      }))
    : [];
}

function getNextTabbableId({
  currentId,
  tree,
}: {
  currentId: string;
  tree: UiTree;
}): string | undefined {
  const tabbableIds = getTabbableIds(tree);
  const currIndex = tabbableIds.indexOf(currentId);
  return tabbableIds[currIndex + 1];
}

function getPreviousTabbableId({
  currentId,
  tree,
}: {
  currentId: string;
  tree: UiTree;
}): string | undefined {
  const tabbableIds = getTabbableIds(tree);
  const currIndex = tabbableIds.indexOf(currentId);
  return tabbableIds[currIndex - 1];
}

async function expandTree({
  item,
  setArchiveTree,
  archiveTree,
}: {
  item: UiTreeNode;
  setArchiveTree: (tree: UiTree) => void;
  archiveTree: UiTree;
}) {
  const children = await getChildren(item.work.id);

  setArchiveTree(
    updateChildren({
      tree: archiveTree,
      id: item.work.id,
      value: children,
      manualUpdate: true,
    })
  );
}

type ListItemProps = ListProps & {
  setSize: number;
  posInSet: number;
  index: number;
  shouldFetchChildren: boolean;
  flatMode?: boolean;
};

function getTabIndex({
  isEnhanced,
  isSelected,
  level,
  index,
  firstItemTabbable,
}): 0 | -1 | undefined {
  if (isEnhanced) {
    if (firstItemTabbable && level === 1 && index === 0) {
      return 0;
    } else {
      return isSelected ? 0 : -1;
    }
  } else {
    return undefined;
  }
}

const ListItem: FunctionComponent<ListItemProps> = ({
  index,
  item,
  currentWorkId,
  setArchiveTree,
  fullTree,
  level,
  setSize,
  posInSet,
  tabbableId,
  setTabbableId,
  archiveAncestorArray,
  firstItemTabbable,
  showFirstLevelGuideline,
  ItemRenderer,
  shouldFetchChildren,
  flatMode = false,
}: ListItemProps) => {
  const { isEnhanced } = useAppContext();
  const isEndNode = item.work.totalParts === 0;
  const isSelected =
    (tabbableId && tabbableId === item.work.id) ||
    (!tabbableId && currentWorkId === item.work.id);
  const descendentIsSelected =
    archiveAncestorArray &&
    archiveAncestorArray.some(ancestor => ancestor.id === item.work.id);
  const highlightCondition = item.openStatus
    ? 'primary'
    : descendentIsSelected
      ? 'secondary'
      : undefined;

  const hasControl = Boolean(
    item?.work?.totalParts && item?.work?.totalParts > 0
  );

  const showGuideline =
    isEnhanced &&
    hasControl &&
    item.openStatus &&
    (level > 1 || showFirstLevelGuideline);

  function toggleBranch() {
    if (item.children === undefined && shouldFetchChildren) {
      expandTree({
        item,
        setArchiveTree,
        archiveTree: fullTree,
      });
    } else {
      setArchiveTree(
        updateOpenStatus({
          id: item.work.id,
          tree: fullTree,
          value: !item.openStatus,
        })
      );
    }
  }

  return (
    <TreeItem
      id={item.work.id}
      role={isEnhanced ? 'treeitem' : undefined}
      $isEnhanced={isEnhanced}
      $showGuideline={showGuideline}
      aria-level={isEnhanced ? level : undefined}
      aria-setsize={isEnhanced ? setSize : undefined}
      aria-posinset={isEnhanced ? posInSet : undefined}
      aria-expanded={
        isEnhanced
          ? item.children && item.children.length > 0
            ? item.openStatus
            : undefined
          : undefined
      }
      aria-label={isEnhanced ? getAriaLabel(item) : undefined}
      aria-selected={isEnhanced ? isSelected : undefined}
      tabIndex={getTabIndex({
        isEnhanced,
        isSelected,
        level,
        index,
        firstItemTabbable,
      })}
      onKeyDown={event => {
        event.stopPropagation();
        const key = event.key || event.keyCode;
        const isKeyOfInterest = [...LEFT, ...RIGHT, ...DOWN, ...UP].includes(
          key
        );

        if (!isKeyOfInterest) return;

        const nextId = getNextTabbableId({
          currentId: item.work.id,
          tree: fullTree,
        });
        const previousId = getPreviousTabbableId({
          currentId: item.work.id,
          tree: fullTree,
        });

        if (flatMode && (LEFT.includes(key) || RIGHT.includes(key))) {
          return;
        }

        switch (true) {
          case RIGHT.includes(key): {
            // When focus is on an open node, moves focus to the first child node.
            if (item.openStatus) {
              if (nextId) {
                setTabbableId(nextId);
              }
            }

            // When focus is on an end node, does nothing.
            if (item.work.totalParts && item.work.totalParts === 0) {
              return;
            }

            // When focus is on a closed node, opens the node; focus does not move.
            if (!item.openStatus) {
              toggleBranch();
              setTabbableId(item.work.id);
            }
            break;
          }
          case LEFT.includes(key): {
            // When focus is on an open node, closes the node.
            if (
              item.openStatus &&
              item.work.totalParts &&
              item.work.totalParts > 0
            ) {
              setArchiveTree(
                updateOpenStatus({
                  id: item.work.id,
                  tree: fullTree,
                  value: !item.openStatus,
                })
              );
              setTabbableId(item.work.id);
            }
            // When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.
            // When focus is on a root node that is also either an end node or a closed node, does nothing.
            if (isEndNode || !item.openStatus) {
              if (item.parentId) {
                setTabbableId(item.parentId);
              }
            }
            break;
          }
          case DOWN.includes(key): {
            // Moves focus to the next node that is focusable without opening or closing a node.
            if (nextId) {
              setTabbableId(nextId);
            }
            break;
          }
          case UP.includes(key): {
            // Moves focus to the previous node that is focusable without opening or closing a node.
            if (previousId) {
              setTabbableId(previousId);
            }
            break;
          }
        }
      }}
      onClick={event => {
        if (flatMode) return;
        // We had previously used event.stopPropagation() to stop the clicking
        // of an inner TreeItem from bubbling up to any outer TreeItems, but
        // this prevented a GTM trigger that we have set on download links from
        // firing. Instead, we now check that we only fire the click event on
        // the _original_ target of the click by comparing `target` (original)
        // with `currentTarget` (whatever is currently being evaluated in the
        // bubbling phase)
        if (
          event.currentTarget !==
          (event.target as HTMLElement)?.closest('[role="treeitem"]')
        )
          return;

        if (level > 0) {
          toggleBranch();
          setTabbableId(item.work.id);
        }
      }}
    >
      {ItemRenderer && (
        <ItemRenderer
          currentWorkId={currentWorkId}
          item={item}
          isSelected={isSelected}
          isEnhanced={isEnhanced}
          level={level}
          showFirstLevelGuideline={showFirstLevelGuideline}
          hasControl={hasControl}
          highlightCondition={highlightCondition}
          flatMode={flatMode}
        />
      )}

      {item.children && (flatMode || item.openStatus) && (
        <NestedList
          currentWorkId={currentWorkId}
          archiveTree={item.children}
          fullTree={fullTree}
          level={level + 1}
          tabbableId={tabbableId}
          setTabbableId={setTabbableId}
          archiveAncestorArray={archiveAncestorArray}
          setArchiveTree={setArchiveTree}
          firstItemTabbable={firstItemTabbable}
          showFirstLevelGuideline={showFirstLevelGuideline}
          ItemRenderer={ItemRenderer}
          shouldFetchChildren={shouldFetchChildren}
          flatMode={flatMode}
        />
      )}
    </TreeItem>
  );
};

export default ListItem;
