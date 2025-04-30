import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { treeInstructions } from '@weco/common/data/microcopy';
import { tree } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import Modal from '@weco/common/views/components/Modal';
import Space from '@weco/common/views/components/styled/Space';
import IsArchiveContext from '@weco/content/contexts/IsArchiveContext';
import {
  RelatedWork,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorkClientSide } from '@weco/content/services/wellcome/catalogue/works';
import { getArchiveAncestorArray } from '@weco/content/utils/works';

import { UiTree, UiTreeNode, updateChildren } from './ArchiveTree.helpers';
import NestedList from './ArchiveTree.NestedList';
import {
  ButtonWrap,
  Tree,
  TreeContainer,
  TreeInstructions,
} from './ArchiveTree.styles';
import WorkItem from './ArchiveTree.WorkItemRenderer';

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
        const siblings = createSiblingsArray({ work });
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
}): Promise<UiTree> {
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
  const { isEnhanced, windowSize } = useAppContext();
  const archiveAncestorArray = getArchiveAncestorArray(work);
  const initialLoad = useRef(true);
  const [showArchiveTreeModal, setShowArchiveTreeModal] = useState(false);
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

  useEffect(() => {
    // On mobile we want to close the archive tree if a user selects a work
    setShowArchiveTreeModal(false);
  }, [work]);

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
            <Button
              variant="ButtonSolid"
              text="Collection contents"
              clickHandler={() => setShowArchiveTreeModal(true)}
              aria-controls="collection-contents-modal"
              aria-label="show collection contents"
              icon={tree}
              ref={openButtonRef}
            />
          </ButtonWrap>
          <Modal
            isActive={showArchiveTreeModal}
            setIsActive={setShowArchiveTreeModal}
            id="collection-contents-modal"
            openButtonRef={openButtonRef}
          >
            <Tree $isEnhanced={isEnhanced}>
              {isEnhanced && (
                <TreeInstructions>{treeInstructions}</TreeInstructions>
              )}
              <NestedList
                currentWorkId={work.id}
                fullTree={archiveTree}
                setArchiveTree={setArchiveTree}
                archiveTree={archiveTree}
                level={1}
                tabbableId={tabbableId}
                setTabbableId={setTabbableId}
                archiveAncestorArray={archiveAncestorArray}
                firstItemTabbable={false}
                showFirstLevelGuideline={false}
                ItemRenderer={WorkItem}
                shouldFetchChildren={true}
              />
            </Tree>
          </Modal>
        </>
      ) : (
        <TreeContainer>
          <Space
            $v={{ size: 'l', properties: ['padding-top', 'padding-bottom'] }}
          >
            <h2 className={font('wb', 4)}>Collection contents</h2>
            <Tree $isEnhanced={isEnhanced} $maxWidth={375}>
              {isEnhanced && (
                <TreeInstructions>{treeInstructions}</TreeInstructions>
              )}
              <NestedList
                currentWorkId={work.id}
                fullTree={archiveTree}
                setArchiveTree={setArchiveTree}
                archiveTree={archiveTree}
                level={1}
                tabbableId={tabbableId}
                setTabbableId={setTabbableId}
                archiveAncestorArray={archiveAncestorArray}
                firstItemTabbable={false}
                showFirstLevelGuideline={false}
                ItemRenderer={WorkItem}
                shouldFetchChildren={true}
              />
            </Tree>
          </Space>
        </TreeContainer>
      )}
    </>
  ) : null;
};

export default ArchiveTree;
