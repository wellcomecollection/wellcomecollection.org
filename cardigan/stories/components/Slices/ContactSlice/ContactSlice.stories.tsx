import { linkTo } from '@storybook/addon-links';
import { Meta, StoryObj } from '@storybook/react';

import { contactSlice } from '@weco/cardigan/stories/data/slices';
import Buttons from '@weco/common/views/components/Buttons';
import Contact from '@weco/common/views/slices/Contact';

const meta: Meta<typeof Contact> = {
  title: 'Slices/Contact',
  component: Contact,
  args: { slice: contactSlice },
  argTypes: {
    slice: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof Contact>;

export const Basic: Story = {
  name: 'Contact',
  render: args => {
    return (
      <>
        <Contact {...args} />

        <p style={{ marginTop: '50px' }}>
          Component used:{' '}
          <Buttons
            variant="ButtonSolid"
            clickHandler={linkTo(`Components/Contact`)}
            text="Contact"
          />
        </p>
      </>
    );
  },
};
