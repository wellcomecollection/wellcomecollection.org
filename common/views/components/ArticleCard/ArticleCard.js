// @flow
import CompactCard from '../CompactCard/CompactCard';
import Image from '../Image/Image';
import type { Article } from '../../../model/articles';

type Props = {|
  article: Article,
  showPosition: boolean,
  xOfY: {| x: number, y: number |},
|};

const ArticleCard = ({ article, showPosition, xOfY }: Props) => {
  const partOfSerial = showPosition
    ? article.series
        .map(series => {
          const titles = series.schedule.map(item => item.title);
          const positionInSerial = titles.indexOf(article.title);
          return positionInSerial + 1;
        })
        .find(_ => _)
    : null;

  return (
    <CompactCard
      url={`/articles/${article.id}`}
      title={article.title || ''}
      partNumber={partOfSerial}
      color={article.color}
      labels={{ labels: article.labels }}
      description={article.promoText}
      urlOverride={article.promo && article.promo.link}
      Image={
        article.image &&
        article.image.crops &&
        article.image.crops.square && <Image {...article.image.crops.square} />
      }
      DateInfo={null}
      StatusIndicator={null}
      xOfY={xOfY}
    />
  );
};
export default ArticleCard;
