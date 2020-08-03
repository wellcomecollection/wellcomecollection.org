import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { classNames } from '@weco/common/utils/classnames';
import { getWork } from '@weco/catalogue/services/catalogue/works';
import { type Collection, getTreeBranches } from '@weco/common/utils/works';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { type Toggles } from '@weco/catalogue/services/catalogue/common';
import Space from '../styled/Space';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Modal from '@weco/common/views/components/Modal/Modal';

function useOnScreen({ ref, root = null, rootMargin = '0px', threshold = 0 }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
}

const Container = styled.div`
  overflow: scroll;
  height: 70vh;
`;

const StyledLink = styled.a`
  display: inline-block;
  background: ${props => (props.isCurrent ? '#ffce3c' : 'transparent')};
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

type Work = {|
  // TODO import this and make it work everywhere
  id: string,
  title: string,
  alternativeTitles: [],
  type: 'Work',
|};
type NestedListProps = {|
  collection: Collection[],
  collectionChildren: Collection[],
  currentWorkId: string,
  setCollection: (Collection[]) => void,
|};

function updateCollection(
  collection,
  currentWorkPath,
  currentBranchWithChildren
) {
  const collectionCopy = Object.assign({}, collection);
  for (const property in collectionCopy) {
    if (property === 'children') {
      for (const child of collectionCopy[property]) {
        if (currentWorkPath.includes(child.path.path)) {
          if (child.path.path === currentWorkPath) {
            child.children = currentBranchWithChildren.children;
          } else {
            updateCollection(child, currentWorkPath, currentBranchWithChildren);
          }
        }
      }
    }
  }
  return collectionCopy;
}

type WorkLinkType = {|
  item: Collection,
  currentWorkId: string,
  collection: Collection[],
  setCollection: Collection => void,
  toggles: Toggles,
|};

const WorkLink = ({
  item,
  currentWorkId,
  collection,
  setCollection,
  toggles,
}: WorkLinkType) => {
  const ref = useRef();
  const isOnScreen = useOnScreen({
    ref: ref,
    threshold: [0],
  });

  const fetchAndUpdateCollection = async id => {
    if (item.path.level === 'Item') return;
    // find the current branch
    const currentBranch = getTreeBranches(item.path.path, collection)[0];
    // check for children
    if (!currentBranch.children) {
      // if no children then get collection tree for work
      const currentWork = await getWork({ id, toggles });
      const newCollection = currentWork.collection;
      const currentBranchWithChildren = getTreeBranches(
        item.path.path,
        newCollection
      )[0];
      const updatedCollection = updateCollection(
        collection,
        item.path.path,
        currentBranchWithChildren
      );
      setCollection(updatedCollection);
    }
  };
  useEffect(() => {
    if (isOnScreen) {
      fetchAndUpdateCollection(item.work.id);
    }
  }, [isOnScreen]);

  return (
    <StyledLink
      style={{
        whiteSpace: 'nowrap',
        display: 'inline-block',
        color: 'black',
      }}
      ref={ref}
      href={`/works/${item.work.id}`}
      isCurrent={currentWorkId === item.work.id}
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
        {item.path.label}
      </div>
    </StyledLink>
  );
};

function createHierarchy(work) {
  return work.partOf.reverse().reduce((acc, curr, i, src) => {
    return {
      work: curr,
      children:
        i === 0
          ? [
              ...work.precededBy.map(item => ({
                work: item,
                children: [],
              })),
              {
                work: {
                  id: work.id,
                  title: work.title,
                  alternativeTitles: work.alternativeTitles,
                  referenceNumber: work.referenceNumber,
                },
                children: work.parts,
              },
              ...work.succeededBy.map(item => ({
                work: item,
                children: [],
              })),
            ]
          : [acc],
    };
  }, {});
}

const NestedList = ({
  collection,
  collectionChildren,
  currentWorkId,
  setCollection,
}: NestedListProps) => {
  return (
    <ul
      className={classNames({
        'font-size-5': true,
      })}
    >
      {collectionChildren.map(item => {
        return (
          item &&
          item.work && (
            <li key={item.work.id}>
              <div style={{ padding: '10px 10px 30px' }}>
                <TogglesContext.Consumer>
                  {toggles => (
                    <WorkLink
                      item={item}
                      currentWorkId={currentWorkId}
                      collection={collection}
                      setCollection={setCollection}
                      toggles={toggles}
                    />
                  )}
                </TogglesContext.Consumer>
                {item.children && (
                  <NestedList
                    collectionChildren={item.children}
                    currentWorkPath={item.path.path}
                    currentWorkId={currentWorkId}
                    collection={collection}
                    setCollection={setCollection}
                  />
                )}
              </div>
            </li>
          )
        );
      })}
    </ul>
  );
};

const ArchiveTree = ({ work }: Work) => {
  const [showArchiveTreeModal, setShowArchiveTreeModal] = useState(false);
  const [collectionTree, setCollectionTree] = useState(work.collection || {});

  useEffect(() => {
    setCollectionTree(work.collection);
  }, [work]);
  return (
    (work && work.collection && (
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
                collectionChildren={[collectionTree]}
                currentWorkPath={
                  work.collectionPath && work.collectionPath.path
                }
                currentWorkId={work.id}
                collection={collectionTree}
                setCollection={setCollectionTree}
              />
            </Tree>
          </Container>
        </Modal>
      </>
    )) ||
    null
  );
};
export default ArchiveTree;
