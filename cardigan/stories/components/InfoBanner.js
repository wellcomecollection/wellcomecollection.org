import { storiesOf } from '@storybook/react';
import InfoBanner from '../../../common/views/components/InfoBanner/InfoBanner';
import Readme from '../../../common/views/components/InfoBanner/README.md';

const InfoBannerExample = () => {
  return (
    <InfoBanner
      text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily.`}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('InfoBanner', InfoBannerExample, { readme: { sidebar: Readme } });
