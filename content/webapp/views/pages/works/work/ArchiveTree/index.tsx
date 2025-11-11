import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { treeInstructions } from '@weco/common/data/microcopy';
import { tree } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import Modal from '@weco/common/views/components/Modal';
import Space from '@weco/common/views/components/styled/Space';
import { useIsArchiveContext } from '@weco/content/contexts/IsArchiveContext';
import {
  RelatedWork,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorkClientSide } from '@weco/content/services/wellcome/catalogue/works';
import { getArchiveAncestorArray } from '@weco/content/utils/works';
import {
  Tree,
  TreeInstructions,
} from '@weco/content/views/pages/works/work/work.styles';
import { UiTree } from '@weco/content/views/pages/works/work/work.types';

import NestedList from './ArchiveTree.NestedList';
import { ButtonWrap, TreeContainer } from './ArchiveTree.styles';
import WorkItem from './ArchiveTree.WorkItemRenderer';

async function getFullWork(work: RelatedWork) {
  const fullWork = await getWorkClientSide(work.id);

  if (fullWork.type !== 'Error' && fullWork.type !== 'Redirect') {
    return { ...work, ...fullWork };
  }

  // Return related (partial) work as fallback
  return work;
}

const constructTree = (
  curr: RelatedWork,
  hierarchy: RelatedWork[],
  parent: RelatedWork | null
) => {
  const populateChildren = hierarchy.length > 0 && curr.id === hierarchy[0].id;

  let childNodes;
  if (populateChildren) {
    let children = hierarchy[0].parts;
    if (children === undefined && hierarchy.length > 1) {
      children = [hierarchy[1]];
    }
    childNodes = (children || []).map(child =>
      constructTree(child, hierarchy.slice(1), curr)
    );
  }

  return {
    openStatus: curr.id === hierarchy[0]?.id,
    work: curr,
    parentId: parent ? parent.id : undefined,
    children: childNodes,
  };
};

function createBasicArchiveTree(work: Work): UiTree {
  const ancestors = getArchiveAncestorArray(work);
  const allTreeNodes = [...ancestors, work];
  return [constructTree(allTreeNodes[0], allTreeNodes, null)];
}

async function createArchiveTree(work: Work): Promise<UiTree> {
  const ancestors = getArchiveAncestorArray(work);
  const fullWorks = await Promise.all(
    ancestors.map(async ancestor => await getFullWork(ancestor))
  );

  const allTreeNodes = [...fullWorks, work];
  return [constructTree(allTreeNodes[0], allTreeNodes, null)];
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
  const [archiveTree, setArchiveTree] = useState(createBasicArchiveTree(work));

  const [tabbableId, setTabbableId] = useState<string>();
  const openButtonRef = useRef(null);
  const isArchive = useIsArchiveContext();

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
      const tree = await createArchiveTree(work);
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
