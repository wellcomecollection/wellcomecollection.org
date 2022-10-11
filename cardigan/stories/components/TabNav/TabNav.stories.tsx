import { useState } from 'react';
import styled from 'styled-components';
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import Space from '@weco/common/views/components/styled/Space';

const Wrapper = styled(Space).attrs({
  v: { size: 'l', properties: ['margin-bottom'] },
})<{
  backgroundColor: 'white' | 'black';
}>`
  ${props =>
    props.backgroundColor &&
    `background-color: ${props.theme.color(props.backgroundColor)}`};
`;

const Template = ({ items, backgroundColor, ...rest }) => {
  const [selectedTab, setSelectedTab] = useState(items[0].id); //eslint-disable-line

  const itemsSelector = items.map(item => ({
    ...item,
    selected: selectedTab === item.id,
  }));

  return (
    <div className="container">
      <Wrapper backgroundColor={backgroundColor}>
        <TabNav
          id="story-tabs"
          items={itemsSelector}
          selectedTab="all"
          {...rest}
          setSelectedTab={setSelectedTab}
        />
      </Wrapper>
      <>
        {selectedTab === 'all' && (
          <div role="tabpanel" id="tabpanel-all" aria-labelledby="tab-all">
            All content
          </div>
        )}
        {selectedTab === 'slightly-longer' && (
          <div
            role="tabpanel"
            id="tabpanel-slightly-longer"
            aria-labelledby="tab-slightly-longer"
          >
            Slightly longer content
          </div>
        )}
        {selectedTab === 'pictures' && (
          <div
            role="tabpanel"
            id="tabpanel-pictures"
            aria-labelledby="tab-pictures"
          >
            Pictures content
          </div>
        )}
      </>
    </div>
  );
};
export const basic = Template.bind({});
basic.args = {
  backgroundColor: 'white',
  hasDivider: true,
  items: [
    {
      id: 'all',
      text: 'All',
    },
    {
      id: 'slightly-longer',
      text: 'Slightly longer title to test with',
    },
    {
      id: 'pictures',
      text: 'Pictures',
    },
  ],
};

basic.argTypes = {
  setSelectedTab: {
    table: { disable: true },
  },
  variant: {
    control: { type: 'inline-radio' },
    options: ['default', 'yellow', 'white'],
  },
  backgroundColor: {
    control: { type: 'inline-radio' },
    options: ['white', 'black'],
  },
};

basic.storyName = 'TabNav';
