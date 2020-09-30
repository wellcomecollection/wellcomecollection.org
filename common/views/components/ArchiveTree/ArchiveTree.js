// @flow
import { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import { getWork } from '@weco/catalogue/services/catalogue/works';
import { workLink } from '@weco/common/services/catalogue/routes';
import NextLink from 'next/link';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import type Toggles from '@weco/catalogue/services/catalogue/common';
import Space from '../styled/Space';
// $FlowFixMe (tsx)
import WorkTitle from '@weco/common/views/components/WorkTitle/WorkTitle';
import Icon from '@weco/common/views/components/Icon/Icon';
import {
  getArchiveAncestorArray,
  parsePart,
  type NodeWork,
} from '@weco/common/utils/works';
import { type Work } from '@weco/common/model/catalogue';

const StickyContainer = styled.div`
  border: 1px solid ${props => props.theme.color('pumice')};
  border-bottom: 0;

  ${props => props.theme.media.medium`
    position: sticky;
    top: 0px;
  `}
`;

const StickyContainerInner = styled.div`
  ${props => props.theme.media.medium`
    overflow: scroll;
    max-height: calc(100vh - 48px);
  `}
`;

const StyledLink = styled.a`
  display: inline-block;
  white-space: nowrap;
  display: inline-block;
  color: ${props => props.theme.color('black')};
  background: ${props =>
    props.theme.color(props.isCurrent ? 'yellow' : 'transparent')};
  font-weight: ${props => (props.isCurrent ? 'bold' : 'normal')};
  border-color: ${props =>
    props.theme.color(props.isCurrent ? 'green' : 'transparent')};
  border-radius: 6px;
  padding: 0 6px;
  cursor: pointer;
`;

const Tree = styled.div.attrs(props => ({
  tabIndex: 0,
}))`
  &:focus {
    outline: 1px dashed red;
  }
  ul {
    list-style: none;
    padding-left: 0;
    margin-left: 0;
  }

  li {
    position: relative;
    list-style: none;

    a {
      font-weight: bold;
    }
  }

  a {
    text-decoration: none;
  }

  a:focus,
  a:hover {
    text-decoration: underline;
  }

  ul ul {
    padding-left: 30px;

    li {
      a {
        font-weight: normal;
      }
    }

    li::before,
    li::after {
      content: '';
      position: absolute;
      left: -22px;
    }

    li::before {
      border-top: 2px solid ${props => props.theme.color('teal')};
      top: 20px;
      width: 22px;
      height: 0;
    }

    li::after {
      border-left: 2px solid ${props => props.theme.color('teal')};
      height: 100%;
      width: 0px;
      top: 10px;
    }

    li:last-child::after {
      height: 10px;
    }
  }
`;

/* eslint-disable no-use-before-define */
type UiTreeNode = {|
  openStatus: boolean,
  work: NodeWork,
  parentId: string,
  children: ?UiTree,
|};

type UiTree = UiTreeNode[];

// Add some tests
function getTabbableIds(tree: UiTree): string[] {
  const tabbableIds = tree.reduce((acc, curr, i) => {
    acc.push(curr.work.id);
    if (curr.openStatus && curr.children) {
      acc.push(getTabbableIds(curr.children));
    }
    return acc;
  }, []);
  return tabbableIds.flat();
}

function updateOpenStatus({
  id,
  tree,
  value,
}: {|
  id: string,
  tree: UiTree,
  value: boolean,
|}): UiTree {
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

function createNodeFromWork({
  work,
  openStatus,
}: {|
  work: Work,
  openStatus: boolean,
|}): UiTreeNode {
  return {
    openStatus,
    work: parsePart(work),
    parentId: work.partOf[0] && work.partOf[0].id,
    children:
      work.parts &&
      work.parts.map(part => ({
        openStatus: false,
        work: parsePart(part),
        children: part.children,
      })),
  };
}

async function addChildren({
  item,
  toggles,
}: {|
  item: UiTreeNode,
  toggles: Toggles,
|}): Promise<UiTreeNode> {
  const work = await getWork({ id: item.work.id, toggles });
  return !item.children
    ? {
        openStatus: false,
        work: item.work,
        parentId: item.parentId,
        children: work.parts
          ? work.parts.map(part => ({
              work: parsePart(part),
              openStatus: false,
            }))
          : [],
      }
    : Promise.resolve(item);
}

async function createSiblingsArray({
  work,
  toggles,
  workId, // current work being viewed
  openStatusOverride = false,
}: {
  work: Work,
  toggles: Toggles,
  workId: string,
  openStatusOverride?: boolean,
}): Promise<UiTree> {
  // An array of the current work and all it's siblings
  const siblingsArray = [
    ...(work.precededBy || []).map(item => ({
      openStatus: false,
      work: parsePart(item),
      parentId: work.partOf[0] && work.partOf[0].id,
      children: undefined,
    })),
    {
      ...createNodeFromWork({
        work,
        openStatus: !openStatusOverride,
      }),
    },
    ...(work.succeededBy || []).map(item => ({
      openStatus: false,
      work: parsePart(item),
      parentId: work.partOf[0] && work.partOf[0].id,
      children: undefined,
    })),
  ];

  // Adding the children of each of the works in the siblingsArray
  // We won't need to do this when we have totalParts in the API
  const siblingsArrayWithChildren = await Promise.all(
    siblingsArray.map(item => addChildren({ item, toggles }))
  );

  return siblingsArrayWithChildren;
}

function updateChildren({
  array,
  id,
  value,
  manualUpdate = false,
}: {|
  array: UiTree,
  id: string,
  value: UiTreeNode[],
  manualUpdate?: boolean,
|}): UiTree {
  return (
    array &&
    array.map(item => {
      if (item.work.id === id) {
        return {
          ...item,
          openStatus: manualUpdate || item.openStatus,
          children: value,
        };
      } else {
        return {
          ...item,
          children: item.children
            ? updateChildren({
                array: item.children,
                id,
                value,
                manualUpdate,
              })
            : undefined,
        };
      }
    })
  );
}

async function createArchiveTree({
  work,
  archiveAncestorArray,
  toggles,
}: {|
  work: Work,
  archiveAncestorArray: NodeWork[],
  toggles: Toggles,
|}): Promise<UiTree> {
  const allTreeNodes = [...archiveAncestorArray, parsePart(work)];
  const treeStructure = await allTreeNodes.reduce(
    async (acc, curr, i, ancestorArray) => {
      const siblings =
        i === allTreeNodes.length - 1
          ? await getSiblingsWithDescendents({
              id: curr.id,
              toggles,
              workId: work.id,
              depth: 2,
            })
          : await getSiblingsWithDescendents({
              id: curr.id,
              toggles,
              workId: work.id,
            });

      if (i === 0) {
        return siblings || [];
      } else {
        const idOfObjectToUpdate = ancestorArray[i - 1].id;
        return updateChildren({
          array: await acc,
          id: idOfObjectToUpdate,
          value: siblings || [],
        });
      }
    },
    Promise.resolve([])
  );
  return treeStructure;
}

async function getSiblingsWithDescendents({
  id, // id of work to get
  toggles,
  workId, // current Work being viewed
  depth = 1,
  openStatusOverride = false,
}: {|
  id: string,
  toggles: Toggles,
  workId: string,
  depth?: 1 | 2,
  openStatusOverride?: boolean,
|}): Promise<UiTreeNode[]> {
  const currWork = await getWork({ id, toggles });
  const siblings = await createSiblingsArray({
    work: currWork,
    toggles,
    workId,
    openStatusOverride,
  });
  if (depth === 2) {
    // get siblings array of firstChild and replace
    const siblingsArrayWithChildren = await Promise.all(
      siblings.map(async item => {
        const firstChild = item.children && item.children[0];
        return firstChild
          ? {
              ...item,
              children: await getSiblingsWithDescendents({
                id: firstChild.work.id,
                toggles,
                workId,
                openStatusOverride: true,
              }),
            }
          : item;
      })
    );
    return siblingsArrayWithChildren;
  } else {
    return siblings;
  }
}

function getNextTabbableId({
  currentId,
  tree,
}: {|
  currentId: string,
  tree: UiTree,
|}): ?string {
  const tabbableIds = getTabbableIds(tree);
  const currIndex = tabbableIds.indexOf(currentId);
  return tabbableIds[currIndex + 1];
}

function getPreviousTabbableId({
  currentId,
  tree,
}: {|
  currentId: string,
  tree: UiTree,
|}): ?string {
  const tabbableIds = getTabbableIds(tree);
  const currIndex = tabbableIds.indexOf(currentId);
  return tabbableIds[currIndex - 1];
}

async function expandTree({
  item,
  toggles,
  setArchiveTree,
  archiveTree,
  workId,
}: {|
  item: UiTreeNode,
  toggles: Toggles,
  setArchiveTree: (tree: UiTree) => void,
  archiveTree: UiTree,
  workId: string,
|}) {
  const firstChild = item.children && item.children[0];
  const siblings = firstChild
    ? await getSiblingsWithDescendents({
        id: firstChild.work.id,
        toggles,
        workId,
        openStatusOverride: true,
      })
    : [];
  setArchiveTree(
    updateChildren({
      array: archiveTree,
      id: item.work.id,
      value: siblings,
      manualUpdate: true,
    })
  );
}

const ListItem = ({
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
}: {|
  item: UiTreeNode,
  currentWorkId: string,
  selected: { current: HTMLElement | null },
  setArchiveTree: UiTree => void,
  fullTree: UiTree,
  level: number,
  setSize: number,
  posInSet: number,
  tabbableId: ?string,
  setTabbableId: string => void,
|}) => {
  const isEndNode = item.children && item.children.length === 0;
  const isSelected =
    (tabbableId && tabbableId === item.work.id) ||
    (!tabbableId && currentWorkId === item.work.id);
  const toggles = useContext(TogglesContext);
  function openBranch() {
    if (
      item.children &&
      item.children.find(item => item.children === undefined) // then we haven't tried to add its children yet
    ) {
      expandTree({
        item,
        toggles,
        setArchiveTree,
        archiveTree: fullTree,
        workId: currentWorkId,
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
    <li
      id={item.work.id}
      role="treeitem"
      aria-level={level}
      aria-setsize={setSize}
      aria-posinset={posInSet}
      aria-expanded={
        item.children && item.children.length > 0 ? item.openStatus : null
      }
      aria-label={`${item.work.title}${
        item.work.referenceNumber
          ? `, reference number ${item.work.referenceNumber}`
          : ''
      }`}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onKeyDown={event => {
        event.stopPropagation();
        const nextId = getNextTabbableId({
          currentId: item.work.id,
          tree: fullTree,
        });
        const previousId = getPreviousTabbableId({
          currentId: item.work.id,
          tree: fullTree,
        });
        if (item.children) {
          switch (event.key) {
            case 'ArrowRight': {
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
                openBranch();
                setTabbableId(item.work.id);
              }
              break;
            }
            case 'ArrowLeft': {
              // When focus is on an open node, closes the node.
              if (item.openStatus) {
                setArchiveTree(
                  updateOpenStatus({
                    id: item.work.id,
                    tree: fullTree,
                    value: !item.openStatus,
                  })
                );
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
            case 'ArrowDown': {
              // Moves focus to the next node that is focusable without opening or closing a node.
              if (nextId) {
                setTabbableId(nextId);
              }
              break;
            }
            case 'ArrowUp': {
              // Moves focus to the previous node that is focusable without opening or closing a node.
              if (previousId) {
                setTabbableId(previousId);
              }
              break;
            }
          }
        }
      }}
      onClick={event => {
        event.stopPropagation();
        if (level > 0 && item.children) {
          openBranch();
          setTabbableId(item.work.id);
        }
      }}
    >
      <div style={{ padding: '10px 10px 10px 0' }}>
        <div style={{ whiteSpace: 'nowrap' }}>
          {level > 1 && item.children && item.children.length > 0 && (
            <span style={{ cursor: 'pointer' }}>
              {item.openStatus ? '-' : '+'}
            </span>
          )}
          <NextLink {...workLink({ id: item.work.id })} scroll={false} passHref>
            <StyledLink
              tabIndex={isSelected ? 0 : -1}
              className={classNames({
                [font('hnl', 6)]: true,
              })}
              isCurrent={currentWorkId === item.work.id}
              ref={currentWorkId === item.work.id ? selected : null}
              onClick={event => {
                event.stopPropagation();
                setTabbableId(item.work.id);
              }}
            >
              <WorkTitle title={item.work.title} />
              <div
                style={{
                  fontSize: '13px',
                  color: '#707070',
                  textDecoration: 'none',
                  padding: '0',
                }}
              >
                {item.work.referenceNumber}
              </div>
            </StyledLink>
          </NextLink>
        </div>
        {item.children && item.openStatus && (
          <NestedList
            selected={selected}
            currentWorkId={currentWorkId}
            archiveTree={item.children}
            fullTree={fullTree}
            setArchiveTree={setArchiveTree}
            level={level + 1}
            tabbableId={tabbableId}
            setTabbableId={setTabbableId}
          />
        )}
      </div>
    </li>
  );
};

const NestedList = ({
  currentWorkId,
  archiveTree,
  selected,
  fullTree,
  setArchiveTree,
  level,
  tabbableId,
  setTabbableId,
}: {|
  currentWorkId: string,
  archiveTree: UiTree,
  selected: { current: HTMLElement | null },
  fullTree: UiTree,
  setArchiveTree: UiTree => void,
  level: number,
  tabbableId: ?string,
  setTabbableId: string => void,
|}) => {
  return (
    <ul
      role={level === 1 ? 'tree' : 'group'}
      className={classNames({
        'font-size-5': true,
      })}
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
              />
            )
          );
        })}
    </ul>
  );
};

const ArchiveTree = ({ work }: { work: Work }) => {
  const toggles = useContext(TogglesContext);
  const archiveAncestorArray = getArchiveAncestorArray(work);
  const initialLoad = useRef(true);
  const [archiveTree, setArchiveTree] = useState([]);
  const [tabbableId, setTabbableId] = useState(null);

  useEffect(() => {
    const elementToFocus = tabbableId && document.getElementById(tabbableId);
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }, [archiveTree, tabbableId]);

  const selected = useRef(null);
  const isInArchive =
    (work.parts && work.parts.length > 0) ||
    (work.partOf && work.partOf.length > 0);

  useEffect(() => {
    async function setupTree() {
      const tree = await createArchiveTree({
        work,
        archiveAncestorArray,
        toggles,
      });
      setArchiveTree(tree || []);
    }
    setupTree();
  }, []);

  useEffect(() => {
    if (!initialLoad.current) {
      const workInfo = document.getElementById('work-info');

      if (workInfo) {
        window.requestAnimationFrame(() => {
          workInfo.scrollIntoView({ behavior: 'smooth' });
        });
      }
    }
    initialLoad.current = false;
  }, [work.id]);

  const TreeView = () => (
    <Tree tabindex="0">
      <NestedList
        selected={selected}
        currentWorkId={work.id}
        fullTree={archiveTree}
        setArchiveTree={setArchiveTree}
        archiveTree={archiveTree}
        level={1}
        tabbableId={tabbableId}
        setTabbableId={setTabbableId}
      />
    </Tree>
  );

  return isInArchive ? (
    <StickyContainer>
      <Space
        v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
        h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
        className={classNames({
          'flex flex--v-center bg-smoke': true,
        })}
      >
        <Space
          as="h2"
          h={{ size: 'm', properties: ['margin-right'] }}
          className={classNames({
            [font('wb', 5)]: true,
            'no-margin': true,
          })}
        >
          Collection contents
        </Space>
        <Icon name="tree" />
      </Space>
      <StickyContainerInner>
        <TreeView />
      </StickyContainerInner>
    </StickyContainer>
  ) : null;
};

export default ArchiveTree;
