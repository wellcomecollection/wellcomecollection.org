import { FunctionComponent } from 'react';

import { Work } from '@weco/content/services/wellcome/catalogue/types';

type Props = {
  work: Work;
};

const RelatedWorks: FunctionComponent<Props> = ({ work }) => {
  const subjects = work.subjects.map(subject => subject.label);
  return <h2>Related Works</h2>;
};

export default RelatedWorks;
