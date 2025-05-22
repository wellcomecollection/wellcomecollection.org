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

const RelatedWorks: FunctionComponent<Props> = ({ work }) => {
  const [relatedBySubject, setRelatedBySubject] = useState<WorkBasic[]>([]);
  const subjects = work.subjects.map(subject => subject.label);
  const bySubjectParams = {
    'subjects.label': subjects,
  };

  const data = useContext(ServerDataContext);

  useEffect(() => {
    if (subjects.length > 0) {
      fetchRelated({
        work,
        data,
        params: bySubjectParams,
        setRelated: setRelatedBySubject,
      });
    }
  }, [work]);

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
