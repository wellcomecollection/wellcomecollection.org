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

function updateDefaultOpenStatus(
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
        children: updateDefaultOpenStatus(id, node.children, defaultValue),
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

const anAsyncFunction = async (item, toggles) => {
  const work = await getWork({ id: item.work.id, toggles });
  return !item.children
    ? {
        openStatus: false,
        work: item.work,
        children: work.parts.map(part => ({
          work: part,
          openStatus: false,
        })),
      }
    : Promise.resolve(item);
};

async function createSiblingsArray(work: Work, toggles): ?(UiTree[]) {
  // An array of the current work and all it's siblings
  const siblingsArray = [
    ...(work.precededBy || []).map(item => ({
      openStatus: false,
      work: createWorkPropertyFromWork(item),
    })),
    {
      ...createNodeFromWork({ work, openStatus: false }),
    },
    ...(work.succeededBy || []).map(item => ({
      openStatus: false,
      work: createWorkPropertyFromWork(item),
    })),
  ];

  // Adding the children of each of the works in the siblingsArray
  const siblingsArrayWithChildren = await Promise.all(
    siblingsArray.map(item => anAsyncFunction(item, toggles))
  );

  return siblingsArrayWithChildren;
}

type Temp = {|
  work: Work,
  archiveAncestorArray: ArchiveNode[],
  toggles: any, // TODO
|};

async function createArchiveTree({
  work,
  archiveAncestorArray,
  toggles,
}: Temp): ?any {
  // UiTree[]
  const partOfReversed = [...(archiveAncestorArray || [])].reverse();
  // TODO don't reverse?
  // top level item just return,
  // next create a siblings array
  // and make it child of one above
  const treeStructure = await partOfReversed.reduce(
    async (accP, curr, i) => {
      // TODO need to createSiblings array for each of these acc
      const acc = await accP;
      if (i === 0) {
        return [
          // will this work for top level?
          {
            openStatus: true,
            work: curr,
            children: await createSiblingsArray(work, toggles), // If it's the immediate parent, i.e. the first item in the array, we create an array of the current work and it's siblings to be its children.
          },
        ];
      } else {
        // TODO return sibling array, but want to return acc as children of nodes that are on the ancestorArray
        const siblings = await createSiblingsArray(curr, toggles);
        console.log(siblings);
        return [
          {
            openStatus: true,
            work: curr,
            children: acc, // If it's the immediate parent we create an array of the current work and it's siblings to be the children.
          },
        ];
      }
    },
    // We only need the following for a top level work that has an empty partOf array,
    // in which case this is all that gets returned.
    // Otherwise it gets replace as part of the createSiblingsArray above,
    // which also includes the siblings of the current work.
    createNodeFromWork({ work, openStatus: true })
  );
  return treeStructure;
}

function addWorkPartsToCollectionTree({
  work,
  collectionTree,
  openStatus,
  manualTreeExpansion,
}: {|
  work: any, // FIXME: don't know how to have Work here and not have Flow complain about a Promise
  collectionTree: UiTree[],
  openStatus: boolean,
  manualTreeExpansion: boolean,
|}): any[] {
  // FIXME: I want this to be UiTree[] but Flow's telling me collectionTree is an inexact array type
  return collectionTree.map(node => {
    if (node.work.id !== work.id && !node.children) {
      return {
        openStatus,
        ...node,
      };
    }
    if (node.work.id !== work.id && node.children) {
      return {
        openStatus,
        ...node,
        children: addWorkPartsToCollectionTree({
          work, // FIXME: don't know how to have Work here and not have Flow complain about a Promise
          collectionTree: node.children,
          openStatus: false,
          manualTreeExpansion: manualTreeExpansion,
        }),
      };
    }
    if (node.work.id === work.id && !node.children) {
      if (work.parts && work.parts.length > 0) {
        return {
          ...node,
          openStatus: manualTreeExpansion || openStatus,
          children: work.parts.map(part => ({
            work: part,
            openStatus: false,
          })),
        };
      } else {
        return {
          ...node,
        };
      }
    }
    if (node.work.id === work.id && node.children) {
      // don't want to overwrite anything that is already there
      const mergedChildren =
        work.parts &&
        work.parts.map(part => {
          const matchingItem =
            node.children &&
            node.children.find(
              currentChild => part.id === currentChild.work.id
            );
          if (
            matchingItem &&
            matchingItem.children &&
            matchingItem.children.length > 0
          ) {
            return matchingItem;
          } else {
            return {
              work: part,
              openStatus: false,
            };
          }
        });
      return {
        ...node,
        children: mergedChildren,
      };
    }

    return collectionTree;
  });
}

async function expandTree(workId, toggles, setCollectionTree, collectionTree) {
  const selectedWork = await getWork({ id: workId, toggles });
  const newTree = addWorkPartsToCollectionTree({
    work: createWorkPropertyFromWork(selectedWork),
    collectionTree,
    openStatus: true,
    manualTreeExpansion: true,
  });
  setCollectionTree(newTree);
}

const ListItem = ({
  item,
  currentWorkId,
  selected,
  setCollectionTree,
  fullTree,
  isRootItem,
}: ListItemType) => {
  // const [showButton, setShowButton] = useState(
  //   item.children && item.children.length > 0
  // );
  // const toggles = useContext(TogglesContext);
  // useEffect(() => { // if already has children don't do anything
  //   let isMounted = true;
  //   const checkForChildren = async () => {
  //     const selectedWork = await getWork({ id: item.work.id, toggles });
  //     if (isMounted) {
  //       setShowButton(selectedWork.parts && selectedWork.parts.length > 0); // update collectionTree instead
  //     }
  //   };
  //   checkForChildren();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);
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
                      if (!item.children) {
                        expandTree(
                          item.work.id,
                          toggles,
                          setCollectionTree,
                          fullTree
                        );
                      } else {
                        setCollectionTree(
                          updateDefaultOpenStatus(
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
  // const initialLoad = useRef(true);
  const [collectionTree, setCollectionTree] = useState([]);
  const selected = useRef(null);
  const isInArchive =
    (work.parts && work.parts.length > 0) ||
    (work.partOf && work.partOf.length > 0);

  // useEffect(() => {
  //   console.log('tree changed');
  // }, [collectionTree]);

  useEffect(() => {
    // if (!initialLoad.current) {
    async function setupTree() {
      const tree = await createArchiveTree({
        work,
        archiveAncestorArray,
        toggles,
      });
      setCollectionTree(tree || []);
    }
    setupTree();
    // }
    // initialLoad.current = false;
  }, []);

  //   initialLoad.current = false;
  // }, [work]);

  //     if (workInfo) {
  //       window.requestAnimationFrame(() => {
  //         workInfo.scrollIntoView({ behavior: 'smooth' });
  //       });
  //     }
  //   }

  //   initialLoad.current = false;
  // }, [work.id]);

  // useEffect(() => {
  //   // TODO add children here too
  //   // Add siblings to each of the nodes that leads to the current work
  //   const partOfPromises = archiveAncestorArray
  //     ? archiveAncestorArray.map(part => getWork({ id: part.id, toggles }))
  //     : [];
  //   if (partOfPromises.length > 0) {
  //     Promise.all(partOfPromises).then(works => {
  //       let updatedTree;

  //       works.forEach(work => {
  //         const tempTree = addWorkPartsToCollectionTree({
  //           work: work,
  //           collectionTree: updatedTree || collectionTree,
  //           openStatus: false,
  //           manualTreeExpansion: false,
  //         });
  //         updatedTree = tempTree;
  //       });
  //       if (updatedTree) {
  //         setCollectionTree(updatedTree);
  //       }
  //     });
  //   }
  // }, [work]);

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
    <>
      <pre
        style={{
          maxWidth: '600px',
          margin: '0 auto 24px',
          fontSize: '14px',
        }}
      >
        <code
          style={{
            display: 'block',
            padding: '24px',
            backgroundColor: '#EFE1AA',
            color: '#000',
            border: '4px solid #000',
            borderRadius: '6px',
          }}
        >
          {JSON.stringify(collectionTree, null, 1)}
        </code>
      </pre>
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
    </>
  ) : null;
};

export default ArchiveTree;
