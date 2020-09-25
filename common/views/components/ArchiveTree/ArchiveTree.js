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
  parsePartOf,
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

const Tree = styled.div`
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
  children: ?UiTree,
|};

type UiTree = UiTreeNode[];

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
    work: parsePartOf(work),
    children:
      work.parts &&
      work.parts.map(part => ({
        openStatus: false,
        work: parsePartOf(part),
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
        children: work.parts
          ? work.parts.map(part => ({
              work: parsePartOf(part),
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
  openStatusOverride: boolean,
}): Promise<UiTree> {
  // An array of the current work and all it's siblings
  const siblingsArray = [
    ...(work.precededBy || []).map(item => ({
      openStatus: false,
      work: parsePartOf(item),
      children: undefined,
    })),
    {
      ...createNodeFromWork({
        work,
        openStatus: openStatusOverride ? false : !(workId === work.id),
      }),
    },
    ...(work.succeededBy || []).map(item => ({
      openStatus: false,
      work: parsePartOf(item),
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
  const treeStructure = await [
    ...archiveAncestorArray,
    parsePartOf(work),
  ].reduce(async (accP, curr, i, ancestorArray) => {
    const acc = await accP;
    const siblings =
      (await getSiblings({ id: curr.id, toggles, workId: work.id })) || [];
    if (i === 0) {
      return siblings;
    } else {
      const idOfObjectToUpdate = ancestorArray[i - 1].id;
      // TODO comment
      return updateChildren({
        array: acc,
        id: idOfObjectToUpdate,
        value: siblings,
      });
    }
  }, Promise.resolve([]));
  return treeStructure;
}

async function getSiblings({
  // TODO rename workId? viewedWorkId
  id, // id of work to get
  toggles,
  workId, // current Work being viewed
  openStatusOverride = false,
}: {|
  id: string,
  toggles: Toggles,
  workId: string,
  openStatusOverride?: boolean,
|}): Promise<UiTreeNode[]> {
  const currWork = await getWork({ id, toggles });
  const siblings = await createSiblingsArray({
    work: currWork,
    toggles,
    workId,
    openStatusOverride,
  });
  return siblings;
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
  // TODO  child get siblings of work child
  const firstChild = item.children && item.children[0];
  const siblings = firstChild
    ? await getSiblings({
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
  isTopLevel,
}: {|
  item: UiTreeNode,
  currentWorkId: string,
  selected: { current: HTMLElement | null },
  setArchiveTree: UiTree => void,
  fullTree: UiTree,
  isTopLevel: boolean,
|}) => {
  return (
    <li>
      <div style={{ padding: '10px 10px 10px 0' }}>
        <TogglesContext.Consumer>
          {toggles => (
            <div style={{ whiteSpace: 'nowrap' }}>
              {!isTopLevel && (
                <Space
                  className="inline-block"
                  h={{ size: 's', properties: ['margin-right'] }}
                  style={{
                    verticalAlign: 'top',
                    display:
                      item.children && item.children.length > 0
                        ? 'inline-block'
                        : 'none',
                  }}
                >
                  <button
                    className={classNames({
                      'plain-button': true,
                    })}
                    style={{
                      fontSize: '10px',
                      height: '18px',
                      width: '18px',
                      padding: '0',
                      background: '#ccc',
                      position: 'relative',
                      top: '-2px',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
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
                    }}
                  >
                    <Icon
                      extraClasses="icon--match-text"
                      name={item.openStatus ? 'minus' : 'plus'}
                    />
                  </button>
                </Space>
              )}
              <NextLink
                {...workLink({ id: item.work.id })}
                scroll={false}
                passHref
              >
                <StyledLink
                  className={classNames({
                    [font('hnl', 6)]: true,
                  })}
                  isCurrent={currentWorkId === item.work.id}
                  ref={currentWorkId === item.work.id ? selected : null}
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
          )}
        </TogglesContext.Consumer>
        {item.children && item.openStatus && (
          <NestedList
            selected={selected}
            currentWorkId={currentWorkId}
            archiveTree={item.children}
            fullTree={fullTree}
            setArchiveTree={setArchiveTree}
            isTopLevel={false}
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
  isTopLevel,
}: {|
  currentWorkId: string,
  archiveTree: UiTree,
  selected: { current: HTMLElement | null },
  fullTree: UiTree,
  setArchiveTree: UiTree => void,
  isTopLevel: boolean,
|}) => {
  return (
    <ul
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
                isTopLevel={isTopLevel}
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
    <Tree>
      <NestedList
        selected={selected}
        currentWorkId={work.id}
        fullTree={archiveTree}
        setArchiveTree={setArchiveTree}
        archiveTree={archiveTree}
        isTopLevel={true}
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
