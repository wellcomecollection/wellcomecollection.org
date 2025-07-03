import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import styled from 'styled-components';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import Tabs from '@weco/common/views/components/Tabs';
import Readme from '@weco/common/views/components/Tabs/README.mdx';

type WrapperProps = { $backgroundColor: 'white' | 'black' };
const Wrapper = styled(Space).attrs({
  $v: { size: 'l', properties: ['margin-bottom'] },
})<WrapperProps>`
  ${props =>
    props.$backgroundColor &&
    `background-color: ${props.theme.color(props.$backgroundColor)}`};
`;

const TabsContainer = ({ items, isWhite, tabBehaviour, ...rest }) => {
  const [selectedTab, setSelectedTab] = useState(items[0].id);

  return (
    <Container>
      <Wrapper $backgroundColor={isWhite ? 'black' : 'white'}>
        {tabBehaviour === 'navigate' ? (
          <Tabs
            tabBehaviour={tabBehaviour}
            label="bla"
            items={items}
            isWhite={isWhite}
            currentSection={selectedTab}
            {...rest}
          />
        ) : (
          <Tabs
            tabBehaviour={tabBehaviour}
            label="bla"
            items={items}
            isWhite={isWhite}
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
