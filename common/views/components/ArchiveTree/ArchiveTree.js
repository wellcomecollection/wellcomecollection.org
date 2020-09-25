// @flow

import { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import { getWork } from '@weco/catalogue/services/catalogue/works';
import { workLink } from '@weco/common/services/catalogue/routes';
import NextLink from 'next/link';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import Space from '../styled/Space';
// $FlowFixMe (tsx)
import WorkTitle from '@weco/common/views/components/WorkTitle/WorkTitle';
import Icon from '@weco/common/views/components/Icon/Icon';
import {
  getArchiveAncestorArray,
  type ArchiveNode,
} from '@weco/common/utils/works';

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

type Work = {|
  // TODO import this and make it work everywhere
  referenceNumber?: string,
  id: string,
  title: string,
  alternativeTitles: string[],
  type: 'Work',
  partOf?: [],
  parts?: [],
  precededBy?: [],
  succeededBy?: [],
|};

type UiTree = {|
  openStatus: boolean,
  work: ArchiveNode,
  children?: UiTree[],
|};

type NestedListProps = {|
  currentWorkId: string,
  collectionTree: UiTree[],
  selected: { current: HTMLElement | null },
  fullTree: UiTree[],
  setCollectionTree: (UiTree[]) => void,
  isTopLevel: boolean,
|};

type ListItemType = {|
  item: UiTree,
  currentWorkId: string,
  selected: { current: HTMLElement | null },
  setCollectionTree: (UiTree[]) => void,
  fullTree: UiTree[],
  isRootItem: boolean,
|};

function updateOpenStatus(
  id: string,
  fullTree: UiTree[],
  defaultValue: boolean
): UiTree[] {
  const newTree = fullTree.map(node => {
    if (node.work.id === id) {
      return {
        ...node,
        openStatus: defaultValue,
      };
    } else if (node.work.id !== id && node.children) {
      return {
        ...node,
        children: updateOpenStatus(id, node.children, defaultValue),
      };
    } else {
      return node;
    }
  });
  return newTree;
}

function createWorkPropertyFromWork(work: Work) {
  return {
    id: work.id,
    title: work.title,
    alternativeTitles: work.alternativeTitles,
    referenceNumber: work.referenceNumber,
    type: work.type,
  };
}

function createNodeFromWork({
  work,
  openStatus,
}: {
  work: Work,
  openStatus: boolean,
}): UiTree {
  return {
    openStatus,
    work: createWorkPropertyFromWork(work),
    children:
      work.parts &&
      work.parts.map(part => ({
        openStatus: false,
        work: createWorkPropertyFromWork(part),
        children: part.children,
      })),
  };
}

const addChildren = async (item, toggles) => {
  const work = await getWork({ id: item.work.id, toggles });
  return !item.children
    ? {
        openStatus: false,
        work: item.work,
        children: work.parts
          ? work.parts.map(part => ({
              work: createWorkPropertyFromWork(part),
              openStatus: false,
            }))
          : [],
      }
    : Promise.resolve(item);
};

async function createSiblingsArray(
  work: Work,
  toggles,
  workId,
  openOverride
): ?(UiTree[]) {
  // An array of the current work and all it's siblings
  const siblingsArray = [
    ...(work.precededBy || []).map(item => ({
      openStatus: false,
      work: createWorkPropertyFromWork(item),
    })),
    {
      ...createNodeFromWork({
        work,
        openStatus: openOverride ? false : !(workId === work.id),
      }),
    },
    ...(work.succeededBy || []).map(item => ({
      openStatus: false,
      work: createWorkPropertyFromWork(item),
    })),
  ];

  // Adding the children of each of the works in the siblingsArray
  const siblingsArrayWithChildren = await Promise.all(
    siblingsArray.map(item => addChildren(item, toggles))
  );

  return siblingsArrayWithChildren;
}

type Temp = {|
  work: Work,
  archiveAncestorArray: ArchiveNode[],
  toggles: any, // TODO
|};

// TODO type
function updateChildren({
  array,
  id,
  value,
  manualUpdate = false,
}: {|
  array: [], // TODO
  id: string,
  value: [], // TODO
  manualUpdate?: boolean,
|}) {
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
          children: updateChildren({
            array: item.children,
            id,
            value,
            manualUpdate,
          }),
        };
      }
    })
  );
}

async function createArchiveTree({
  work,
  archiveAncestorArray,
  toggles,
}: Temp): ?any {
  // UiTree[]
  const treeStructure = await [
    ...archiveAncestorArray,
    createWorkPropertyFromWork(work),
  ].reduce(async (accP, curr, i, ancestorArray) => {
    const acc = (await accP) || [];
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

async function getSiblings({ id, toggles, workId, openOverride }) {
  const currWork = await getWork({ id, toggles });
  const siblings = await createSiblingsArray(
    currWork,
    toggles,
    workId,
    openOverride
  );
  return siblings;
}

async function expandTree({
  item,
  toggles,
  setCollectionTree,
  collectionTree,
}) {
  // TODO  child get siblings of work child
  const firstChild = item.children && item.children[0];
  const siblings = firstChild
    ? await getSiblings({
        id: firstChild.work.id,
        toggles,
        workId: null,
        openOverride: true,
      })
    : [];
  setCollectionTree(
    updateChildren({
      array: collectionTree,
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
  setCollectionTree,
  fullTree,
  isRootItem,
}: ListItemType) => {
  return (
    <li>
      <div style={{ padding: '10px 10px 10px 0' }}>
        <TogglesContext.Consumer>
          {toggles => (
            <div style={{ whiteSpace: 'nowrap' }}>
              {!isRootItem && (
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
                          setCollectionTree,
                          collectionTree: fullTree,
                        });
                      } else {
                        setCollectionTree(
                          updateOpenStatus(
                            item.work.id,
                            fullTree,
                            !item.openStatus
                          )
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
            collectionTree={item.children}
            fullTree={fullTree}
            setCollectionTree={setCollectionTree}
            isTopLevel={false}
          />
        )}
      </div>
    </li>
  );
};

const NestedList = ({
  currentWorkId,
  collectionTree,
  selected,
  fullTree,
  setCollectionTree,
  isTopLevel,
}: NestedListProps) => {
  return (
    <ul
      className={classNames({
        'font-size-5': true,
      })}
    >
      {collectionTree &&
        collectionTree.map((item, i) => {
          return (
            item.work && (
              <ListItem
                key={item.work.id}
                item={item}
                currentWorkId={currentWorkId}
                selected={selected}
                fullTree={fullTree}
                setCollectionTree={setCollectionTree}
                isRootItem={isTopLevel && i === 0}
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
  const [collectionTree, setCollectionTree] = useState([]);
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
      setCollectionTree(tree || []);
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
        fullTree={collectionTree}
        setCollectionTree={setCollectionTree}
        collectionTree={collectionTree}
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
