// @flow
import CompactCard from '../CompactCard/CompactCard';
import Image from '../Image/Image';
import type {Article} from '../../../model/articles';

type Props = {|
  article: Article
|}

const ArticleCard = ({ article }: Props) => {
  return (<CompactCard
    promoType='ArticlePromo'
    url={`/articles/${article.id}`}
    title={article.title || ''}
    labels={{labels: [{url: null, text: 'Article'}]}}
    description={article.promoText}
    urlOverride={article.promo && article.promo.link}
    Image={article.promo && article.promo.image && <Image {...article.promo.image} />}
    DateInfo={null}
    StatusIndicator={null}
  />);
};
export default ArticleCard;
