import { Meta, StoryObj } from '@storybook/react';

import Accordion from '@weco/content/components/Accordion/Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    id: 'storybook',
    items: [
      {
        summary: 'Highlight Tour guides ',
        content: (
          <p>
            Body text is here:{' '}
            <ul>
              <li>bullet points</li>
              <li>more bullet points</li>
              <li>even more</li>
            </ul>
          </p>
        ),
      },
      {
        summary: 'Large print and magnifiers',
        content: (
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum saepe
            aspernatur doloribus beatae eveniet nam itaque asperiores voluptas
            molestiae aliquid. Mollitia alias ipsa dolore fuga praesentium
            accusamus tempore illum quae
          </p>
        ),
      },
      {
        summary: 'Sensory equipment',
        content: (
          <p>
            Odio aperiam perferendis debitis nesciunt. Ipsa, assumenda.
            Molestiae quasi quo ex dolorem sit quae corrupti illum, vero enim
            dicta minima blanditiis sequi.
          </p>
        ),
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const Template = args => <Accordion {...args} />;

export const Basic: Story = {
  name: 'Accordion',
  render: Template,
};
