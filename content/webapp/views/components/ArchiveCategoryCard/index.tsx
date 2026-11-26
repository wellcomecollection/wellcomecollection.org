// eslint-data-component: intentionally omitted
// (renders only ImageGridCard, which declares its own data-component)
import { FunctionComponent } from 'react';

import { pluralize } from '@weco/common/utils/grammar';
import { DataGtmProps } from '@weco/common/utils/gtm';
import ImageGridCard from '@weco/common/views/components/ImageGridCard';
import type { ArchiveCategory } from '@weco/content/services/wellcome/catalogue/archiveCategories';
import { toArchiveCategoryLink } from '@weco/content/views/components/ArchiveCategoryLink';

const ArchiveCategoryCard: FunctionComponent<{
  archiveCategory: ArchiveCategory;
  dataGtmProps: DataGtmProps;
}> = ({ archiveCategory, dataGtmProps }) => (
  <ImageGridCard
    images={[archiveCategory.image]}
    title={`${archiveCategory.label} (${archiveCategory.id})`}
    description={archiveCategory.shortDescription}
    meta={pluralize(archiveCategory.count, 'archive collection')}
    linkProps={toArchiveCategoryLink({ slug: archiveCategory.slug })}
    dataGtmProps={{
      trigger: 'theme_promo_card',
      id: archiveCategory.id,
      ...dataGtmProps,
    }}
    hasPlainPlaceholder
  />
);

export default ArchiveCategoryCard;
