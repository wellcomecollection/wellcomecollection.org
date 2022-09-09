import { FC } from 'react';
import { font } from '@weco/common/utils/classnames';
import { readingTime } from 'reading-time-estimator';
import { Article } from '../../types/articles';

export type Props = {
  article: Article;
};

const ReadingTimeIndicator: FC<Props> = ({ article }) => {
  const readingTimeEstimate = readingTime(article.body.toString());
  return (
    <p className={`${font('intb', 5)} no-margin`}>
      reading time:{' '}
      <span className={font('intr', 5)}>{readingTimeEstimate}</span>
    </p>
  );
};

export default ReadingTimeIndicator;
