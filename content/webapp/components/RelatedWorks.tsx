import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { classNames } from '@weco/common/utils/classnames';
import { toHtmlId } from '@weco/common/utils/grammar';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import Tabs from '@weco/content/components/Tabs';
import WorksSearchResult from '@weco/content/components/WorksSearchResult';
import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';
import {
  toWorkBasic,
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { WorkAggregations } from '@weco/content/services/wellcome/catalogue/types/aggregations';
type Props = {
  work: Work;
};

// Genres labels we consider visual
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

function getGenresLabels(aggregations?: WorkAggregations): string[] {
  const buckets = aggregations?.['genres.label']?.buckets ?? [];
  return buckets.map(bucket => bucket?.data?.label);
}

const fetchRelated = async ({
  serverData,
  params,
  setRelated,
  work,
}: {
  serverData: SimplifiedServerData;
  params: { [key: string]: string | string[] };
  setRelated: (results: WorkBasic[]) => void;
  work: Work;
}): Promise<void> => {
  const response = await catalogueQuery('works', {
    toggles: serverData.toggles,
    pageSize: 4, // In case we get the current work back, we will still have 3 to show
    params: {
      ...params,
      include: ['production', 'contributors'],
    },
  });

  if (response.type === 'ResultList') {
    setRelated(
      response.results
        .filter(result => result.id !== work.id)
        .slice(0, 3)
        .map(toWorkBasic)
    );
  }
};

// Returns a config object for tabs: one per subject label, date-range if possible, genres if available
async function getRelatedTabConfig({
  work,
  relatedWorks,
  setRelatedWorks,
  serverData,
}: {
  work: Work;
  relatedWorks: { [key: string]: WorkBasic[] | undefined };
  setRelatedWorks: Dispatch<
    SetStateAction<{ [key: string]: WorkBasic[] | undefined }>
  >;
  serverData: SimplifiedServerData;
}) {
  const subjectLabels = work.subjects.map(subject => subject.label).slice(0, 3);
  const dateRange = getCenturyRange(work.production[0]?.dates[0]?.label);
  // We make a request filtered by subject labels to get the genres labels available with them
  let genresLabels: string[] = [];
  if (subjectLabels.length > 0) {
    const response = await catalogueQuery('works', {
      toggles: serverData.toggles,
      pageSize: 4, // In case we get the current work back, we will still have 3 to show
      params: {
        'subjects.label': subjectLabels.map(label => `"${label}"`),
        include: ['production', 'contributors'],
        aggregations: ['genres.label'],
      },
    });
    genresLabels =
      response.type === 'ResultList'
        ? getGenresLabels(response.aggregations as WorkAggregations)
        : [];
  }

  const config: {
    [key: string]: {
      text: string;
      params: { [key: string]: string | string[] };
      aggregations: string[];
      related: WorkBasic[] | undefined;
      setRelated: (results: WorkBasic[]) => void;
    };
  } = {};

  subjectLabels.forEach(async label => {
    const id = toHtmlId(label);

    config[`subject-${id}`] = {
      text: label,
      params: { 'subjects.label': [`"${label}"`] },
      aggregations: ['genres.label'],
      related: relatedWorks[`subject-${id}`],
      setRelated: (results: WorkBasic[]) =>
        setRelatedWorks((prev: { [key: string]: WorkBasic[] | undefined }) => ({
          ...prev,
          [`subject-${id}`]: results,
        })),
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

  // If we have genres labels, we can to include a genre label (type/technique) tab.
  // We pick the first genre label that we consider to be visual if there is one,
  // otherwise we pick the first genre label.
  if (genresLabels.length > 0) {
    const visualGenre = genresLabels.find(label =>
      visualGenres.includes(label)
    );
    const chosenGenre = visualGenre || genresLabels[0];
    const id = toHtmlId(chosenGenre);
    config[`genres-${id}`] = {
      text: chosenGenre,
      params: {
        'genres.label': [chosenGenre],
        // The genres we chose comes from what is available when using the first subject labels as a filter
        // so we also wanter to filter here by the subject labels as well as the genre label
        'subjects.label': subjectLabels.map(label => `"${label}"`),
      },
      aggregations: [],
      related: relatedWorks[`genres-${id}`],
      setRelated: (results: WorkBasic[]) =>
        setRelatedWorks(prev => ({ ...prev, [`genres-${id}`]: results })),
    };
  }
  return config;
}

const RelatedWorks: FunctionComponent<Props> = ({ work }) => {
  const [relatedWorks, setRelatedWorks] = useState<{
    [key: string]: WorkBasic[] | undefined;
  }>({});
  const [relatedTabConfig, setRelatedTabConfig] = useState<{
    [key: string]: {
      text: string;
      params: { [key: string]: string | string[] };
      aggregations: string[];
      related: WorkBasic[] | undefined;
      setRelated: (results: WorkBasic[]) => void;
    };
  }>({});

  // Set selected tab to first available tab
  const tabKeys = Object.keys(relatedTabConfig);
  const [selectedWorksTab, setSelectedWorksTab] = useState(tabKeys[0] || '');

  const serverData = useContext(ServerDataContext);

  useEffect(() => {
    // Reset related works and tab config when work changes
    setRelatedWorks({});
    (async () => {
      const config = await getRelatedTabConfig({
        work,
        relatedWorks,
        setRelatedWorks,
        serverData,
      });
      setRelatedTabConfig(config);
    })();
  }, [work.id]);

  useEffect(() => {
    setSelectedWorksTab(Object.keys(relatedTabConfig)[0] || '');
  }, [relatedTabConfig]);

  useEffect(() => {
    if (
      relatedTabConfig[selectedWorksTab] &&
      !relatedWorks?.[selectedWorksTab]
    ) {
      fetchRelated({
        work,
        serverData,
        params: relatedTabConfig[selectedWorksTab].params,
        setRelated: relatedTabConfig[selectedWorksTab].setRelated,
      });
    }
  }, [selectedWorksTab]);

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
        />
        {Object.keys(relatedTabConfig).map(tabKey => (
          <div
            key={tabKey}
            className={classNames({
              'is-hidden': selectedWorksTab !== tabKey,
            })}
          >
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
