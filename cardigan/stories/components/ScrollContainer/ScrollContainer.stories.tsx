import { Meta, StoryObj } from '@storybook/react';
import { styled } from 'storybook/theming';

import { gridSize12 } from '@weco/common/views/components/Layout';
import ScrollContainer from '@weco/common/views/components/ScrollContainer';
import { themeValues } from '@weco/common/views/themes/config';

const MockScrollableItem = styled.li`
  flex: 0 0 auto;
  width: 400px;
  height: 300px;
  background-color: ${themeValues.color('neutral.600')};
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${themeValues.color('white')};
`;

const meta: Meta<typeof ScrollContainer> = {
  title: 'Components/ScrollContainer',
  component: ScrollContainer,
  args: {
    detailsCopy: 'Scroll container details (x results)',
    description:
      'Description about manuscripts in the Collection, number of collections and percentage within the collection.',
    hasDarkBackground: false,
    hasLeftOffset: false,
    scrollButtonsAfter: false,
    useShim: true,
    gridSizes: gridSize12(),
  },
  argTypes: {
    detailsCopy: { name: 'Details copy', control: 'text' },
    description: { name: 'Description', control: 'text' },
    hasDarkBackground: {
      name: 'Has dark background',
      control: 'boolean',
    },
    hasLeftOffset: {
      name: 'Has left offset',
      control: 'boolean',
    },
    scrollButtonsAfter: {
      name: 'Scroll buttons after content',
      control: 'boolean',
    },
    useShim: {
      name: 'Use scroll shim',
      control: 'boolean',
    },
    containerRef: { table: { disable: true } },
    gridSizes: { table: { disable: true } },
  },
  parameters: {
    chromatic: {
      viewports: [375, 1200],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ScrollContainer>;

const Template = args => {
  const { hasDarkBackground } = args;

  return (
    <div
      style={{
        padding: '20px 0',
        backgroundColor: hasDarkBackground
          ? themeValues.color('black')
          : 'transparent',
      }}
    >
      <ScrollContainer {...args}>
        <MockScrollableItem>Item 1</MockScrollableItem>
        <MockScrollableItem>Item 2</MockScrollableItem>
        <MockScrollableItem>Item 3</MockScrollableItem>
        <MockScrollableItem>Item 4</MockScrollableItem>
        <MockScrollableItem>Item 5</MockScrollableItem>
        <MockScrollableItem>Item 6</MockScrollableItem>
      </ScrollContainer>
    </div>
  );
};

export const Basic: Story = {
  name: 'ScrollContainer',
  render: Template,
};
