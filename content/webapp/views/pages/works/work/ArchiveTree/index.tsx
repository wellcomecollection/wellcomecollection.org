import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { treeInstructions } from '@weco/common/data/microcopy';
import { tree as treeIcon } from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
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
import NestedList from '@weco/content/views/pages/works/work/NestedList';
import {
  Tree,
  TreeInstructions,
} from '@weco/content/views/pages/works/work/work.styles';
import {
  UiTree,
  UiTreeNode,
} from '@weco/content/views/pages/works/work/work.types';

import { ButtonWrap, TreeContainer } from './ArchiveTree.styles';
import WorkItem from './ArchiveTree.WorkItemRenderer';

async function getRelatedWorkWithChildren(
  work: RelatedWork
): Promise<RelatedWork> {
  const fullWork = await getWorkClientSide(work.id);

  if (fullWork.type !== 'Error' && fullWork.type !== 'Redirect') {
    return { ...work, parts: fullWork.parts };
  }

  return work;
}

const constructTree = (
  curr: RelatedWork,
  hierarchy: RelatedWork[],
  parent: RelatedWork | null
): UiTreeNode => {
  // Nodes which fall outside the direct child/parent/grandparent hierarchy (e.g. ancestor siblings) do not have
  // their children populated.
  const populateChildren = hierarchy.length > 0 && curr.id === hierarchy[0].id;

  let childNodes;
  if (populateChildren) {
    let children = hierarchy[0].parts;

    // When constructing a 'basic' tree, the `parts` field is not always available.
    // In this case, the only known child is the second item in the hierarchy array.
    if (children === undefined && hierarchy.length > 1) {
      children = [hierarchy[1]];
    }
    childNodes = (children || []).map(child =>
      constructTree(child, hierarchy.slice(1), curr)
    );
  }

  return {
    openStatus: curr.id === hierarchy[0]?.id,
    data: curr,
    parentId: parent ? parent.id : undefined,
    children: childNodes,
  };
};

export function createBasicArchiveTree(work: Work): UiTree {
  /*
  Return a 'basic' archive tree, populated only from data present on the provided `work`.
  Only ancestors and direct children are included.
  */
  const ancestors = getArchiveAncestorArray(work);
  const allTreeNodes = [...ancestors, work];
  return [constructTree(allTreeNodes[0], allTreeNodes, null)];
}

async function createArchiveTree(work: Work): Promise<UiTree> {
  /*
  Return a 'rich' archive tree, populated from the provided `work` and all of its ancestors (retrieved client-side).
  Ancestors and direct children are included, as well as all ancestor children/siblings.
  */
  const ancestors = getArchiveAncestorArray(work);
  const ancestorsWithChildren = await Promise.all(
    ancestors.map(async ancestor => await getRelatedWorkWithChildren(ancestor))
  );

  const allTreeNodes = [...ancestorsWithChildren, work];
  return [constructTree(allTreeNodes[0], allTreeNodes, null)];
}

// Flattens a tree into an id -> openStatus map, so a freshly-rebuilt tree
// can restore which branches were already manually opened or closed.
function getOpenStatusById(tree: UiTree): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const node of tree) {
    result[node.data.id] = node.openStatus;
    if (node.children) {
      Object.assign(result, getOpenStatusById(node.children));
    }
  }
  return result;
}

// Builds a tree from a flat, collectionPath-sorted list, everything open
// by default. Depth comes from the filtered archive-ancestor chain, not
// raw `partOf.length`. `partOf` can have non-archive parents (e.g. a
// Library Series) mixed in, which would overstate depth and drop a whole
// subtree.
//
// totalParts gets backfilled as children attach, since search results
// only carry a work's parent's totalParts, not its own.
//
// Pass `previousTree` to keep whatever the user already opened/closed,
// only genuinely new nodes default to open.
export function buildTreeFromCollectionPathOrder(
  works: Work[],
  previousTree?: UiTree
): UiTree {
  const previousOpenStatusById = previousTree
    ? getOpenStatusById(previousTree)
    : undefined;

  const stack: UiTreeNode[] = [];
  let root: UiTreeNode | undefined;

  for (const work of works) {
    const archiveAncestors = getArchiveAncestorArray(work);
    const depth = archiveAncestors.length;
    const node: UiTreeNode = {
      openStatus: previousOpenStatusById?.[work.id] ?? true,
      data: work,
      parentId: archiveAncestors[archiveAncestors.length - 1]?.id,
    };

    if (depth === 0) {
      root = node;
      stack[0] = node;
      continue;
    }

    const parent = stack[depth - 1];
    if (!parent) continue;

    parent.children = parent.children ? [...parent.children, node] : [node];
    parent.data = { ...parent.data, totalParts: parent.children.length };
    stack.length = depth;
    stack[depth] = node;
  }

  return root ? [root] : [];
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
  const [tree, setTree] = useState(createBasicArchiveTree(work));

  const [tabbableId, setTabbableId] = useState<string>();
  const openButtonRef = useRef(null);
  const isArchive = useIsArchiveContext();

  useEffect(() => {
    const elementToFocus = tabbableId && document.getElementById(tabbableId);
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }, [tree, tabbableId]);

  useEffect(() => {
    // On mobile we want to close the archive tree if a user selects a work
    setShowArchiveTreeModal(false);
  }, [work]);

  useEffect(() => {
    async function setupTree() {
      const fetchedTree = await createArchiveTree(work);
      setTree(fetchedTree || []);
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
      {windowSize === 'zero' && isEnhanced ? (
        <>
          <ButtonWrap>
            <Button
              variant="ButtonSolid"
              text="Collection contents"
              clickHandler={() => setShowArchiveTreeModal(true)}
              aria-controls="collection-contents-modal"
              aria-label="show collection contents"
              icon={treeIcon}
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
                tree={tree}
                setTree={setTree}
                items={tree}
                level={1}
                tabbableId={tabbableId}
                setTabbableId={setTabbableId}
                workAncestors={archiveAncestorArray}
                firstItemTabbable={false}
                showFirstLevelGuideline={false}
                ItemRenderer={WorkItem}
                shouldFetchChildren
              />
            </Tree>
          </Modal>
        </>
      ) : (
        <TreeContainer>
          <Space
            $v={{ size: 'md', properties: ['padding-top', 'padding-bottom'] }}
          >
            <h2 className={typography('heading', 'md', 'strong', 'brand')}>
              Collection contents
            </h2>
            <Tree $isEnhanced={isEnhanced} $maxWidth={375}>
              {isEnhanced && (
                <TreeInstructions>{treeInstructions}</TreeInstructions>
              )}
              <NestedList
                currentWorkId={work.id}
                tree={tree}
                setTree={setTree}
                items={tree}
                level={1}
                tabbableId={tabbableId}
                setTabbableId={setTabbableId}
                workAncestors={archiveAncestorArray}
                firstItemTabbable={false}
                showFirstLevelGuideline={false}
                ItemRenderer={WorkItem}
                shouldFetchChildren
              />
            </Tree>
          </Space>
        </TreeContainer>
      )}
    </>
  ) : null;
};

export default ArchiveTree;
