import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { treeInstructions } from '@weco/common/data/microcopy';
import { plus } from '@weco/common/icons';
import { useFeatureFlags, useModes } from '@weco/common/server-data/Context';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Icon from '@weco/common/views/components/Icon';
import { Work } from '@weco/content/services/wellcome/catalogue/types';
import {
  ARCHIVE_COLLECTION_CONTENTS_PAGE_SIZE,
  getArchiveCollectionContents,
  LARGE_ARCHIVE_ROW_THRESHOLD,
} from '@weco/content/services/wellcome/catalogue/works';
import { getArchiveAncestorArray } from '@weco/content/utils/works';
import {
  buildTreeFromCollectionPathOrder,
  createBasicArchiveTree,
} from '@weco/content/views/pages/works/work/ArchiveTree';
import NestedList, {
  getChildren,
  getTabbableIds,
  updateChildren,
} from '@weco/content/views/pages/works/work/NestedList';
import { UiTree } from '@weco/content/views/pages/works/work/work.types';

import ContentsTreeItemRenderer from './ArchiveCollection.ContentsTree.ItemRenderer';
import {
  ChevronSpacer,
  ContentsFooterRow,
  ContentsHeaderRow,
  ContentsRowSummaryCell,
  NameCell,
  ShowMoreButton,
  Tree,
  TreeBand,
  TreeInstructions,
} from './ArchiveCollection.ContentsTree.styles';

// Folders that are open but have never had their children fetched. Until the
// first contents request says whether the archive is large, the tree doesn't
// fetch children, so a folder opened in that gap ends up like this.
function getOpenUnfetchedIds(tree: UiTree): string[] {
  return tree.flatMap(node => [
    ...(node.openStatus &&
    node.children === undefined &&
    (node.data.totalParts ?? 0) > 0
      ? [node.data.id]
      : []),
    ...(node.children ? getOpenUnfetchedIds(node.children) : []),
  ]);
}

const ArchiveCollectionContents: FunctionComponent<{
  work: Work;
  isActive: boolean;
}> = ({ work, isActive }) => {
  const { isEnhanced } = useAppContext();
  const { stagingApi, largeArchiveContentsTree: showLargeArchiveContentsTree } =
    useFeatureFlags();
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
  const [isLargeArchive, setIsLargeArchive] = useState(false);

  const hasFetched = useRef(false);
  // Mirrors `tree` so loadPage's post-await read isn't a stale closure.
  const treeRef = useRef(tree);
  treeRef.current = tree;

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

  // Returns whether the page actually loaded, so callers can tell a
  // handled API failure (getArchiveCollectionContents resolves with
  // undefined rather than rejecting - see wellcomeApiQuery) apart from
  // success, not just genuine thrown errors.
  async function loadPage(
    pageToLoad: number,
    existingWorks: Work[]
  ): Promise<boolean> {
    const response = await getArchiveCollectionContents(
      collectionRootId,
      pageToLoad,
      stagingApi,
      cataloguePipeline
    );
    if (!response) return false;

    // Large archives keep the basic tree built from work.parts (first level
    // open) and fetch children as folders are opened, instead of paging.
    // totalResults is left unset, so the row counter and "Show more" button
    // don't render.
    if (
      showLargeArchiveContentsTree &&
      pageToLoad === 1 &&
      response.totalResults >= LARGE_ARCHIVE_ROW_THRESHOLD
    ) {
      setIsLargeArchive(true);

      // Fetch children for any folder opened before we knew, so it doesn't
      // need a second click. Functional updates keep whatever else the user
      // has opened or closed since, and updateChildren leaves each folder's
      // own openStatus as it is. A failed fetch leaves the folder as it was,
      // and clicking it again fetches as normal now isLargeArchive is set.
      getOpenUnfetchedIds(treeRef.current).forEach(id => {
        getChildren(id)
          .then(children =>
            setTree(currentTree =>
              updateChildren({ tree: currentTree, id, value: children })
            )
          )
          .catch(() => undefined);
      });

      return true;
    }

    const updatedWorks = [...existingWorks, ...response.results];
    setWorks(updatedWorks);
    // Only carry over open/closed state from page 2 onwards. The very
    // first load has nothing worth preserving (just the basic fallback
    // tree), and everything should still default open at that point.
    setTree(
      buildTreeFromCollectionPathOrder(
        updatedWorks,
        pageToLoad > 1 ? treeRef.current : undefined
      )
    );
    setPage(pageToLoad);
    setTotalPages(response.totalPages);
    setTotalResults(response.totalResults);
    return true;
  }

  useEffect(() => {
    // The tab panel stays mounted for no-JS support, so gate the fetch on
    // isActive instead of firing on every page load regardless of which
    // tab's open.
    if (!isActive || hasFetched.current) return;
    hasFetched.current = true;

    // Reset the guard on failure (a handled API error or a thrown one),
    // so switching away from and back to the tab retries instead of
    // leaving the fallback tree stuck for good.
    loadPage(1, [])
      .catch(() => false)
      .then(succeeded => {
        if (!succeeded) hasFetched.current = false;
      });
  }, [
    isActive,
    collectionRootId,
    stagingApi,
    cataloguePipeline,
    showLargeArchiveContentsTree,
  ]);

  async function showMore() {
    setIsLoadingMore(true);
    try {
      await loadPage(page + 1, works);
    } finally {
      setIsLoadingMore(false);
    }
  }

  const hasMorePages = totalPages !== undefined && page < totalPages;
  const nextBatchSize = Math.min(
    ARCHIVE_COLLECTION_CONTENTS_PAGE_SIZE,
    (totalResults ?? works.length) - works.length
  );

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <div style={{ display: 'inline-table', minWidth: '100%' }}>
        <TreeBand aria-hidden="true">
          <ContentsHeaderRow>
            <span>Name</span>
            <span>Reference</span>
            <span>Level</span>
          </ContentsHeaderRow>
        </TreeBand>

        <Tree $isEnhanced={isEnhanced} $showFirstLevelGuideline $isCompact>
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
            ItemRenderer={ContentsTreeItemRenderer}
            itemRendererProps={{ rowIndexById }}
            firstItemTabbable={false}
            shouldFetchChildren={isLargeArchive}
            showFirstLevelGuideline
            isCompact
          />
        </Tree>

        {totalResults !== undefined && (
          <TreeBand>
            <ContentsFooterRow>
              <NameCell>
                <ChevronSpacer />
                {hasMorePages && (
                  <ShowMoreButton
                    onClick={showMore}
                    disabled={isLoadingMore}
                    {...dataGtmPropsToAttributes({
                      trigger: 'show_more_rows_content_tree',
                    })}
                  >
                    <Icon
                      icon={plus}
                      sizeOverride="height: 16px; width: 16px;"
                      matchText
                    />
                    {isLoadingMore
                      ? 'Loading…'
                      : `Show ${nextBatchSize} more rows`}
                  </ShowMoreButton>
                )}
              </NameCell>

              <ContentsRowSummaryCell>
                Showing {works.length} of {totalResults} rows
              </ContentsRowSummaryCell>
            </ContentsFooterRow>
          </TreeBand>
        )}
      </div>
    </div>
  );
};

export default ArchiveCollectionContents;
