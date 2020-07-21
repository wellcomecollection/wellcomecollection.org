import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { classNames } from '@weco/common/utils/classnames';
import { getWork } from '@weco/catalogue/services/catalogue/works';
import { getTreeBranches } from '@weco/common/utils/works';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { type Toggles } from '@weco/catalogue/services/catalogue/common';
import Space from '../styled/Space';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Modal from '@weco/common/views/components/Modal/Modal';

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

const Preview = styled.div`
  position: fixed;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
  box-sizing: border-box;
  width: 50vw;
  max-height: calc(90vh - 48px);
  overflow: auto;
  border: 2px solid black;
  border-radius: 6px;
  background: #f0ede3;
  padding: 12px;

  p {
    margin-top: 0;
  }

  a {
    color: black;
    :hover,
    :focus {
      text-decoration: underline;
    }
  }

  button {
    position: absolute;
    top: 12px;
    right: 12px;
  }
`;

const PreviewTable = styled.table`
  margin-top: 30px;
  th,
  td {
    padding: 6px;
    vertical-align: top;
    text-align: left;
  }
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

type Collection = {|
  path: {|
    path: string,
    level: string,
    label: string,
    type: string,
  |},
  work: Work,
  children: ?(Collection[]),
|};

type NestedListProps = {|
  collectionChildren: Collection[],
  currentWorkId: string,
  collection: Collection[],
  setCollection: (Collection[]) => void,
  setShowArchiveTreeModal: boolean => void,
  setWorkToPreview: Work => void,
  setShowPreview: boolean => void,
|};

function updateCollection(
  collection,
  currentWorkPath,
  currentBranchWithChildren,
  itemUrl
) {
  const collectionCopy = Object.assign({}, collection);
  for (const property in collectionCopy) {
    if (property === 'children') {
      for (const child of collectionCopy[property]) {
        if (currentWorkPath.includes(child.path.path)) {
          if (child.path.path === currentWorkPath) {
            child.children = currentBranchWithChildren.children;
            child.itemUrl = itemUrl;
          } else {
            updateCollection(
              child,
              currentWorkPath,
              currentBranchWithChildren,
              itemUrl
            );
          }
        }
      }
    }
  }
  return collectionCopy;
}

type WorkLinkType = {|
  title: string,
  id: string,
  level: string,
  label: string,
  currentWorkPath: string,
  currentWorkId: string,
  collection: Collection[],
  setCollection: Collection => void,
  setWorkToPreview: Work,
  setShowPreview: boolean => void,
  toggles: Toggles,
  isCurrent: boolean,
|};

const WorkLink = ({
  title,
  id,
  level,
  label,
  currentWorkPath,
  currentWorkId,
  collection,
  setCollection,
  setWorkToPreview,
  setShowPreview,
  toggles,
  isCurrent,
}: WorkLinkType) => {
  const ref = useRef();

  async function showPreview(e) {
    e.preventDefault();
    const work = await getWork({ id, toggles });
    setWorkToPreview(work);
    setShowPreview(true);
  }

  function getDigitalLocationOfType(work, locationType) {
    const [item] =
      (work.items &&
        work.items
          .map(item =>
            item.locations.find(
              location => location.locationType.id === locationType
            )
          )
          .filter(Boolean)) ||
      [];
    return item;
  }

  const fetchAndUpdateCollection = async id => {
    if (level === 'Item') return;
    // find the current branch
    const currentBranch = getTreeBranches(currentWorkPath, collection)[0];
    // check for children
    if (!currentBranch.children) {
      // if no children then get collection tree for work
      const currentWork = await getWork({ id, toggles });
      const newCollection = currentWork.collection;
      const currentBranchWithChildren = getTreeBranches(
        currentWorkPath,
        newCollection
      )[0];
      const digitalLocation = getDigitalLocationOfType(
        currentWork,
        'iiif-presentation'
      );
      const sierraId =
        digitalLocation &&
        (digitalLocation.url.match(/iiif\/(.*)\/manifest/) || [])[1];
      const itemUrl = `localhost:3000/works/${currentWork.id}/items?canvas=1&sierraId=${sierraId}`;
      const updatedCollection = updateCollection(
        collection,
        currentWorkPath,
        currentBranchWithChildren,
        sierraId && itemUrl
      );
      setCollection(updatedCollection);
    }
  };
  useEffect(() => {
    fetchAndUpdateCollection(id);
  }, []);

  return (
    <StyledLink
      style={{
        whiteSpace: 'nowrap',
        display: 'inline-block',
        color: 'black',
      }}
      ref={ref}
      target="_blank"
      rel="noopener noreferrer"
      href={`/works/${id}`}
      onClick={showPreview}
      isCurrent={isCurrent} // TODO don't need to pass
    >
      {title}
      <div
        style={{
          fontSize: '13px',
          color: '#707070',
          textDecoration: 'none',
          padding: '0',
        }}
      >
        {label}
      </div>
    </StyledLink>
  );
};

const NestedList = ({
  collectionChildren,
  currentWorkId,
  collection,
  setCollection,
  setWorkToPreview,
  setShowPreview,
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
                      title={item.work.title}
                      id={item.work.id}
                      currentWorkPath={item.path.path}
                      currentWorkId={currentWorkId}
                      label={item.path.label}
                      level={item.path.level}
                      collection={collection}
                      setCollection={setCollection}
                      setWorkToPreview={setWorkToPreview}
                      setShowPreview={setShowPreview}
                      toggles={toggles}
                      isCurrent={currentWorkId === item.work.id}
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
                    setWorkToPreview={setWorkToPreview}
                    setShowPreview={setShowPreview}
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
  const [workToPreview, setWorkToPreview] = useState();
  const [showPreview, setShowPreview] = useState();

  useEffect(() => {
    setCollectionTree(work.collection);
  }, [work]);
  return (work && (
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
          <>
            {showPreview && workToPreview && (
              <Preview
                className={classNames({
                  'font-size-6': true,
                })}
              >
                <ButtonSolid
                  icon="cross"
                  text="Close preview"
                  isTextHidden={true}
                  clickHandler={() => setShowPreview(false)}
                />
                <PreviewTable>
                  <tbody>
                    {workToPreview.title && (
                      <tr>
                        <th>Title:</th>
                        <td>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`/works/${workToPreview.id}`}
                          >
                            {workToPreview.title}
                          </a>
                        </td>
                      </tr>
                    )}
                    {workToPreview.collectionPath && (
                      <tr>
                        <th>Reference:</th>
                        <td>{workToPreview.collectionPath.path}</td>
                      </tr>
                    )}
                    {workToPreview.description && (
                      <tr>
                        <th>Description:</th>
                        <td>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: workToPreview.description,
                            }}
                          />
                        </td>
                      </tr>
                    )}
                    {workToPreview.production &&
                      workToPreview.production.length > 0 && (
                        <tr>
                          <th>Publication/Creation</th>
                          <td>
                            {workToPreview.production.map(
                              productionEvent => productionEvent.label
                            )}
                          </td>
                        </tr>
                      )}
                    {workToPreview.physicalDescription && (
                      <tr>
                        <th>Physical description:</th>
                        <td>{workToPreview.physicalDescription}</td>
                      </tr>
                    )}
                    {workToPreview.notes &&
                      workToPreview.notes
                        .filter(
                          note => note.noteType.label === 'Copyright note'
                        )
                        .map(note => (
                          <tr key={note.noteType.label}>
                            <th>{note.noteType.label}</th>
                            <td>{note.contents}</td>
                          </tr>
                        ))}
                  </tbody>
                </PreviewTable>
              </Preview>
            )}
            <Tree>
              <NestedList
                collectionChildren={[collectionTree]}
                currentWorkPath={
                  work.collectionPath && work.collectionPath.path
                }
                currentWorkId={work.id}
                collection={collectionTree}
                setCollection={setCollectionTree}
                setWorkToPreview={setWorkToPreview}
                setShowPreview={setShowPreview}
              />
            </Tree>
          </>
        </Container>
      </Modal>
    </>
  ): null);
};
export default ArchiveTree;
