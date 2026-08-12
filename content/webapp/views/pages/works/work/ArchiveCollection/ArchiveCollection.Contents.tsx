import { FunctionComponent } from 'react';

import { Work as WorkType } from '@weco/content/services/wellcome/catalogue/types';
import ArchiveTree from '@weco/content/views/pages/works/work/ArchiveTree';

const ArchiveCollectionContents: FunctionComponent<{ work: WorkType }> = ({
  work,
}) => {
  return <ArchiveTree work={work} />;
};

export default ArchiveCollectionContents;
