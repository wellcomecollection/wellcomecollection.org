import { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { classNames } from '@weco/common/utils/classnames';
import { getWork } from '@weco/catalogue/services/catalogue/works';
import { workLink } from '@weco/common/services/catalogue/routes';
import { ArchiveNode } from '@weco/common/utils/works';
import NextLink from 'next/link';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import Space from '../styled/Space';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import Modal from '@weco/common/views/components/Modal/Modal';
import WorkTitle from '@weco/common/views/components/WorkTitle/WorkTitle';

const Container = styled.div`
  overflow: scroll;
  height: ${props => (props.fixHeight ? '70vh' : 'auto')};
  border: 1px solid ${props => props.theme.color('pumice')};
  border-radius: 6px;
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
    padding-left: 62px;

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

function updateDefaultOpenStatus(id, fullTree, defaultValue) {
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

function createWorkPropertyFromWork(work) {
  return {
    id: work.id,
    title: work.title,
    alternativeTitles: work.alternativeTitles,
    referenceNumber: work.referenceNumber,
  };
}

function createNodeFromWork(work, openStatus) {
  return {
    openStatus,
    work: createWorkPropertyFromWork(work),
    children: work.parts.map(part => ({
      openStatus: false,
      work: part,
      children: part.children,
    })),
  };
}

function createSiblingsArray(work) {
  return [
    ...work.precededBy.map(item => ({
      openStatus: false,
      work: item,
    })),
    {
      ...createNodeFromWork(work, false),
    },
    ...work.succeededBy.map(item => ({
      openStatus: false,
      work: item,
    })),
  ];
}

function createCollectionTree(work) {
  const partOfReversed = [...work.partOf].reverse();
  return [
    partOfReversed.reduce(
      (acc, curr, i) => {
        return {
          openStatus: true,
          work: curr,
          children: i === 0 ? createSiblingsArray(work) : [acc],
        };
      },
      // Need this for a top level work that has an empty partOf array
      // Otherwise it gets replace by createSiblingsArray above, which also includes the siblings of the current work
      {
        ...createNodeFromWork(work, true),
      }
    ),
  ];
}

function addWorkPartsToCollectionTree(
  work,
  collectionTree,
  openStatus,
  manualTreeExpansion
) {
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
        children: addWorkPartsToCollectionTree(
          work,
          node.children,
          false,
          manualTreeExpansion
        ),
      };
    }
    if (node.work.id === work.id && !node.children) {
      if (work.parts && work.parts.length > 0) {
        return {
          ...node,
          openStatus: manualTreeExpansion || openStatus,
          children: work.parts.map(part => ({
            work: part,
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
      const mergedChildren = work.parts.map(part => {
        const matchingItem =
          node.children &&
          node.children.find(currentChild => part.id === currentChild.work.id);
        if (
          matchingItem &&
          matchingItem.children &&
          matchingItem.children.length > 0
        ) {
          return matchingItem;
        } else {
          return {
            work: part,
          };
        }
      });
      return {
        ...node,
        children: mergedChildren,
      };
    }
  });
}

async function expandTree(workId, toggles, setCollectionTree, collectionTree) {
  const selectedWork = await getWork({ id: workId, toggles });
  const newTree = addWorkPartsToCollectionTree(
    selectedWork,
    collectionTree,
    true,
    true
  );
  setCollectionTree(newTree);
}

type Work = {|
  // TODO import this and make it work everywhere
  id: string,
  title: string,
  alternativeTitles: [],
  type: 'Work',
  partOf: ArchiveNode[],
  parts: ArchiveNode[],
|};
type NestedListProps = {|
  currentWorkId: string,
  collectionTree: ArchiveNode[],
  selected: { current: HTMLElement | null },
  setShowArchiveTreeModal: boolean => void,
  fullTree: ArchiveNode[],
  setCollectionTree: boolean => void,
  isTopLevel: boolean,
|};

type ListItemType = {|
  item: ArchiveNode,
  setShowArchiveTreeModal: boolean => void,
  currentWorkId: string,
  selected: { current: HTMLElement | null },
  setCollectionTree: boolean => void,
  fullTree: ArchiveNode[],
  collectionTree: ArchiveNode[],
  isRootItem: boolean,
|};

const ListItem = ({
  item,
  setShowArchiveTreeModal,
  currentWorkId,
  selected,
  setCollectionTree,
  fullTree,
  isRootItem,
}: ListItemType) => {
  const [showButton, setShowButton] = useState(item.children);
  const toggles = useContext(TogglesContext);
  useEffect(() => {
    let isMounted = true;
    const checkForChildren = async () => {
      const selectedWork = await getWork({ id: item.work.id, toggles });
      if (isMounted) {
        setShowButton(selectedWork.parts && selectedWork.parts.length > 0);
      }
    };
    checkForChildren();
    return () => (isMounted = false);
  }, []);
  return (
    <li>
      <div style={{ padding: '10px 10px 30px' }}>
        <TogglesContext.Consumer>
          {toggles => (
            <div style={{ whiteSpace: 'nowrap' }}>
              <NextLink
                {...workLink({ id: item.work.id })}
                scroll={false}
                passHref
              >
                <StyledLink
                  isCurrent={currentWorkId === item.work.id}
                  ref={currentWorkId === item.work.id ? selected : null}
                  onClick={() => {
                    setShowArchiveTreeModal(false);
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
              {!isRootItem && (
                <Space
                  className="inline-block"
                  h={{ size: 'm', properties: ['margin-left'] }}
                  style={{
                    position: 'absolute',
                    zoom: '0.7',
                    display: showButton ? 'inline-block' : 'none',
                  }}
                >
                  <ButtonOutlined
                    icon={item.openStatus ? 'minus' : 'plus'}
                    text={item.openStatus ? 'hide children' : 'show children'}
                    isTextHidden={true}
                    clickHandler={() => {
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
                  />
                </Space>
              )}
            </div>
          )}
        </TogglesContext.Consumer>
        {item.children && item.openStatus && (
          <NestedList
            selected={selected}
            currentWorkId={currentWorkId}
            collectionTree={item.children}
            setShowArchiveTreeModal={setShowArchiveTreeModal}
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
  setShowArchiveTreeModal,
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
                setShowArchiveTreeModal={setShowArchiveTreeModal}
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

function centerTree(selected) {
  setTimeout(function() {
    if (selected?.current) {
      selected.current.scrollIntoView({
        block: 'center',
        inline: 'center',
      });
    } else {
      centerTree();
    }
  }, 10);
}

const ArchiveTree = ({ work }: { work: Work }) => {
  const toggles = useContext(TogglesContext);
  const [showArchiveTreeModal, setShowArchiveTreeModal] = useState(false);
  const [collectionTree, setCollectionTree] = useState(
    createCollectionTree(work) || []
  );
  const selected = useRef(null);
  const isInArchive = work.parts.length > 0 || work.partOf.length > 0;

  const TreeView = () => (
    <Tree>
      <NestedList
        selected={selected}
        currentWorkId={work.id}
        fullTree={collectionTree}
        setCollectionTree={setCollectionTree}
        collectionTree={collectionTree}
        setShowArchiveTreeModal={setShowArchiveTreeModal}
        isTopLevel={true}
      />
    </Tree>
  );

  useEffect(() => {
    // Add siblings to each node, that leads to the current work
    const basicTree = createCollectionTree(work);
    const partOfPromises = work.partOf.map(part =>
      getWork({ id: part.id, toggles })
    );
    if (partOfPromises.length > 0) {
      Promise.all(partOfPromises).then(works => {
        let updatedTree;
        works.forEach(work => {
          const tempTree = addWorkPartsToCollectionTree(
            work,
            updatedTree || basicTree,
            false
          );
          updatedTree = tempTree;
        });
        setCollectionTree(updatedTree);
      });
    } else {
      setCollectionTree(basicTree);
    }
  }, []);

  return (
    isInArchive &&
    (toggles.archivesPrototypeSidePanel ? (
      <Container>
        <TreeView />
      </Container>
    ) : (
      <>
        <Space
          className="inline-block"
          h={{ size: 'm', properties: ['margin-right'] }}
          v={{ size: 'm', properties: ['margin-top'] }}
        >
          <ButtonSolid
            icon="tree"
            text={`${work.title} contents`}
            isTextHidden={true}
            clickHandler={() => {
              setShowArchiveTreeModal(!showArchiveTreeModal);
              centerTree(selected);
            }}
          />
        </Space>
        <Modal
          isActive={showArchiveTreeModal}
          setIsActive={setShowArchiveTreeModal}
          width="98vw"
        >
          {' '}
          <Container fixHeight={true}>
            <TreeView />
          </Container>
        </Modal>
      </>
    ))
  );
};
export default ArchiveTree;
