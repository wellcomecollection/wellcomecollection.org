import CompactCard from '@weco/common/views/components/CompactCard/CompactCard';
import BannerCard from '@weco/common/views/components/BannerCard/BannerCard';
import FeaturedCard from '@weco/common/views/components/FeaturedCard/FeaturedCard';
import EventPromo from '@weco/common/views/components/EventPromo/EventPromo';
import ExhibitionPromo from '@weco/common/views/components/ExhibitionPromo/ExhibitionPromo';
import StoryPromo from '@weco/common/views/components/StoryPromo/StoryPromo';

import { UiImage } from '@weco/common/views/components/Images/Images';
import {
  squareImage,
  singleLineOfText,
  bannerCardItem,
  article,
  image,
  event,
  url,
} from '../../content';

const primaryLabelList = [{ text: 'Study day' }, { text: 'Schools' }];
const secondaryLabelList = [{ text: 'Speech-to-text' }];
const imageProps = squareImage();

const CompactCardTemplate = args => <CompactCard {...args} />;
export const compactCard = CompactCardTemplate.bind({});
compactCard.args = {
  url: 'https://wellcomecollection.org',
  title: 'Wellcome Collection',
  description: singleLineOfText(10, 25),
  Image: <UiImage {...imageProps} tasl={null} />,
  DateInfo: null,
  Tags: null,
  primaryLabels: primaryLabelList,
  secondaryLabels: secondaryLabelList,
  xOfY: [1, 1],
};
compactCard.storyName = 'CompactCard';
compactCard.parameters = {
  gridSizes: { s: 12, m: 10, l: 8, xl: 8 },
};

const BannerCardTemplate = args => <BannerCard {...args} />;
export const bannerCard = BannerCardTemplate.bind({});
bannerCard.args = {
  item: bannerCardItem,
};
bannerCard.storyName = 'BannerCard';

const FeaturedCardTemplate = args => {
  return (
    <FeaturedCard
      image={{ ...image(), showTasl: false }}
      labels={[{ text: 'Essay' }]}
      title={`Remote diagnosis from wee to web`}
      link={{ url: '#', text: 'Remote diagnosis from wee to the web' }}
      background={args.background}
      color={args.color}
      isReversed={args.isReversed}
    >
      <h2 className="font-wb font-size-2">
        Remote diagnosis from wee to the Web
      </h2>
      <p className="font-hnl font-size-5">
        Medical practice might have moved on from when patients posted flasks of
        their urine for doctors to taste, but telehealth today keeps up the
        tradition of remote diagnosis – to our possible detriment.
      </p>
    </FeaturedCard>
  );
};
export const featuredCard = FeaturedCardTemplate.bind({});
featuredCard.args = {
  background: 'charcoal',
  color: 'white',
  isReversed: false,
};
featuredCard.storyName = 'FeaturedCard';

const EventPromoTemplate = args => <EventPromo {...args} />;
export const eventPromo = EventPromoTemplate.bind({});
eventPromo.args = {
  position: 0,
  event: event,
};
eventPromo.parameters = {
  gridSizes: { s: 12, m: 6, l: 4, xl: 4 },
};
eventPromo.storyName = 'EventPromo';

const ExhibitionPromoTemplate = args => <ExhibitionPromo {...args} />;
export const exhibitionPromo = ExhibitionPromoTemplate.bind({});
exhibitionPromo.args = {
  id: '1',
  url: url,
  format: { title: 'Permanent' },
  image: image(),
  title: 'Being Human',
  start: null,
  end: null,
  statusOverride: null,
};
exhibitionPromo.parameters = {
  gridSizes: { s: 12, m: 6, l: 4, xl: 4 },
};
exhibitionPromo.storyName = 'ExhibitionPromo';

const StoryPromoTemplate = args => <StoryPromo {...args} />;
export const storyPromo = StoryPromoTemplate.bind({});
storyPromo.args = {
  item: article,
  position: 0,
};
storyPromo.parameters = {
  gridSizes: { s: 12, m: 6, l: 4, xl: 4 },
};
storyPromo.storyName = 'StoryPromo';
