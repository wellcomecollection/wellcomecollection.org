import { Meta, StoryObj } from '@storybook/react';

import { ReadMeInfo } from '@weco/cardigan/config/decorators';
import { image as contentImage } from '@weco/cardigan/stories/data/images';
import { WobblyBottom } from '@weco/common/views/components/DecorativeEdge';
import Readme from '@weco/common/views/components/DecorativeEdge/README.mdx';
import PrismicImage from '@weco/common/views/components/PrismicImage';

const meta: Meta<typeof WobblyBottom> = {
  title: 'Components/DecorativeEdge/WobblyBottom',
  component: WobblyBottom,
  args: {
    backgroundColor: 'warmNeutral.300',
    children: <PrismicImage image={contentImage()} quality="low" />,
  },
  argTypes: {
    backgroundColor: {
      name: 'Background color',
      options: ['warmNeutral.300', 'white'],
      control: { type: 'radio' },
    },
    children: { table: { disable: true } },
  },
};
export default meta;

const Template = args => (
  <>
    <div style={{ maxWidth: '500px' }}>
      <WobblyBottom {...args} />
    </div>
    <ReadMeInfo Readme={Readme} />
  </>
);

type Story = StoryObj<typeof WobblyBottom>;

export const Basic: Story = {
  name: 'WobblyBottom',
  render: Template,
};
