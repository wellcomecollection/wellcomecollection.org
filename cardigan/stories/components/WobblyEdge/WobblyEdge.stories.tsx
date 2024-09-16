import { ReadMeInfo } from '@weco/cardigan/config/decorators';
import { image as contentImage } from '@weco/cardigan/stories/data/images';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { WobblyBottom } from '@weco/common/views/components/WobblyEdge';
import Readme from '@weco/common/views/components/WobblyEdge/README.md';

const Template = args => (
  <>
    <div style={{ maxWidth: '500px' }}>
      <WobblyBottom {...args} />
    </div>
    <ReadMeInfo Readme={Readme} />
  </>
);
export const basic = Template.bind({});
basic.args = {
  backgroundColor: 'warmNeutral.300',
  children: <PrismicImage image={contentImage()} quality="low" />,
};
basic.storyName = 'WobblyBottom';
