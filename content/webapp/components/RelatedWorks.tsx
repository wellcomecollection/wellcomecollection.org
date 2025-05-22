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

// TODO may change to century range
const getDecadeRange = (
  str: string
): { tabLabel: string; from: string; to: string } | null => {
  const match = str.match(/^(\d{4})$/);
  if (match) {
    const year = parseInt(match[0], 10);
    const decadeStart = Math.floor(year / 10) * 10;
    const decadeEnd = decadeStart + 10;
    return {
      tabLabel: `From ${decadeStart}`,
      from: `${decadeStart}-01-01`,
      to: `${decadeEnd}-12-31`,
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

// Returns a config object for tabs: one per subject label, plus date-range if present
function getRelatedTabConfig({ work, relatedWorks, setRelatedWorks }) {
  const subjectLabels = work.subjects.map(subject => subject.label).slice(0, 3);
  const dateRange = getDecadeRange(work.production[0].dates[0].label);
  const config: {
    [key: string]: {
      text: string;
      params: { [key: string]: string | string[] };
      related: WorkBasic[] | undefined;
      setRelated: (results: WorkBasic[]) => void;
    };
  } = {};

  subjectLabels.forEach(label => {
    const id = label.replace(/[^a-zA-Z0-9]/g, '-');
    config[`subject-${id}`] = {
      text: label,
      params: { 'subjects.label': [label] },
      related: relatedWorks[`subject-${id}`],
      setRelated: (results: WorkBasic[]) =>
        setRelatedWorks(prev => ({ ...prev, [`subject-${id}`]: results })),
    };
  });

  if (dateRange) {
    config['date-range'] = {
      text: dateRange.tabLabel,
      params: {
        // TODO do we want to filter by subject labels here too or just dates?
        // ...(subjectLabels.length > 0
        //   ? { 'subjects.label': subjectLabels }
        //   : {}),
        'production.dates.from': dateRange.from,
        'production.dates.to': dateRange.to,
      },
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

  const relatedTabConfig = getRelatedTabConfig({
    work,
    relatedWorks,
    setRelatedWorks,
  });

  // Set initial tab to first subject or date-range if no subjects
  const tabKeys = Object.keys(relatedTabConfig);
  const [selectedWorksTab, setSelectedWorksTab] = useState(tabKeys[0] || '');

  const serverData = useContext(ServerDataContext);

  useEffect(() => {
    // Only fetch if we haven't already fetched results for hte current tab
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
        setRelated: relatedTabConfig[selectedWorksTab].setRelated,
      });
    }
  }, [selectedWorksTab, work.id]);

  return (
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
          // trackWithSegment
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
