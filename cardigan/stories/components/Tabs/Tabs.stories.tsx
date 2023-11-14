import { useState } from 'react';
import styled from 'styled-components';
import Tabs from '@weco/content/components/Tabs';
import Space from '@weco/common/views/components/styled/Space';
import { Container } from '@weco/common/views/components/styled/Container';

type WrapperProps = { $backgroundColor: 'white' | 'black' };
const Wrapper = styled(Space).attrs({
  $v: { size: 'l', properties: ['margin-bottom'] },
})<WrapperProps>`
  ${props =>
    props.$backgroundColor &&
    `background-color: ${props.theme.color(props.$backgroundColor)}`};
`;

const Template = ({ items, isWhite, ...rest }) => {
  const [selectedTab, setSelectedTab] = useState(items[0].id); //eslint-disable-line

  return (
    <Container>
      <Wrapper $backgroundColor={isWhite ? 'black' : 'white'}>
        <Tabs
          id="bla"
          items={items}
          isWhite={isWhite}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          {...rest}
        />
      </Wrapper>
    </Container>
  );
};

export const basic = Template.bind({});
basic.args = {
  isWhite: false,
  items: [
    {
      id: 'all',
      text: 'All',
      url: {
        href: '#one',
        as: '#one',
      },
    },
    {
      id: 'slightly-longer',
      text: 'Slightly longer title to test with',
      url: {
        href: '#two',
        as: '#two',
      },
    },
    {
      id: 'pictures',
      text: 'Pictures',
      url: {
        href: '#three',
        as: '#three',
      },
    },
  ],
};

basic.storyName = 'Tabs';
