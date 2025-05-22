import { FunctionComponent, useContext, useEffect, useState } from 'react';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import WorksSearchResult from '@weco/content/components/WorksSearchResult'; // temporary
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
const getDecadeRange = (str: string) => {
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

const fetchRelated = async ({ data, params, setRelated, work }) => {
  const response = await catalogueQuery('works', {
    toggles: data.toggles,
    pageSize: 4, // In case we get the current work back, we will still have 3 to show
    params: {
      ...params,
      include: ['production', 'contributors'],
    },
  });
  if (response.type === 'ResultList') {
    setRelated(
      response.results
        .filter(result => result.id !== work.id) // Exclude the current work
        .slice(0, 3) // Only show 3 results
        .map(toWorkBasic)
    );
  }
};

// Returns a config object for tabs: one per subject label, plus date-range if present
function getRelatedTabConfig({ work, relatedWorks, setRelatedWorks }) {
  const subjectLabels = work.subjects.map(subject => subject.label);
  const dateRange = getDecadeRange(work.production[0].dates[0].label);
  const config: {
    [key: string]: {
      text: string;
      params: unknown; // TODO type
      related: WorkBasic[] | undefined;
      setRelated: (results: WorkBasic[]) => void;
    };
  } = {};

  subjectLabels.forEach(label => {
    config[`subject-${label}`] = {
      text: label,
      params: { 'subjects.label': [label] },
      related: relatedWorks[`subject-${label}`],
      setRelated: (results: WorkBasic[]) =>
        setRelatedWorks(prev => ({ ...prev, [`subject-${label}`]: results })),
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
  const data = useContext(ServerDataContext);

  useEffect(() => {
    fetchRelated({
      work,
      data,
      params: relatedTabConfig[selectedWorksTab].params,
      setRelated: relatedTabConfig[selectedWorksTab].setRelated,
    });
  }, [selectedWorksTab]);

  return (
    (relatedBySubject.length > 0 && (
      <Container>
        <Space $v={{ size: 'l', properties: ['padding-top'] }}>
          <h2>Related Works</h2>
          {relatedBySubject.map((result, i) => (
            <WorksSearchResult
              work={result}
              resultPosition={i}
              key={result.id}
            />
          ))}
        </Space>
      </Container>
    )) ||
    null
  );
};

export default RelatedWorks;
