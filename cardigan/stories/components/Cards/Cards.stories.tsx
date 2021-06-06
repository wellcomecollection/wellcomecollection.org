import CompactCard from '@weco/common/views/components/CompactCard/CompactCard';
import BannerCard from '@weco/common/views/components/BannerCard/BannerCard';
import FeaturedCard from '@weco/common/views/components/FeaturedCard/FeaturedCard';

import { UiImage } from '@weco/common/views/components/Images/Images';
import {
  squareImage,
  singleLineOfText,
  bannerCardItem,
  image,
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
