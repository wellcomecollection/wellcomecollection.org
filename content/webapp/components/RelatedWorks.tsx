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
type Props = {
  work: Work;
};

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
  const typeTechniques = work.genres.map(genres => genres.label).slice(0, 3);

  const config: {
    [key: string]: {
      text: string;
      params: { [key: string]: string | string[] };
      related: WorkBasic[] | undefined;
      setRelated: (results: WorkBasic[]) => void;
    };
  } = {};

  subjectLabels.forEach(async label => {
    const id = toHtmlId(label);
    config[`subject-${id}`] = {
      text: label,
      params: { 'subjects.label': [`"${label}"`] },
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
        'subjects.label': subjectLabels.map(label => `"${label}"`),
        'production.dates.from': dateRange.from,
        'production.dates.to': dateRange.to,
      },
      related: relatedWorks['date-range'],
      setRelated: (results: WorkBasic[]) =>
        setRelatedWorks(prev => ({ ...prev, 'date-range': results })),
    };
  }

  typeTechniques.forEach(async label => {
    const id = toHtmlId(label);
    config[`type-${id}`] = {
      text: label,
      params: {
        'subjects.label': subjectLabels.map(label => `"${label}"`),
        'genres.label': [`"${label}"`],
      },
      related: relatedWorks[`type-${id}`],
      setRelated: (results: WorkBasic[]) =>
        setRelatedWorks((prev: { [key: string]: WorkBasic[] | undefined }) => ({
          ...prev,
          [`type-${id}`]: results,
        })),
    };
  });

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
      related: WorkBasic[] | undefined;
      setRelated: (results: WorkBasic[]) => void;
    };
  }>({});

  // Set selected tab to first available tab
  const tabKeys = Object.keys(relatedTabConfig);
  const [selectedWorksTab, setSelectedWorksTab] = useState(tabKeys[0] || '');

  const serverData = useContext(ServerDataContext);

  useEffect(() => {
    // Reset selected tab, related works and tab config when work changes
    setSelectedWorksTab('');
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
