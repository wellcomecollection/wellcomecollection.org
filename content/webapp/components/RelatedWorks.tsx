import { FunctionComponent, useContext, useEffect, useState } from 'react';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { classNames } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import Tabs from '@weco/content/components/Tabs';
import WorksSearchResult from '@weco/content/components/WorksSearchResult'; // TODO temporary
import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';
import {
  toWorkBasic,
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';

type Props = {
  work: Work;
};

// genres labels we consider visual
// TODO what should be in this list?
const visualGenres = [
  'Caricatures',
  'Engravings',
  'Etchings',
  'Portrait prints',
  'Photographs',
  'Paintings',
];

// Returns the century range for a string containing exactly four digits
const getCenturyRange = (
  str?: string
): { tabLabel: string; from: string; to: string } | null => {
  const match = str?.match(/^(\d{4})$/);
  if (match) {
    const year = parseInt(match[0], 10);
    const centuryStart = Math.floor(year / 100) * 100;
    const centuryEnd = centuryStart + 99;
    return {
      tabLabel: `From ${centuryStart}s`,
      from: `${centuryStart}-01-01`,
      to: `${centuryEnd}-12-31`,
    };
  }
  return null;
};

function getGenresLabels(aggregations: unknown): string[] {
  const buckets = aggregations?.['genres.label']?.buckets ?? [];
  return buckets.map((bucket: unknown) => bucket?.data?.label); // TODO
}

const fetchRelated = async ({
  serverData,
  params,
  aggregations,
  setRelated,
  setGenresLabels,
  work,
}: {
  serverData: SimplifiedServerData;
  params: { [key: string]: string | string[] };
  aggregations: string[];
  setRelated: (results: WorkBasic[]) => void;
  setGenresLabels: (results: string[]) => void;
  work: Work;
}): Promise<void> => {
  const response = await catalogueQuery('works', {
    toggles: serverData.toggles,
    pageSize: 4, // In case we get the current work back, we will still have 3 to show
    params: {
      ...params,
      include: ['production', 'contributors'],
      aggregations: aggregations.length > 0 ? aggregations : undefined,
    },
  });

  if (response.type === 'ResultList') {
    setRelated(
      response.results
        .filter(result => result.id !== work.id)
        .slice(0, 3)
        .map(toWorkBasic)
    );
    setGenresLabels(getGenresLabels(response.aggregations));
  }
};

// Returns a config object for tabs: one per subject label, plus date-range if present
function getRelatedTabConfig({
  work,
  relatedWorks,
  setRelatedWorks,
}: {
  work: Work;
  relatedWorks: { [key: string]: WorkBasic[] | undefined };
  setRelatedWorks: (results: {
    [key: string]: WorkBasic[] | undefined;
  }) => void;
}) {
  const subjectLabels = work.subjects.map(subject => subject.label).slice(0, 3);
  const dateRange = getCenturyRange(work.production[0]?.dates[0]?.label);

  const config: {
    [key: string]: {
      text: string;
      params: { [key: string]: string | string[] };
      aggregations: string[];
      related: WorkBasic[] | undefined;
      setRelated: (results: WorkBasic[]) => void;
    };
  } = {};

  subjectLabels.forEach(label => {
    const id = label.replace(/[^a-zA-Z0-9]/g, '-');
    config[`subject-${id}`] = {
      text: label,
      params: { 'subjects.label': [label] },
      aggregations: ['genres.label'],
      related: relatedWorks[`subject-${id}`],
      setRelated: (results: WorkBasic[]) =>
        setRelatedWorks(prev => ({ ...prev, [`subject-${id}`]: results })),
    };
  });

  if (dateRange) {
    config['date-range'] = {
      text: dateRange.tabLabel,
      params: {
        'production.dates.from': dateRange.from,
        'production.dates.to': dateRange.to,
      },
      aggregations: [],
      related: relatedWorks['date-range'],
      setRelated: (results: WorkBasic[]) =>
        setRelatedWorks(prev => ({ ...prev, 'date-range': results })),
    };
  }

  return config;
}

const RelatedWorks: FunctionComponent<Props> = ({ work }) => {
  const [relatedWorks, setRelatedWorks] = useState<{
    [key: string]: WorkBasic[] | undefined;
  }>({});
  const [genresLabels, setGenresLabels] = useState<string[]>([]);
  const [relatedTabConfig, setRelatedTabConfig] = useState<{
    [key: string]: {
      text: string;
      params: { [key: string]: string | string[] };
      aggregations: string[];
      related: WorkBasic[] | undefined;
      setRelated: (results: WorkBasic[]) => void;
    };
  }>(
    getRelatedTabConfig({
      work,
      relatedWorks,
      setRelatedWorks,
    })
  );

  // Set initial tab to first subject or date-range if no subjects
  const tabKeys = Object.keys(relatedTabConfig);
  const [selectedWorksTab, setSelectedWorksTab] = useState(tabKeys[0] || '');

  const serverData = useContext(ServerDataContext);

  useEffect(() => {
    // Only fetch if we haven't already fetched results for the current tab
    // or if the results for the current tab now include the current work
    const related =
      relatedTabConfig[selectedWorksTab] &&
      relatedTabConfig[selectedWorksTab].related;
    if (
      relatedTabConfig[selectedWorksTab] &&
      (!related || related.some(result => result.id === work.id))
    ) {
      fetchRelated({
        work,
        serverData,
        params: relatedTabConfig[selectedWorksTab].params,
        aggregations: relatedTabConfig[selectedWorksTab].aggregations,
        setRelated: relatedTabConfig[selectedWorksTab].setRelated,
        setGenresLabels,
      });
    }
  }, [selectedWorksTab, work.id]);

  useEffect(() => {
    // Once we have the genres labels from the first api request,
    // we can update the related tab config to include a genre label tab.
    // We pick the first genre label that is we consider to be visual if there is one,
    // otherwise we pick the first genre label.
    if (genresLabels.length > 0) {
      const visualGenre = genresLabels.find(label =>
        visualGenres.includes(label)
      );
      const chosenGenre = visualGenre || genresLabels[0];
      const id = chosenGenre.replace(/[^a-zA-Z0-9]/g, '-');
      setRelatedTabConfig({
        ...relatedTabConfig,
        [`genres-${id}`]: {
          text: chosenGenre,
          params: {
            'genres.label': [chosenGenre],
            // the genres we chose is based on the query using the first subject label as a filter
            // this is to avoid having to do a another api call filtered by all the subject labels together
            // so we also filter here by the first subject label as well as the genre label
            'subjects.label': work.subjects
              .map(subject => subject.label)
              .slice(0, 1),
          },
          aggregations: [],
          related: relatedWorks[`genres-${id}`],
          setRelated: (results: WorkBasic[]) =>
            setRelatedWorks(prev => ({ ...prev, [`genres-${id}`]: results })),
        },
      });
    }
  }, [genresLabels]);

  return Object.keys(relatedTabConfig).length === 0 ? null : (
    <Container>
      <Space $v={{ size: 'l', properties: ['padding-top'] }}>
        <h2>Related Works</h2>
        <Tabs
          tabBehaviour="switch"
          label="Related works control"
          selectedTab={selectedWorksTab}
          items={Object.entries(relatedTabConfig).map(([id, config]) => ({
            id,
            url: `#${id}`,
            text: config.text,
          }))}
          setSelectedTab={setSelectedWorksTab}
          // TODO trackWithSegment?
        />
        {Object.keys(relatedTabConfig).map(tabKey => (
          <div
            key={tabKey}
            className={classNames({
              'is-hidden': selectedWorksTab !== tabKey,
            })}
          >
            {/* TODO loading icon */}
            {relatedWorks[tabKey]?.map((result, i) => (
              <WorksSearchResult
                work={result}
                resultPosition={i}
                key={result.id}
              />
            ))}
          </div>
        ))}
      </Space>
    </Container>
  );
};

export default RelatedWorks;
