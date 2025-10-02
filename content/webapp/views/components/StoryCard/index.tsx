import { FunctionComponent } from 'react';

import StoryCardContent, {
  Props as StoryCardContentProps,
} from './StoryCard.ContentApi';
import StoryCardPrismic, {
  Props as StoryCardPrismicProps,
} from './StoryCard.Prismic';

type Props =
  | (StoryCardPrismicProps & { variant: 'prismic' })
  | (StoryCardContentProps & { variant: 'contentApi' });

const StoryCard: FunctionComponent<Props> = props => {
  const { variant } = props;

  return (
    <>
      {variant === 'prismic' ? (
        <StoryCardPrismic data-component="story-promo-prismic" {...props} />
      ) : (
        <StoryCardContent data-component="story-promo-content" {...props} />
      )}
    </>
  );
};

export default StoryCard;
