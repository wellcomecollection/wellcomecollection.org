// @flow
import CompactCard from '../CompactCard/CompactCard';
import Image from '../Image/Image';
import type {Article} from '../../../model/articles';

type Props = {|
  article: Article,
  showPosition: boolean
|}

const ArticleCard = ({ article, showPosition }: Props) => {
  const partOfSerial = showPosition ? article.series
    .map(series => {
      const titles = series.schedule.map(item => item.title);
      const positionInSerial = titles.indexOf(article.title);
      return positionInSerial + 1;
    }).find(_ => _) : null;

  return (<CompactCard
    promoType='ArticlePromo'
    url={`/articles/${article.id}`}
    title={article.title || ''}
    partNumber={partOfSerial}
    color={article.color}
    labels={{labels: article.labels}}
    description={article.promoText}
    urlOverride={article.promo && article.promo.link}
    Image={article.promo && article.promo.image && <Image {...article.promo.image} />}
    DateInfo={null}
    StatusIndicator={null}
  />);
};
export default ArticleCard;
