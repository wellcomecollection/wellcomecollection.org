import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { styled } from 'storybook/theming';

import { font } from '@weco/common/utils/classnames';
import { gridSize12 } from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';

const MockScrollableItem = styled.li`
  flex: 0 0 auto;
  width: 400px;
  height: 300px;
  background-color: ${props => props.theme.color('neutral.600')};
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.color('white')};
`;

const DetailsCopy = styled.span`
  color: ${props => props.theme.color('black')};
`;

type StoryProps = ComponentProps<typeof ScrollContainer> & {
  hasCopy: boolean;
};

const meta: Meta<StoryProps> = {
  title: 'Components/ScrollContainer',
  component: ScrollContainer,
  args: {
    hasDarkBackground: false,
    hasLeftOffset: false,
    scrollButtonsAfter: false,
    useShim: true,
    gridSizes: gridSize12(),
    hasCopy: true,
  },
  argTypes: {
    hasCopy: {
      name: 'Has extra copy added through code',
      control: 'boolean',
    },
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
    CopyContent: { table: { disable: true } },
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

type Story = StoryObj<StoryProps>;

const Template = args => {
  const { hasDarkBackground, hasCopy } = args;

  return (
    <div
      style={{
        padding: '20px 0',
        backgroundColor: hasDarkBackground
          ? themeValues.color('black')
          : 'transparent',
      }}
    >
      <ScrollContainer
        {...args}
        CopyContent={
          hasCopy ? (
            <>
              <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
                <h2 className={font('sans-bold', 2)}>
                  Title for this component
                </h2>
              </Space>
              <DetailsCopy className={font('sans', -2)}>
                Scroll container details (x results)
              </DetailsCopy>
            </>
          ) : undefined
        }
      >
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
