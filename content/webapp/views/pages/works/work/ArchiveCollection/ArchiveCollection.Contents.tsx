import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { treeInstructions } from '@weco/common/data/microcopy';
import { plus } from '@weco/common/icons';
import { useFeatureFlags, useModes } from '@weco/common/server-data/Context';
import Icon from '@weco/common/views/components/Icon';
import { Work } from '@weco/content/services/wellcome/catalogue/types';
import {
  ARCHIVE_COLLECTION_CONTENTS_PAGE_SIZE,
  getArchiveCollectionContents,
} from '@weco/content/services/wellcome/catalogue/works';
import { getArchiveAncestorArray } from '@weco/content/utils/works';
import {
  buildTreeFromCollectionPathOrder,
  createBasicArchiveTree,
} from '@weco/content/views/pages/works/work/ArchiveTree';
import NestedList, {
  getTabbableIds,
} from '@weco/content/views/pages/works/work/NestedList';

import ContentsTreeItemRenderer from './ArchiveCollection.ContentsTree.ItemRenderer';
import {
  ChevronSpacer,
  ContentsTable,
  NameCell,
  ShowMoreButton,
  ShowMoreCount,
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
  const collectionRootId = archiveAncestorArray[0]?.id || work.id;

  const [tree, setTree] = useState(createBasicArchiveTree(work));
  const [tabbableId, setTabbableId] = useState<string>();
  const [works, setWorks] = useState<Work[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number>();
  const [totalResults, setTotalResults] = useState<number>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasFetched = useRef(false);

  // Row stripes depend on visible position, which shifts as branches
  // expand/collapse, so recompute from the tree's live openStatus rather
  // than a fixed index.
  const rowIndexById = useMemo(() => {
    const visibleIds = getTabbableIds(tree);
    return Object.fromEntries(visibleIds.map((id, index) => [id, index]));
  }, [tree]);

  useEffect(() => {
    const elementToFocus = tabbableId && document.getElementById(tabbableId);
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }, [tree, tabbableId]);

  async function loadPage(pageToLoad: number, existingWorks: Work[]) {
    const response = await getArchiveCollectionContents(
      collectionRootId,
      pageToLoad,
      stagingApi,
      cataloguePipeline ?? undefined
    );
    if (!response) return;

    const updatedWorks = [...existingWorks, ...response.results];
    setWorks(updatedWorks);
    // Only carry over open/closed state from page 2 onwards. The very
    // first load has nothing worth preserving (just the basic fallback
    // tree), and everything should still default open at that point.
    setTree(
      buildTreeFromCollectionPathOrder(
        updatedWorks,
        pageToLoad > 1 ? tree : undefined
      )
    );
    setPage(pageToLoad);
    setTotalPages(response.totalPages);
    setTotalResults(response.totalResults);
  }

  useEffect(() => {
    // The tab panel stays mounted for no-JS support, so gate the fetch on
    // isActive instead of firing on every page load regardless of which
    // tab's open.
    if (!isActive || hasFetched.current) return;
    hasFetched.current = true;
    loadPage(1, []);
  }, [isActive, collectionRootId, stagingApi, cataloguePipeline]);

  const hasMorePages = totalPages !== undefined && page < totalPages;
  const nextBatchSize = Math.min(
    ARCHIVE_COLLECTION_CONTENTS_PAGE_SIZE,
    (totalResults ?? works.length) - works.length
  );

  async function showMore() {
    setIsLoadingMore(true);
    await loadPage(page + 1, works);
    setIsLoadingMore(false);
  }

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

        <Tree $isEnhanced={isEnhanced} $showFirstLevelGuideline>
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
            showFirstLevelGuideline
            ItemRenderer={ContentsTreeItemRenderer}
            shouldFetchChildren={false}
            itemRendererProps={{ rowIndexById }}
          />
        </Tree>

        {hasMorePages && (
          <ContentsTable>
            <tbody>
              <tr>
                <td>
                  <NameCell>
                    <ChevronSpacer />
                    <ShowMoreButton onClick={showMore} disabled={isLoadingMore}>
                      <Icon
                        icon={plus}
                        iconColor="neutral.600"
                        matchText
                        sizeOverride="height: 16px; width: 16px;"
                      />
                      {isLoadingMore
                        ? 'Loading…'
                        : `Show ${nextBatchSize} more rows`}
                    </ShowMoreButton>
                  </NameCell>
                </td>
                <td colSpan={2} style={{ textAlign: 'right' }}>
                  <ShowMoreCount>
                    Showing {works.length} of {totalResults} rows
                  </ShowMoreCount>
                </td>
              </tr>
            </tbody>
          </ContentsTable>
        )}
      </div>
    </div>
  );
};

export default ArchiveCollectionContents;
