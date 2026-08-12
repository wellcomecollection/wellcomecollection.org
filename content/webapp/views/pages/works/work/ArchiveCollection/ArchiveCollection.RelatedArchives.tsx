import { FunctionComponent } from 'react';

import {
  Grid,
  GridCell,
  SizeMap,
} from '@weco/common/views/components/styled/Grid';
import ArchiveCard from '@weco/content/views/components/ArchiveCard';

const cardSizeMap: SizeMap = { s: [12], m: [6], l: [3], xl: [3] };

// TODO: replace with real related archives data once available
const relatedArchives = Array.from({ length: 8 }, (_, i) => ({
  id: `related-archive-${i + 1}`,
  label: 'Societies and Associations',
  title: 'Brent Sickle Cell and Thalassaemia Centre',
  description: 'The collection contains materials coll...',
  contributor: 'Brent Sickle Cell and Thalassaemia Centre',
  isOrganisation: true,
  date: '1980s-2010s',
  extent: '19 boxes, 33 videocassettes, 3 DVDs, 6 audio cassettes, 1 CD-ROM...',
}));

const ArchiveCollectionRelatedArchives: FunctionComponent = () => {
  return (
    <Grid>
      {relatedArchives.map((archive, index) => (
        <GridCell key={archive.id} $sizeMap={cardSizeMap}>
          <ArchiveCard
            {...archive}
            dataGtmProps={{
              'category-label': 'Related archives',
              id: archive.id,
              'position-in-list': `${index + 1}`,
            }}
          />
        </GridCell>
      ))}
    </Grid>
  );
};

export default ArchiveCollectionRelatedArchives;
