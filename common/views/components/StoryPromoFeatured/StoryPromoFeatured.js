// @flow

import StoryPromo from '../StoryPromo/StoryPromo';
import { type Article } from '@weco/common/model/articles';

type Props = {|
  item: Article,
|};

const StoryPromoFeatured = ({ item }: Props) => (
  <div className="story-promo-featured">
    <StoryPromo
      item={item}
      position={1}
      hasTransparentBackground={true}
      sizesQueries={`(min-width: 1420px) 812px, (min-width: 600px) 58.5vw, calc(100vw - 36px)`}
    />
  </div>
);

export default StoryPromoFeatured;
