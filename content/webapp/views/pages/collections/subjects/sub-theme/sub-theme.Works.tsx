import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { formatNumber } from '@weco/common/utils/grammar';
import LL from '@weco/common/views/components/styled/LL';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import {
  toWorkBasic,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { getWorks } from '@weco/content/services/wellcome/catalogue/works';
import MoreLink from '@weco/content/views/components/MoreLink';
import { toSearchWorksLink } from '@weco/content/views/components/SearchPagesLink/Works';
import Tabs from '@weco/content/views/components/Tabs';
import WorksSearchResults from '@weco/content/views/components/WorksSearchResults';

import { WorksForTabs } from '.';

// The tab ID for showing all works (not filtered by work type)
const ALL_WORKS_TAB_ID = 'all';

const SubThemeWorks = ({
  subThemeName,
  works,
  conceptsDisplayLabels,
}: {
  subThemeName: string;
  works: WorksForTabs;
  conceptsDisplayLabels: string[];
}) => {
  const { toggles } = useContext(ServerDataContext);
  const [selectedTab, setSelectedTab] = useState(ALL_WORKS_TAB_ID);
  const [displayedWorks, setDisplayedWorks] = useState<WorkBasic[]>(
    works.pageResults
  );
  const [isLoading, setIsLoading] = useState(false);
  // Cache fetched results per tab to avoid re-fetching when switching back
  const [resultsCache, setResultsCache] = useState<Record<string, WorkBasic[]>>(
    {
      [ALL_WORKS_TAB_ID]: works.pageResults,
    }
  );
  // Track the height of each tab's results container to prevent layout shift when loading
  // Heights are captured before loading (to size the loader) and updated after rendering (actual height)
  const [containerHeights, setContainerHeights] = useState<
    Record<string, number>
  >({});
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  // Track the latest selected tab to prevent race conditions when switching tabs quickly
  const latestTabRef = useRef(selectedTab);

  useEffect(() => {
    // Update the ref whenever selectedTab changes to track the latest selection
    latestTabRef.current = selectedTab;
  }, [selectedTab]);

  useEffect(() => {
    const fetchFilteredWorks = async () => {
      if (selectedTab === ALL_WORKS_TAB_ID) {
        setDisplayedWorks(works.pageResults);
        return;
      }

      // Check if we already have cached results for this tab
      if (resultsCache[selectedTab]) {
        setDisplayedWorks(resultsCache[selectedTab]);
        return;
      }

      // Capture the current container height before loading
      // Store it under the new tab's key so the loader can use it
      // This will be overwritten with the actual measured height after results render
      if (resultsContainerRef.current) {
        setContainerHeights(prev => ({
          ...prev,
          [selectedTab]: resultsContainerRef.current!.offsetHeight,
        }));
      }

      setIsLoading(true);
      try {
        const result = await getWorks({
          params: {
            'subjects.label': conceptsDisplayLabels,
            workType: [selectedTab],
          },
          pageSize: works.pageResults.length,
          toggles,
        });

        // Only update state if this is still the current tab (prevent race conditions)
        if (latestTabRef.current !== selectedTab) {
          return;
        }

        if (result.type === 'ResultList') {
          const fetchedWorks = result.results.map(toWorkBasic);
          // Cache the fetched results for this tab
          setResultsCache(prev => ({
            ...prev,
            [selectedTab]: fetchedWorks,
          }));
          setDisplayedWorks(fetchedWorks);
        } else {
          // Handle API errors or non-ResultList responses
          console.error('Failed to fetch works:', result);
          // Clear displayed works to avoid showing stale data from previous tab
          setDisplayedWorks([]);
          // Clear cache entry for this tab so it can be retried
          setResultsCache(prev => {
            const { [selectedTab]: _, ...rest } = prev;
            return rest;
          });
        }
      } catch (error) {
        console.error('Error fetching works:', error);
        // Clear displayed works to avoid showing stale data from previous tab
        setDisplayedWorks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredWorks();
  }, [selectedTab, conceptsDisplayLabels, toggles, works.pageResults]);

  // Use useLayoutEffect to measure the DOM synchronously after render but before paint
  // This ensures we capture the accurate height after results have rendered
  // and store it for this tab (replacing any temporary pre-fetch measurement)
  useLayoutEffect(() => {
    if (resultsContainerRef.current && !isLoading) {
      setContainerHeights(prev => ({
        ...prev,
        [selectedTab]: resultsContainerRef.current!.offsetHeight,
      }));
    }
  }, [displayedWorks, isLoading, selectedTab]);

  if (displayedWorks.length === 0 && !isLoading) return null;

  return (
    <>
      {works.workTypes.length > 0 && (
        <Tabs
          tabBehaviour="switch"
          label="Works by type"
          items={[
            {
              id: ALL_WORKS_TAB_ID,
              text: `All (${formatNumber(works.totalResults)})`,
            },
            ...works.workTypes.map(workType => ({
              id: workType.id,
              text: `${workType.label} (${formatNumber(workType.count)})`,
            })),
          ]}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}

      <Space $v={{ size: 'md', properties: ['margin-top'] }}>
        {isLoading ? (
          <div
            style={{
              minHeight: containerHeights[selectedTab]
                ? `${containerHeights[selectedTab]}px`
                : '400px', // Fallback height for first load before measurement
            }}
          >
            <LL $position="relative" />
          </div>
        ) : (
          <div ref={resultsContainerRef}>
            <WorksSearchResults works={displayedWorks} />

            <MoreLink
              ariaLabel={`View all works about ${subThemeName}`}
              name="View all"
              url={toSearchWorksLink({
                'subjects.label': conceptsDisplayLabels,
                ...(selectedTab === ALL_WORKS_TAB_ID
                  ? {}
                  : { workType: [selectedTab] }),
              })}
              colors={themeValues.buttonColors.greenGreenWhite}
            />
          </div>
        )}
      </Space>
    </>
  );
};

export default SubThemeWorks;
