import StoryPromo from '../StoryPromo/StoryPromo';

type Props = {|
  item: Article
|}

const StoryPromoFeatured = ({item}: Props) => (
  <div className='story-promo-featured'>
    <StoryPromo
      item={item}
      position={`1`}
      hasTransparentBackground={true}
    />
  </div>
);

export default StoryPromoFeatured;
