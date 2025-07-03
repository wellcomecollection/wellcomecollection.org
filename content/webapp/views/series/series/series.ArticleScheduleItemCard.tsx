import { FunctionComponent } from 'react';

import { formatDate } from '@weco/common/utils/format-date';
import CompactCard from '@weco/common/views/components/CompactCard';
import ImagePlaceholder from '@weco/common/views/components/ImagePlaceholder';
import { ArticleScheduleItem } from '@weco/content/types/article-schedule-items';

type Props = {
  item: ArticleScheduleItem;
  xOfY: { x: number; y: number };
};

const ArticleScheduleItemCard: FunctionComponent<Props> = ({ item, xOfY }) => (
  <CompactCard
    title={item.title}
    partNumber={item.partNumber}
    partNumberColor={item.color}
    primaryLabels={
      /* We don't show a label on items that haven't been published yet, because
       * we don't know whether they're a story, comic, etc.
       * See https://github.com/wellcomecollection/wellcomecollection.org/pull/7568 */
      []
    }
    secondaryLabels={[]}
    description={`Available ${formatDate(item.publishDate)}`}
    Image={<ImagePlaceholder backgroundColor={item.color} />}
    xOfY={xOfY}
  />
);

export default ArticleScheduleItemCard;
