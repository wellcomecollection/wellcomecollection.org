import styled from 'styled-components';
import { chevron } from '@weco/common/icons';
import { font, classNames } from '@weco/common/utils/classnames';
import WorkTitle from '../WorkTitle/WorkTitle';
import WorkLink from '../WorkLink';
import Icon from '@weco/common/views/components/Icon/Icon';
import {
  ListProps,
  UiTree,
  UiTreeNode,
  getTabbableIds,
  updateChildren,
} from './ArchiveTree.helpers';
import { getWorkClientSide } from '@weco/content/services/wellcome/catalogue/works';
import { FunctionComponent, useContext } from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import NestedList from './ArchiveTree.NestedList';
import { StyledLink, TreeControl, TreeItem } from './ArchiveTree.styles';

const RefNumber = styled.span.attrs({
  className: font('intr', 6),
})`
  line-height: 1;
  display: block;
  color: ${props => props.theme.color('neutral.600')};
  text-decoration: none;
`;

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
  item: UiTreeNode;
  setSize: number;
  posInSet: number;
};

const ListItem: FunctionComponent<ListItemProps> = ({
  item,
  currentWorkId,
  selected,
  setArchiveTree,
  fullTree,
  level,
  setSize,
  posInSet,
  tabbableId,
  setTabbableId,
  archiveAncestorArray,
}: ListItemProps) => {
  const { isEnhanced } = useContext(AppContext);
  const isEndNode = item.children && item.children.length === 0;
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
    : '';

  const hasControl = Boolean(
    item?.work?.totalParts && item?.work?.totalParts > 0
  );

  function toggleBranch() {
    // TODO use new API totalParts data when available
    if (item.children === undefined) {
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
      $showGuideline={isEnhanced && hasControl && item.openStatus && level > 1}
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
      aria-label={
        isEnhanced
          ? `${item.work.title}${
              item.work.referenceNumber
                ? `, reference number ${item.work.referenceNumber}`
                : ''
            }`
          : undefined
      }
      aria-selected={isEnhanced ? isSelected : undefined}
      tabIndex={isEnhanced ? (isSelected ? 0 : -1) : undefined}
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

        switch (true) {
          case RIGHT.includes(key): {
            // When focus is on an open node, moves focus to the first child node.
            if (item.openStatus) {
              if (nextId) {
                setTabbableId(nextId);
              }
            }

            // When focus is on an end node, does nothing.
            if (item.children && item.children.length === 0) {
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
            if (item.openStatus && item.children && item.children.length > 0) {
              // TODO remove when API updated with totalDescendentParts
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
            if (
              isEndNode ||
              !item.openStatus ||
              (item.children && item.children.length === 0) // TODO remove when API updated
            ) {
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
        event.stopPropagation();
        if (level > 0) {
          toggleBranch();
          setTabbableId(item.work.id);
        }
      }}
    >
      <div style={{ display: 'inline-flex' }}>
        {isEnhanced && level > 1 && hasControl && (
          <TreeControl
            data-gtm-trigger="tree_chevron"
            $highlightCondition={highlightCondition}
          >
            <Icon rotate={item.openStatus ? undefined : 270} icon={chevron} />
          </TreeControl>
        )}
        <WorkLink
          id={item.work.id}
          source="archive_tree"
          scroll={false}
          passHref
        >
          <StyledLink
            className={classNames({
              [font('intb', 6)]: level === 1,
              [font('intr', 6)]: level > 1,
            })}
            tabIndex={isEnhanced ? (isSelected ? 0 : -1) : 0}
            ref={currentWorkId === item.work.id ? selected : undefined}
            $isCurrent={currentWorkId === item.work.id}
            $hasControl={hasControl}
            data-gtm-trigger="tree_link"
            data-gtm-data-tree-level={level}
          >
            <WorkTitle title={item.work.title} />
            <RefNumber>{item.work.referenceNumber}</RefNumber>
          </StyledLink>
        </WorkLink>
      </div>
      {item.children && item.openStatus && (
        <NestedList
          selected={selected}
          currentWorkId={currentWorkId}
          archiveTree={item.children}
          fullTree={fullTree}
          level={level + 1}
          tabbableId={tabbableId}
          setTabbableId={setTabbableId}
          archiveAncestorArray={archiveAncestorArray}
        />
      )}
    </TreeItem>
  );
};

export default ListItem;
