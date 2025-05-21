import { FunctionComponent, useContext, useEffect, useState } from 'react';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';
import { Work } from '@weco/content/services/wellcome/catalogue/types';

type Props = {
  work: Work;
};

const RelatedWorks: FunctionComponent<Props> = ({ work }) => {
  const [relatedContent, setRelatedContent] = useState([]);
  const subjects = work.subjects.map(subject => subject.label);
  const data = useContext(ServerDataContext);

  useEffect(() => {
    const fetchRelatedContent = async () => {
      const response = await catalogueQuery('works', {
        toggles: data.toggles,
        pageSize: 3,
        params: {
          'subjects.label': subjects,
        },
      });
      if (response.type === 'ResultList') {
        setRelatedContent(response.results);
      }
    };
    if (subjects.length > 0) {
      fetchRelatedContent();
    }
  }, [work]);
  return <h2>Related Works</h2>;
};

export default RelatedWorks;
