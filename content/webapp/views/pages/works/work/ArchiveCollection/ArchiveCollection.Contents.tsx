import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { treeInstructions } from '@weco/common/data/microcopy';
import { useFeatureFlags, useModes } from '@weco/common/server-data/Context';
import { Work } from '@weco/content/services/wellcome/catalogue/types';
import { getArchiveAncestorArray } from '@weco/content/utils/works';
import {
  createArchiveCollectionContentsTree,
  createBasicArchiveTree,
} from '@weco/content/views/pages/works/work/ArchiveTree';
import NestedList from '@weco/content/views/pages/works/work/NestedList';

import ContentsTreeItemRenderer from './ArchiveCollection.ContentsTree.ItemRenderer';
import {
  ContentsTable,
  Tree,
  TreeHeadings,
  TreeInstructions,
} from './ArchiveCollection.ContentsTree.styles';

const ArchiveCollectionContents: FunctionComponent<{
  work: Work;
  isActive: boolean;
}> = ({ work, isActive }) => {
  const { isEnhanced } = useAppContext();
  const { stagingApi } = useFeatureFlags();
  const { cataloguePipeline } = useModes();
  const archiveAncestorArray = getArchiveAncestorArray(work);
  const [tree, setTree] = useState(createBasicArchiveTree(work));
  const [tabbableId, setTabbableId] = useState<string>();
  const hasFetched = useRef(false);

  useEffect(() => {
    const elementToFocus = tabbableId && document.getElementById(tabbableId);
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }, [tree, tabbableId]);

  useEffect(() => {
    // The Contents tab panel is always mounted (so it still works without
    // JS), so this only fetches once the tab is actually selected, rather
    // than fetching a whole collection's contents on every archive page
    // load regardless of which tab the user's looking at.
    if (!isActive || hasFetched.current) return;
    hasFetched.current = true;

    async function setupTree() {
      const fetchedTree = await createArchiveCollectionContentsTree(
        work,
        stagingApi,
        cataloguePipeline ?? undefined
      );
      setTree(fetchedTree || []);
    }
    setupTree();
  }, [isActive, work, stagingApi, cataloguePipeline]);

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <div style={{ display: 'inline-table', minWidth: '100%' }}>
        <TreeHeadings aria-hidden="true">
          <ContentsTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Reference</th>
                <th>Level</th>
              </tr>
            </thead>
          </ContentsTable>
        </TreeHeadings>

        <Tree $isEnhanced={isEnhanced} $showFirstLevelGuideline={false}>
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
            ItemRenderer={ContentsTreeItemRenderer}
            shouldFetchChildren
          />
        </Tree>
      </div>
    </div>
  );
};

export default ArchiveCollectionContents;
