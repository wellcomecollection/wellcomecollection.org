// @flow
import { useState, useEffect, useContext, useRef } from 'react';
import flattenDeep from 'lodash.flattendeep';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import { getWork } from '@weco/catalogue/services/catalogue/works';
import { workLink } from '@weco/common/services/catalogue/routes';
import NextLink from 'next/link';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
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
import useWindowSize from '@weco/common/hooks/useWindowSize';
import Modal, { ModalContext } from '@weco/common/views/components/Modal/Modal';
// $FlowFixMe (tsx)
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';

// const StickyContainer = styled.div`
//   border: 1px solid ${props => props.theme.color('pumice')};
//   border-bottom: 0;

//   ${props => props.theme.media.medium`
//     position: sticky;
//     top: 0px;
//   `}
// `;

// const StickyContainerInner = styled.div`
//   ${props => props.theme.media.medium`
//     overflow: scroll;
//     max-height: calc(100vh - 48px);
//   `}
// `;

const instructions =
  'Archive Tree: Tab into the tree, then use up and down arrows to move through tree items. Use right and left arrows to toggle sub menus open and closed. When focused on an item you can tab to the link it contains.';
const controlWidth = 44;
const controlHeight = 44;
const circleWidth = 30;
const circleHeight = 30;
const circleBorder = 2;
const verticalGuidePosition =
  controlHeight / 2 + circleHeight / 2 - circleBorder;
const TreeInstructions = styled.p.attrs(props => ({
  'aria-hidden': 'true',
  id: 'tree-instructions',
}))`
  display: none;
`;

const Tree = styled.div`
  ul {
    position: relative;
    padding-left: 0;
    margin: 0;
    @media (min-width: ${props => props.theme.sizes.medium}px) {
      width: 375px;
    }
    &::before {
      display: none;
      position: absolute;
      content: ${props => (props.isEnhanced ? `'${instructions}'` : null)};
      z-index: 2;
      top: 0;
      background: ${props => props.theme.color('yellow')};
      padding: ${props => `${props.theme.spacingUnit * 2}px`};
      margin: ${props => `${props.theme.spacingUnit}px`};
      border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
      max-width: 600px;
    }
    &:focus::before {
      display: block;
    }
    ul {
      content: '';
      width: auto;
    }
  }

  ul ul ul {
    padding-left: ${`${controlWidth}px`};
  }
`;

const TreeItem = styled.li.attrs({
  className: props => (props.showGuideline ? 'guideline' : null),
})`
  position: relative;
  list-style: ${props => (props.isEnhanced ? 'none' : 'disc')};
  padding: 0;
  &:focus {
    outline: ${props =>
      !props.hideFocus ? `2px solid ${props.theme.color('black')}` : 'none'};
  }

  &.guideline::before,
  &.guideline::after {
    content: '';
    position: absolute;
    z-index: 2;
  }

  &.guideline::before {
    border-left: 1px solid ${props => props.theme.color('yellow')};
    height: 100%;
    width: 0;
    top: ${`${verticalGuidePosition}px`};
    left: ${`${controlWidth / 2}px`};
    height: calc(100% - ${`${verticalGuidePosition + controlHeight / 2}px`});
  }

  &.guideline::after {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.theme.color('yellow')};
    left: ${`${controlWidth / 2 - 3}px`};
    bottom: ${`${controlHeight / 2}px`};
  }
`;

const TreeControl = styled.span`
  display: inline-block;
  cursor: pointer;
  height: ${`${controlHeight}px`};
  width: ${`${controlWidth}px`};
  min-width: ${`${controlWidth}px`};
  position: relative;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    height: ${`${circleHeight}px`};
    width: ${`${circleWidth}px`};
    // centre the circle in the control
    top: ${`${(controlHeight - circleHeight) / 2}px`};
    left: ${`${(controlWidth - circleWidth) / 2}px`};
    background: ${props =>
      props.highlightCondition === 'primary'
        ? props.theme.color('yellow')
        : props.highlightCondition === 'secondary'
        ? props.theme.color('yellow', 'light')
        : props.theme.color('smoke')};
    border: ${props =>
      props.highlightCondition === 'secondary'
        ? `1px solid ${props.theme.color('yellow')}`
        : `2px solid ${props.theme.color('white')}`};
    border-radius: 50%;
  }
  .icon {
    position: absolute;
    z-index: 1;
    // centre the icon in the control
    top: ${`${(controlHeight - 24) / 2}px`}; // icons have a height of 24px
    left: ${`${(controlWidth - 24) / 2}px`}; // icons have a width of 24px
  }
`;

const StyledLink = styled.a`
  display: inline-block;
  min-height: ${`${controlHeight}px`};
  color: ${props => props.theme.color('viewerBlack')};
  background: ${props =>
    props.theme.color(props.isCurrent ? 'yellow' : 'transparent')};
  cursor: pointer;
  margin-left: ${props =>
    props.hasControl ? `-${controlWidth / 2}px` : `${controlWidth / 2}px`};
  padding-left: ${props =>
    props.hasControl
      ? `${circleWidth / 2 + props.theme.spacingUnit}px`
      : props.isCurrent
      ? `${props.theme.spacingUnit}px`
      : 0};
  padding-right: ${props => `${props.theme.spacingUnit * 2}px`};
  text-decoration: none;
  &:focus {
    outline: ${props => (!props.hideFocus ? 'auto' : 'none')};
  }
  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;

const RefNumber = styled.span`
  display: block;
  color: ${props => props.theme.color('pewter')};
  text-decoration: none;
`;

/* eslint-disable no-use-before-define */
type UiTreeNode = {|
  openStatus: boolean,
  work: NodeWork,
  parentId: string,
  children: ?UiTree,
|};

type UiTree = UiTreeNode[];

export function getTabbableIds(tree: UiTree): string[] {
  const tabbableIds = tree.reduce((acc, curr, i) => {
    acc.push(curr.work.id);
    if (curr.openStatus && curr.children) {
      acc.push(getTabbableIds(curr.children));
    }
    return acc;
  }, []);
  return flattenDeep(tabbableIds);
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
    parentId: work.partOf && work.partOf[0] && work.partOf[0].id,
    children:
      work.parts &&
      work.parts.map(part => ({
        openStatus: false,
        work: parsePart(part),
        parentId: work.id,
        children: part.children,
      })),
  };
}

async function getChildren({
  item,
  toggles,
}: {|
  item: UiTreeNode,
  toggles: Toggles,
|}): Promise<UiTree> {
  const work = await getWork({ id: item.work.id, toggles });
  return work.parts
    ? work.parts.map(part => ({
        work: parsePart(part),
        openStatus: false,
        parentId: item.work.id,
      }))
    : [];
}

function createSiblingsArray({
  work,
  workId, // id of current work being viewed
  openStatusOverride = false,
}: {
  work: Work,
  workId: string,
  openStatusOverride?: boolean,
}): UiTree {
  // An array of the current work and all its siblings
  const siblingsArray = [
    ...(work.precededBy || []).map(item => ({
      openStatus: false,
      work: parsePart(item),
      parentId: work.partOf[0] && work.partOf[0].id,
      children: undefined,
    })),
    createNodeFromWork({
      work,
      openStatus: !openStatusOverride,
    }),
    ...(work.succeededBy || []).map(item => ({
      openStatus: false,
      work: parsePart(item),
      parentId: work.partOf[0] && work.partOf[0].id,
      children: undefined,
    })),
  ];
  return siblingsArray;
}

function updateChildren({
  tree,
  id,
  value,
  manualUpdate = false,
}: {|
  tree: UiTree,
  id: string,
  value: UiTreeNode[],
  manualUpdate?: boolean,
|}): UiTree {
  return (
    tree &&
    tree.map(item => {
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
                tree: item.children,
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
  const allTreeNodes = [...archiveAncestorArray, parsePart(work)]; // An array of a work and all its ancestors (ancestors first)
  const treeStructure = await allTreeNodes.reduce(
    async (acc, curr, i, ancestorArray) => {
      const parentId = ancestorArray[i - 1] && ancestorArray[i - 1].id;
      // We add each ancestor and its siblings to the tree
      if (!parentId) {
        const siblings = await getSiblings({
          id: curr.id,
          toggles,
          workId: work.id,
        });
        return siblings;
      }
      if (work.id === curr.id) {
        // If it's the curr work we have all the information we need to create an array of it and its siblings
        // This becomes the value of its parent node's children property
        const siblings = createSiblingsArray({
          work: work,
          workId: work.id,
        });
        return updateChildren({
          tree: await acc,
          id: parentId,
          value: siblings || [],
        });
      } else {
        const siblings = await getSiblings({
          // For everything else we need more data before creating an array of curr and its siblings
          // This becomes the value of the previous node's children property
          id: curr.id,
          toggles,
          workId: work.id,
        });
        return updateChildren({
          tree: await acc,
          id: parentId,
          value: siblings || [],
        });
      }
    },
    Promise.resolve([])
  );
  return treeStructure;
}

async function getSiblings({
  id, // id of work to get
  toggles,
  workId, // id of current Work being viewed
  openStatusOverride = false,
}: {|
  id: string,
  toggles: Toggles,
  workId: string,
  openStatusOverride?: boolean,
|}): Promise<UiTreeNode[]> {
  const currWork = await getWork({ id, toggles });
  const siblings = createSiblingsArray({
    work: currWork,
    workId,
    openStatusOverride,
  });

  return siblings;
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
}: {|
  item: UiTreeNode,
  toggles: Toggles,
  setArchiveTree: (tree: UiTree) => void,
  archiveTree: UiTree,
|}) {
  const children = await getChildren({
    item: item,
    toggles,
  });
  setArchiveTree(
    updateChildren({
      tree: archiveTree,
      id: item.work.id,
      value: children,
      manualUpdate: true,
    })
  );
}

const LEFT = [37, 'ArrowLeft'];
const RIGHT = [39, 'ArrowRight'];
const DOWN = [40, 'ArrowDown'];
const UP = [38, 'ArrowUp'];

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
  setShowArchiveTree,
  archiveAncestorArray,
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
  setShowArchiveTree: boolean => void,
  archiveAncestorArray: NodeWork[],
|}) => {
  const { isKeyboard, isEnhanced } = useContext(AppContext);
  const isEndNode = item.children && item.children.length === 0;
  const isSelected =
    (tabbableId && tabbableId === item.work.id) ||
    (!tabbableId && currentWorkId === item.work.id);
  const toggles = useContext(TogglesContext);
  const { updateLastFocusableRef } = useContext(ModalContext);
  const descendentIsSelected =
    archiveAncestorArray &&
    archiveAncestorArray.some(ancestor => ancestor.id === item.work.id);
  const highlightCondition = item.openStatus
    ? 'primary'
    : descendentIsSelected
    ? 'secondary'
    : '';
  const hasControl =
    (item.children && item.children.length > 0) || !item.children; // TODO use new API totalParts data when available

  function updateTabbing(id) {
    // We only want one tabbable item in the tree at a time,
    // so that keyboard users can get past the tree, without having to tab through all the elements
    // When the tree is inside a Modal we also need to update the lastFocusableRef, from Modal, which is used for the focus trap
    // and prevents users from being able to tab items outside of the Modal when it is open.
    setTabbableId(id);
    const listItem = document.getElementById(id);
    if (listItem && updateLastFocusableRef) {
      updateLastFocusableRef(listItem.getElementsByTagName('a')[0]);
    }
  }
  function toggleBranch() {
    // TODO use new API totalParts data when available
    if (item.children === undefined) {
      expandTree({
        item,
        toggles,
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
      hideFocus={!isKeyboard}
      isEnhanced={isEnhanced}
      showGuideline={isEnhanced && hasControl && item.openStatus && level > 1}
      id={item.work.id}
      role={isEnhanced ? 'treeitem' : null}
      aria-level={isEnhanced ? level : null}
      aria-setsize={isEnhanced ? setSize : null}
      aria-posinset={isEnhanced ? posInSet : null}
      aria-expanded={
        isEnhanced
          ? item.children && item.children.length > 0
            ? item.openStatus
            : null
          : null
      }
      aria-label={
        isEnhanced
          ? `${item.work.title}${
              item.work.referenceNumber
                ? `, reference number ${item.work.referenceNumber}`
                : ''
            }`
          : null
      }
      aria-selected={isEnhanced ? isSelected : null}
      tabIndex={isEnhanced ? (isSelected ? 0 : -1) : null}
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
                updateTabbing(nextId);
              }
            }

            // When focus is on an end node, does nothing.
            if (item.children && item.children.length === 0) {
              return;
            }

            // When focus is on a closed node, opens the node; focus does not move.
            if (!item.openStatus) {
              toggleBranch();
              updateTabbing(item.work.id);
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
              updateTabbing(item.work.id);
            }
            // When focus is on a child node that is also either an end node or a closed node, moves focus to its parent node.
            // When focus is on a root node that is also either an end node or a closed node, does nothing.
            if (
              isEndNode ||
              !item.openStatus ||
              (item.children && item.children.length === 0) // TODO remove when API updated
            ) {
              if (item.parentId) {
                updateTabbing(item.parentId);
              }
            }
            break;
          }
          case DOWN.includes(key): {
            // Moves focus to the next node that is focusable without opening or closing a node.
            if (nextId) {
              updateTabbing(nextId);
            }
            break;
          }
          case UP.includes(key): {
            // Moves focus to the previous node that is focusable without opening or closing a node.
            if (previousId) {
              updateTabbing(previousId);
            }
            break;
          }
        }
      }}
      onClick={event => {
        event.stopPropagation();
        if (level > 0) {
          toggleBranch();
          updateTabbing(item.work.id);
        }
      }}
    >
      <div className="flex-inline">
        {isEnhanced && level > 1 && hasControl && (
          <TreeControl highlightCondition={highlightCondition}>
            <Icon
              extraClasses={item.openStatus ? '' : 'icon--270'}
              name="chevron"
            />
          </TreeControl>
        )}
        {/* if (currentWorkId === item.work.id) {
                TODO no need for link
              } */}
        <NextLink {...workLink({ id: item.work.id })} scroll={false} passHref>
          <StyledLink
            hideFocus={!isKeyboard}
            tabIndex={isEnhanced ? (isSelected ? 0 : -1) : 0}
            className={classNames({
              [font('hnl', 6)]: true,
            })}
            isCurrent={currentWorkId === item.work.id}
            ref={currentWorkId === item.work.id ? selected : null}
            onClick={event => {
              event.stopPropagation();
              setShowArchiveTree(false);
            }}
            hasControl={hasControl}
          >
            <WorkTitle title={item.work.title} />
            <RefNumber>{item.work.referenceNumber}</RefNumber>
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
          setShowArchiveTree={setShowArchiveTree}
          archiveAncestorArray={archiveAncestorArray}
        />
      )}
    </TreeItem>
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
  setShowArchiveTree,
  archiveAncestorArray,
}: {|
  currentWorkId: string,
  archiveTree: UiTree,
  selected: { current: HTMLElement | null },
  fullTree: UiTree,
  setArchiveTree: UiTree => void,
  level: number,
  tabbableId: ?string,
  setTabbableId: string => void,
  setShowArchiveTree: boolean => void,
  archiveAncestorArray: NodeWork[],
|}) => {
  const { isEnhanced } = useContext(AppContext);
  return (
    <ul
      aria-labelledby={level === 1 && isEnhanced ? 'tree-instructions' : null}
      tabIndex={level === 1 && isEnhanced ? 0 : null}
      role={isEnhanced ? (level === 1 ? 'tree' : 'group') : null}
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
                setShowArchiveTree={setShowArchiveTree}
                archiveAncestorArray={archiveAncestorArray}
              />
            )
          );
        })}
    </ul>
  );
};

const ButtonWrap = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  button {
    width: 100%;
    justify-content: center;
  }
`;

function createBasicTree({
  // Returns a UiTree with the current work (with it's children) and it's ancestors
  // This is all the data we have without making further API calls
  work,
  workId,
}: {|
  work: Work,
  workId: string,
|}): UiTree {
  const ancestorArray = getArchiveAncestorArray(work);
  const partOfReversed = [...ancestorArray, parsePart(work)].reverse();
  return [
    partOfReversed.reduce(
      (acc, curr, i, array) => {
        return {
          openStatus: true,
          work: curr,
          parentId: array[i + 1] && array[i + 1].id,
          children:
            i === 0
              ? work.parts.map(part => ({
                  work: parsePart(part),
                  openStatus: false,
                  parentId: work.partOf[0] && work.partOf[0].id,
                }))
              : [acc],
        };
      },
      {
        openStatus: true,
        work: parsePart(work),
        parentId: work.partOf[0] && work.partOf[0].id,
        children: work.parts.map(part => ({
          work: part,
          children: part.children,
          parentId: work.id,
        })),
      }
    ),
  ];
}

const ArchiveTree = ({ work }: { work: Work }) => {
  const windowSize = useWindowSize();
  const toggles = useContext(TogglesContext);
  const { isEnhanced } = useContext(AppContext);
  const archiveAncestorArray = getArchiveAncestorArray(work);
  const initialLoad = useRef(true);
  const [showArchiveTree, setShowArchiveTree] = useState(false);
  const [archiveTree, setArchiveTree] = useState(
    createBasicTree({ work, workId: work.id })
  );
  const [tabbableId, setTabbableId] = useState(null);
  const openButtonRef = useRef(null);

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

  return isInArchive ? (
    <>
      {windowSize === 'small' && isEnhanced ? (
        <>
          <ButtonWrap>
            <ButtonSolid
              text={'Collection contents'}
              clickHandler={() => setShowArchiveTree(true)}
              aria-controls="collection-contents-modal"
              aria-label="show collection contents"
              icon="tree"
              ref={openButtonRef}
            />
          </ButtonWrap>
          <Modal
            isActive={showArchiveTree}
            setIsActive={setShowArchiveTree}
            id={'collection-contents-modal'}
            openButtonRef={openButtonRef}
          >
            <Tree isEnhanced={isEnhanced}>
              {isEnhanced && (
                <TreeInstructions>{instructions}</TreeInstructions>
              )}
              <NestedList
                selected={selected}
                currentWorkId={work.id}
                fullTree={archiveTree}
                setArchiveTree={setArchiveTree}
                archiveTree={archiveTree}
                level={1}
                tabbableId={tabbableId}
                setTabbableId={setTabbableId}
                setShowArchiveTree={setShowArchiveTree}
                archiveAncestorArray={archiveAncestorArray}
              />
            </Tree>
          </Modal>
        </>
      ) : (
        // <StickyContainer>
        //   <Space
        //     v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
        //     h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
        //     className={classNames({
        //       'flex flex--v-center bg-smoke': true,
        //     })}
        //   >
        //     <Space
        //       as="h2"
        //       h={{ size: 'm', properties: ['margin-right'] }}
        //       className={classNames({
        //         [font('wb', 5)]: true,
        //         'no-margin': true,
        //       })}
        //     >
        //       Collection contents
        //     </Space>
        //     <Icon name="tree" />
        //   </Space>
        //   <StickyContainerInner>
        <Tree isEnhanced={isEnhanced}>
          {isEnhanced && <TreeInstructions>{instructions}</TreeInstructions>}
          <NestedList
            selected={selected}
            currentWorkId={work.id}
            fullTree={archiveTree}
            setArchiveTree={setArchiveTree}
            archiveTree={archiveTree}
            level={1}
            tabbableId={tabbableId}
            setTabbableId={setTabbableId}
            setShowArchiveTree={setShowArchiveTree}
            archiveAncestorArray={archiveAncestorArray}
          />
        </Tree>
        //   </StickyContainerInner>
        // </StickyContainer>
      )}
    </>
  ) : null;
};

export default ArchiveTree;
