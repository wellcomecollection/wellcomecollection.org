import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import styled from 'styled-components';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import Tabs from '@weco/content/views/components/Tabs';
import Readme from '@weco/content/views/components/Tabs/README.mdx';

type WrapperProps = { $backgroundColor: 'white' | 'black' };
const Wrapper = styled(Space).attrs({
  $v: { size: 'l', properties: ['margin-bottom'] },
})<WrapperProps>`
  ${props =>
    props.$backgroundColor &&
    `background-color: ${props.theme.color(props.$backgroundColor)}`};
`;

const TabsContainer = ({ items, isWhite, isPill, tabBehaviour, ...rest }) => {
  const [selectedTab, setSelectedTab] = useState(items[0].id);

  return (
    <Container>
      <Wrapper $backgroundColor={isWhite ? 'black' : 'white'}>
        {tabBehaviour === 'navigate' && !isPill ? (
          <Tabs
            tabBehaviour="navigate"
            label="navigate-behaviour-tab"
            items={items}
            isWhite={isWhite}
            currentSection={selectedTab}
            {...rest}
          />
        ) : (
          <Tabs
            tabBehaviour="switch"
            label="browse-behaviour-tab"
            items={items}
            isWhite={isWhite}
            isPill={isPill}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            {...rest}
          />
        )}
      </Wrapper>
    </Container>
  );
};

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    tabBehaviour: 'switch',
    isWhite: false,
    isPill: false,
    hideBorder: false,
    items: [
      {
        id: 'all',
        text: 'All',
        url: '#one',
      },
      {
        id: 'slightly-longer',
        text: 'Slightly longer title to test with',
        url: '#two',
      },
      {
        id: 'pictures',
        text: 'Pictures',
        url: '#three',
      },
    ],
  },
  argTypes: {
    isWhite: {
      control: 'boolean',
      name: 'Dark mode',
    },
    hideBorder: {
      control: 'boolean',
      name: 'Has no bottom border',
    },
    isPill: {
      control: 'boolean',
      name: 'Pill style (switch)',
    },
    tabBehaviour: {
      table: { disable: true },
    },
    items: {
      table: { disable: true },
    },
  },
  parameters: {
    chromatic: { delay: 1000 },
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Basic: Story = {
  name: 'Tabs',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={TabsContainer}
      args={args}
      Readme={Readme}
    />
  ),
};
