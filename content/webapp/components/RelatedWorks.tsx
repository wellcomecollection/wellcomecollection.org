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

const RelatedWorks: FunctionComponent<Props> = ({ work }) => {
  const [relatedContent, setRelatedContent] = useState<WorkBasic[]>([]);
  const subjects = work.subjects.map(subject => subject.label);
  const data = useContext(ServerDataContext);

  useEffect(() => {
    const fetchRelatedContent = async () => {
      const response = await catalogueQuery('works', {
        toggles: data.toggles,
        pageSize: 4, // In case we get the current work back, we will still have 3 to show
        params: {
          'subjects.label': subjects,
          include: ['production', 'contributors'],
        },
      });
      if (response.type === 'ResultList') {
        setRelatedContent(
          response.results
            .filter(content => content.id !== work.id) // Exclude the current work
            .slice(0, 3) // Only show 3 results
            .map(toWorkBasic)
        );
      }
    };
    if (subjects.length > 0) {
      fetchRelatedContent();
    }
  }, [work]);
  return (
    (relatedContent.length > 0 && (
      <Container>
        <Space $v={{ size: 'l', properties: ['padding-top'] }}>
          <h2>Related Works</h2>
          {relatedContent.map((result, i) => (
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
