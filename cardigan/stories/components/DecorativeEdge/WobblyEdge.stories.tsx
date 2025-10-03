import { Meta, StoryObj } from '@storybook/react';

import { ReadMeInfo } from '@weco/cardigan/config/decorators';
import { image as contentImage } from '@weco/cardigan/stories/data/images';
import DecorativeEdge from '@weco/common/views/components/DecorativeEdge';
import Readme from '@weco/common/views/components/DecorativeEdge/README.mdx';
import PrismicImage from '@weco/common/views/components/PrismicImage';

const meta: Meta<typeof DecorativeEdge> = {
  title: 'Components/DecorativeEdge/WobblyEdge',
  component: DecorativeEdge,
  args: {
    backgroundColor: 'warmNeutral.300',
    isValley: false,
    isRotated: false,
    intensity: 50,
    points: 5,
    isStatic: false,
  },
  argTypes: {
    backgroundColor: {
      name: 'Background color',
      options: ['warmNeutral.300', 'white'],
      control: { type: 'radio' },
    },
    intensity: {
      name: 'Intensity',
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 10,
      },
    },
    isValley: { name: 'Is valley', control: 'boolean' },
    points: {
      name: 'Number of points',
      control: {
        type: 'range',
        min: 2,
        max: 10,
        step: 1,
      },
    },
    isStatic: { name: 'Static (no animation)', control: 'boolean' },
    isRotated: { name: 'Rotate (for top edges)', control: 'boolean' },
  },
};

const Template = args => {
  const { isRotated } = args;

  return (
    <>
      <div
        style={{ maxWidth: '500px', padding: '20px 0', position: 'relative' }}
      >
        {isRotated && (
          <div style={{ position: 'absolute', top: '20px', width: '100%' }}>
            <DecorativeEdge {...args} />
          </div>
        )}
        <PrismicImage image={contentImage()} quality="low" />
        {!isRotated && <DecorativeEdge {...args} />}
      </div>
      <ReadMeInfo Readme={Readme} />
    </>
  );
};

export default meta;

type Story = StoryObj<typeof DecorativeEdge>;

export const Basic: Story = {
  name: 'WobblyEdge',
  render: Template,
};
