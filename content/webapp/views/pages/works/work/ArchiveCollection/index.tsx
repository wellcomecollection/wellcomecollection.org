import { Work as WorkType } from '@weco/content/services/wellcome/catalogue/types';

import ArchiveCollectionHero from './ArchiveCollection.Hero';

const ArchiveCollectionLayout = ({ work }: { work: WorkType }) => {
  return <ArchiveCollectionHero work={work} />;
};

export default ArchiveCollectionLayout;
