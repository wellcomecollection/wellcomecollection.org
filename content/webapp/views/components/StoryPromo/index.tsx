import { FunctionComponent } from 'react';

import StoryPromoContent, {
  Props as StoryPromoContentProps,
} from './StoryPromo.ContentApi';
import StoryPromoPrismic, {
  Props as StoryPromoPrismicProps,
} from './StoryPromo.Prismic';

type Props =
  | (StoryPromoPrismicProps & { variant: 'prismic' })
  | (StoryPromoContentProps & { variant: 'contentApi' });

const StoryPromo: FunctionComponent<Props> = props => {
  const { variant } = props;

  return (
    <div data-component="story-promo">
      {variant === 'prismic' ? (
        <StoryPromoPrismic {...props} />
      ) : (
        <StoryPromoContent {...props} />
      )}
    </div>
  );
};

export default StoryPromo;
