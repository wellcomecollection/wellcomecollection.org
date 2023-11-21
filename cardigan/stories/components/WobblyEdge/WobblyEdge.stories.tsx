import { WobblyBottom } from '@weco/common/views/components/WobblyEdge';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { image as contentImage } from '@weco/cardigan/stories/content';
import Readme from '@weco/common/views/components/WobblyEdge/README.md';
import { ReadMeInfo } from '../../../config/decorators';

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
