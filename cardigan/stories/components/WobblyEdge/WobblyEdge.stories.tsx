import { Meta, StoryObj } from '@storybook/react';

import { ReadMeInfo } from '@weco/cardigan/config/decorators';
import { image as contentImage } from '@weco/cardigan/stories/data/images';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import Readme from '@weco/common/views/components/WobblyEdge/README.mdx';

const meta: Meta<typeof WobblyEdge> = {
  title: 'Components/WobblyEdge/WobblyEdge',
  component: WobblyEdge,
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
      options: ['warmNeutral.300', 'white'],
      control: { type: 'radio' },
    },
    intensity: {
      control: {
        type: 'number',
        min: 0,
        max: 100,
        step: 10,
      },
    },
  },
};

const Template = args => {
  const { isRotated } = args;

  return (
    <>
      <div
        style={{
          maxWidth: '500px',
          padding: '20px 0',
          position: 'relative',
        }}
      >
        {isRotated && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              width: '100%',
            }}
          >
            <WobblyEdge {...args} />
          </div>
        )}
        <PrismicImage image={contentImage()} quality="low" />
        {!isRotated && <WobblyEdge {...args} />}
      </div>
      <ReadMeInfo Readme={Readme} />
    </>
  );
};

export default meta;

type Story = StoryObj<typeof WobblyEdge>;

export const Basic: Story = {
  name: 'WobblyEdge',
  render: Template,
};
