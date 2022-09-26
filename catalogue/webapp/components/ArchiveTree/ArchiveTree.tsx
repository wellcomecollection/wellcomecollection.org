import {
  useState,
  useEffect,
  useContext,
  useRef,
  FunctionComponent,
  RefObject,
} from 'react';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import { getWorkClientSide } from '../../services/catalogue/works';
import WorkLink from '@weco/common/views/components/WorkLink/WorkLink';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import Space from '@weco/common/views/components/styled/Space';
import WorkTitle from '../WorkTitle/WorkTitle';
import Icon from '@weco/common/views/components/Icon/Icon';
import { getArchiveAncestorArray } from '../../utils/works';
import { RelatedWork, Work } from '@weco/common/model/catalogue';
import Modal from '@weco/common/views/components/Modal/Modal';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import IsArchiveContext from '../IsArchiveContext/IsArchiveContext';
import { chevron, tree } from '@weco/common/icons';
import { trackEvent } from '@weco/common/utils/ga';

const TreeContainer = styled.div`
  border-right: 1px solid ${props => props.theme.newColor('warmNeutral.400')};
`;

const instructions =
  'Archive Tree: Tab into the tree, then use up and down arrows to move through tree items. Use right and left arrows to toggle sub menus open and closed. When focused on an item you can tab to the link it contains.';
const controlWidth = 44;
const controlHeight = 44;
const circleWidth = 30;
const circleHeight = 30;
const circleBorder = 2;
const verticalGuidePosition =
  controlHeight / 2 + circleHeight / 2 - circleBorder;
const TreeInstructions = styled.p.attrs(() => ({
  'aria-hidden': 'true',
  id: 'tree-instructions',
}))`
  display: none;
`;

const Tree = styled.div<{ isEnhanced?: boolean }>`
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
      background: ${props => props.theme.newColor('yellow')};
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

type TreeItemProps = {
  isEnhanced?: boolean;
  showGuideline?: boolean;
  hideFocus?: boolean;
};

const TreeItem = styled.li.attrs<TreeItemProps>(props => ({
  className: props.showGuideline ? 'guideline' : null,
}))<TreeItemProps>`
  position: relative;
  list-style: ${props => (props.isEnhanced ? 'none' : 'disc')};
  padding: 0;
  &:focus {
    outline: ${props =>
      !props.hideFocus ? `2px solid ${props.theme.newColor('black')}` : 'none'};
  }

  &.guideline::before,
  &.guideline::after {
    content: '';
    position: absolute;
    z-index: 2;
  }

  &.guideline::before {
    border-left: 1px solid ${props => props.theme.newColor('yellow')};
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
    background: ${props => props.theme.newColor('yellow')};
    left: ${`${controlWidth / 2 - 3}px`};
    bottom: ${`${controlHeight / 2}px`};
  }
`;

const TreeControl = styled.span<{ highlightCondition?: string }>`
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
        ? props.theme.newColor('yellow')
        : props.highlightCondition === 'secondary'
        ? props.theme.newColor('lightYellow')
        : props.theme.color('smoke')};
    border: ${props =>
      props.highlightCondition === 'secondary'
        ? `1px solid ${props.theme.newColor('yellow')}`
        : `2px solid ${props.theme.newColor('white')}`};
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

type StyledLinkProps = {
  isCurrent?: boolean;
  hasControl?: boolean;
  hideFocus?: boolean;
};

const StyledLink = styled.a<StyledLinkProps>`
  display: inline-block;
  min-height: ${`${controlHeight}px`};
  line-height: 1;
  color: ${props => props.theme.newColor('black')};
  background: ${props =>
    props.isCurrent ? props.theme.newColor('yellow') : 'transparent'};
  cursor: pointer;
  margin-left: ${props =>
    props.hasControl ? `-${controlWidth / 2}px` : `${controlWidth / 2}px`};
  padding-top: ${props => `${props.theme.spacingUnit}px`};
  padding-bottom: ${props => `${props.theme.spacingUnit}px`};
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

const RefNumber = styled.span.attrs({
  className: font('intr', 6),
})`
  line-height: 1;
  display: block;
  color: ${props => props.theme.newColor('neutral.600')};
  text-decoration: none;
`;

type UiTreeNode = {
  openStatus: boolean;
  work: RelatedWork;
  parentId?: string;
  children?: UiTree;
};

export type UiTree = UiTreeNode[];

export function getTabbableIds(tree: UiTree): string[] {
  return tree.reduce((acc: string[], curr) => {
    acc.push(curr.work.id);
    if (curr.openStatus && curr.children) {
      acc = acc.concat(getTabbableIds(curr.children));
    }
    return acc;
  }, []);
}

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

function createNodeFromWork({
  work,
  openStatus,
}: {
  work: RelatedWork;
  openStatus: boolean;
}): UiTreeNode {
  return {
    openStatus,
    work,
    parentId: work.partOf?.[0]?.id,
    children: work.parts?.map(part => ({
      openStatus: false,
      work: part,
      parentId: work.id,
    })),
  };
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

function createSiblingsArray({
  work,
  openStatusOverride = false,
}: {
  work: RelatedWork;
  openStatusOverride?: boolean;
}): UiTree {
  // An array of the current work and all its siblings
  const siblingsArray = [
    ...(work.precededBy || []).map(item => ({
      openStatus: false,
      work: item,
      parentId: work.partOf?.[0]?.id,
      children: undefined,
    })),
    createNodeFromWork({
      work: {
        ...work,
        totalParts: work.parts && work.parts.length,
      },
      openStatus: !openStatusOverride,
    }),
    ...(work.succeededBy || []).map(item => ({
      openStatus: false,
      work: item,
      parentId: work?.partOf?.[0]?.id,
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
}: {
  tree: UiTree;
  id: string;
  value: UiTreeNode[];
  manualUpdate?: boolean;
}): UiTree {
  return tree.map(item => {
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
  });
}

async function createArchiveTree({
  work,
  archiveAncestorArray,
}: {
  work: RelatedWork;
  archiveAncestorArray: RelatedWork[];
}): Promise<UiTree> {
  const allTreeNodes = [...archiveAncestorArray, work]; // An array of a work and all its ancestors (ancestors first)
  const treeStructure = await allTreeNodes.reduce(
    async (acc, curr, i, ancestorArray) => {
      const parentId = ancestorArray?.[i - 1]?.id;
      // We add each ancestor and its siblings to the tree
      if (!parentId) {
        const siblings = await getSiblings({ id: curr.id });
        return siblings;
      }
      if (work.id === curr.id) {
        // If it's the curr work we have all the information we need to create an array of it and its siblings
        // This becomes the value of its parent node's children property
        const siblings = createSiblingsArray({ work: work });
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
  id,
  openStatusOverride = false,
}: {
  id: string;
  openStatusOverride?: boolean;
}): Promise<UiTreeNode[]> {
  const currWork = await getWorkClientSide(id);
  if (currWork.type !== 'Error' && currWork.type !== 'Redirect') {
    return createSiblingsArray({
      work: {
        ...currWork,
        totalParts: currWork.parts?.length,
      },
      openStatusOverride,
    });
  }
  return [];
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

const LEFT = [37, 'ArrowLeft'];
const RIGHT = [39, 'ArrowRight'];
const DOWN = [40, 'ArrowDown'];
const UP = [38, 'ArrowUp'];

type ListProps = {
  currentWorkId: string;
  selected: RefObject<HTMLAnchorElement>;
  fullTree: UiTree;
  setArchiveTree: (tree: UiTree) => void;
  level: number;
  tabbableId?: string;
  setTabbableId: (id: string) => void;
  setShowArchiveTree: (show: boolean) => void;
  archiveAncestorArray: RelatedWork[];
};

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
  setShowArchiveTree,
  archiveAncestorArray,
}: ListItemProps) => {
  const { isKeyboard, isEnhanced } = useContext(AppContext);
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
      hideFocus={!isKeyboard}
      isEnhanced={isEnhanced}
      showGuideline={isEnhanced && hasControl && item.openStatus && level > 1}
      id={item.work.id}
      role={isEnhanced ? 'treeitem' : undefined}
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
      <div className="flex-inline">
        {isEnhanced && level > 1 && hasControl && (
          <TreeControl
            highlightCondition={highlightCondition}
            onClick={() => {
              trackEvent({
                category: 'ArchiveTree',
                action: 'Chevron clicked',
                label: item.work.id,
              });
            }}
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
            hideFocus={!isKeyboard}
            tabIndex={isEnhanced ? (isSelected ? 0 : -1) : 0}
            isCurrent={currentWorkId === item.work.id}
            ref={currentWorkId === item.work.id ? selected : undefined}
            onClick={event => {
              event.stopPropagation();
              setShowArchiveTree(false);
              trackEvent({
                category: 'ArchiveTree',
                action: 'Link clicked',
                label: item.work.id,
              });
            }}
            hasControl={hasControl}
          >
            <WorkTitle title={item.work.title} />
            <RefNumber>{item.work.referenceNumber}</RefNumber>
          </StyledLink>
        </WorkLink>
      </div>
      {item.children && item.openStatus && (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
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
      className="font-size-5"
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
}: {
  work: Work;
}): UiTree {
  const ancestorArray = getArchiveAncestorArray(work);
  const partOfReversed = [...ancestorArray, work].reverse();
  const rootNode: UiTreeNode = {
    openStatus: true,
    work,
    parentId: work.partOf?.[0]?.id,
    children: work.parts.map(part => ({
      openStatus: false,
      work: part,
      children: [],
      parentId: work.id,
    })),
  };
  return [
    partOfReversed.reduce((acc, curr, i, array) => {
      return {
        openStatus: true,
        work: curr,
        parentId: array[i + 1] && array[i + 1].id,
        children:
          i === 0
            ? work.parts.map(part => ({
                work: part,
                openStatus: false,
                parentId: work.partOf?.[0]?.id,
              }))
            : [acc],
      };
    }, rootNode),
  ];
}

const ArchiveTree: FunctionComponent<{ work: Work }> = ({
  work,
}: {
  work: Work;
}) => {
  const { isEnhanced, windowSize } = useContext(AppContext);
  const archiveAncestorArray = getArchiveAncestorArray(work);
  const initialLoad = useRef(true);
  const [showArchiveTree, setShowArchiveTree] = useState(false);
  const [archiveTree, setArchiveTree] = useState(createBasicTree({ work }));
  const [tabbableId, setTabbableId] = useState<string>();
  const openButtonRef = useRef(null);
  const isArchive = useContext(IsArchiveContext);

  useEffect(() => {
    const elementToFocus = tabbableId && document.getElementById(tabbableId);
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }, [archiveTree, tabbableId]);

  const selected = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    async function setupTree() {
      const tree = await createArchiveTree({
        work,
        archiveAncestorArray,
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

  return isArchive ? (
    <>
      {windowSize === 'small' && isEnhanced ? (
        <>
          <ButtonWrap>
            <ButtonSolid
              text="Collection contents"
              clickHandler={() => setShowArchiveTree(true)}
              aria-controls="collection-contents-modal"
              aria-label="show collection contents"
              icon={tree}
              ref={openButtonRef}
            />
          </ButtonWrap>
          <Modal
            isActive={showArchiveTree}
            setIsActive={setShowArchiveTree}
            id="collection-contents-modal"
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
        <TreeContainer>
          <Space
            v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
          >
            <h2 className={font('wb', 4)}>Collection contents</h2>
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
          </Space>
        </TreeContainer>
      )}
    </>
  ) : null;
};

export default ArchiveTree;
