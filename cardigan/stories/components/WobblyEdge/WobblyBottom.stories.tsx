import { Meta, StoryObj } from '@storybook/react';

import { ReadMeInfo } from '@weco/cardigan/config/decorators';
import { image as contentImage } from '@weco/cardigan/stories/data/images';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import { WobblyBottom } from '@weco/common/views/components/WobblyEdge';
import Readme from '@weco/common/views/components/WobblyEdge/README.mdx';

const Template = args => (
  <>
    <div style={{ maxWidth: '500px' }}>
      <WobblyBottom {...args} />
    </div>
    <ReadMeInfo Readme={Readme} />
  </>
);

const meta: Meta<typeof WobblyBottom> = {
  title: 'Components/WobblyEdge/WobblyBottom',
  component: WobblyBottom,
  args: {
    backgroundColor: 'warmNeutral.300',
    children: <PrismicImage image={contentImage()} quality="low" />,
  },
};

export default meta;

type Story = StoryObj<typeof WobblyBottom>;

export const Basic: Story = {
  name: 'WobblyBottom',
  render: Template,
};
