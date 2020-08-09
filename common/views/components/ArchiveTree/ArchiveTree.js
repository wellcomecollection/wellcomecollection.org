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

const Container = styled.div`
  overflow: scroll;
  scroll-behavior: smooth;
  height: 70vh;
`;

const StyledLink = styled.a`
  display: inline-block;
  background: ${props =>
    props.isCurrent ? props.theme.colors.yellow : 'transparent'};
  font-weight: ${props => (props.isCurrent ? 'bold' : 'normal')};
  border-color: ${props =>
    props.isCurrent ? props.theme.colors.green : 'transparent'};
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
      border-top: 2px solid #006272;
      top: 20px;
      width: 22px;
      height: 0;
    }

    li::after {
      border-left: 2px solid #006272;
      height: 100%;
      width: 0px;
      top: 10px;
    }

    li:last-child::after {
      height: 10px;
    }
  }
`;

function createWorkNodeFromWork(work) {
  return {
    id: work.id,
    title: work.title,
    alternativeTitles: work.alternativeTitles,
    referenceNumber: work.referenceNumber,
  };
}

function createSiblingsArray(work) {
  return [
    ...work.precededBy.map(item => ({
      openByDefault: false,
      work: item,
    })),
    {
      openByDefault: false,
      work: createWorkNodeFromWork(work),
      children: work.parts.map(part => ({
        openByDefault: false,
        work: part,
        children: part.children,
      })),
    },
    ...work.succeededBy.map(item => ({
      openByDefault: false,
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
          openByDefault: true,
          work: curr,
          children: i === 0 ? createSiblingsArray(work) : [acc],
        };
      },
      {
        openByDefault: true,
        work: createWorkNodeFromWork(work),
        children: work.parts.map(part => ({
          openByDefault: false,
          work: part,
          children: part.children,
        })),
      }
    ),
  ];
}

function addWorkPartsToCollectionTree(work, collectionTree, openByDefault) {
  return collectionTree.map(node => {
    if (node.work.id !== work.id && !node.children) return node;
    if (node.work.id !== work.id && node.children) {
      return {
        openByDefault,
        ...node,
        children: addWorkPartsToCollectionTree(work, node.children),
      };
    }
    if (node.work.id === work.id && !node.children) {
      if (work.parts && work.parts.length > 0) {
        return {
          openByDefault,
          ...node,
          children: work.parts.map(part => ({
            work: part,
          })),
        };
      } else {
        return {
          openByDefault,
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
    true
  );
  /* Until we can tell if there are children from the API, we need to do the following
  and not just setCollectionTree(newTree) */
  const partsPromises = selectedWork.parts.map(part =>
    getWork({ id: part.id, toggles })
  );
  if (partsPromises.length > 0) {
    Promise.all(partsPromises).then(works => {
      let updatedTree;
      works.forEach(work => {
        const tempTree = addWorkPartsToCollectionTree(
          work,
          updatedTree || newTree,
          false
        );
        updatedTree = tempTree;
      });
      setCollectionTree(updatedTree);
    });
  }
}

type Work = {|
  // TODO import this and make it work everywhere
  id: string,
  title: string,
  alternativeTitles: [],
  type: 'Work',
  partOf: ArchiveNode[],
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
  collectionTree,
  isRootItem,
}: ListItemType) => {
  const [showNested, setShowNested] = useState(item.openByDefault || false);
  return (
    <li>
      <div style={{ padding: '10px 10px 30px' }}>
        <TogglesContext.Consumer>
          {toggles => (
            <>
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
                  {item.work.title}
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
              {!isRootItem && item.children && (
                <ButtonOutlined
                  icon={showNested ? 'minus' : 'plus'}
                  text={`${showNested}`}
                  isTextHidden={false}
                  clickHandler={() => {
                    if (!item.children) {
                      expandTree(
                        item.work.id,
                        toggles,
                        setCollectionTree,
                        fullTree
                      );
                    } else {
                      setShowNested(!showNested);
                    }
                  }}
                />
              )}
            </>
          )}
        </TogglesContext.Consumer>
        {item.children && showNested && (
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
        behaviour: 'smooth',
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

  useEffect(() => {
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
    }
  }, [work]);

  return (
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
        <Container>
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
        </Container>
      </Modal>
    </>
  );
};
export default ArchiveTree;
