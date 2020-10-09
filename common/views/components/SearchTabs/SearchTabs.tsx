import BaseTabs from '../BaseTabs/BaseTabs';
import styled from 'styled-components';
import Space from '../styled/Space';
import { useContext } from 'react';
import { AppContext } from '../AppContext/AppContext';
import Layout12 from '../Layout12/Layout12';

const Tab = styled(Space).attrs({
  as: 'span',
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: 'flex-inline',
})`
  background: ${props => props.theme.color('cream')};
  border-left: 1px solid ${props => props.theme.color('pumice')};
  border-top: 1px solid ${props => props.theme.color('pumice')};

  ${props =>
    props.isLast &&
    `
    border-right: 1px solid ${props.theme.color('pumice')};
  `}

  .is-active & {
    background: ${props => props.theme.color('white')};
  }

  .is-active:focus & {
    box-shadow: ${props =>
      props.isKeyboard ? props.theme.focusBoxShadow : null};
    position: relative;
    z-index: 1;
  }
`;

const TabPanel = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  background: ${props => props.theme.color('white')};
  border: 1px solid ${props => props.theme.color('pumice')};
`;

const SearchTabs = () => {
  const { isKeyboard } = useContext(AppContext);

  const tabs = [
    {
      id: 'tab-library-catalogue',
      tab: <Tab isKeyboard={isKeyboard}>Library catalogue</Tab>,
      tabPanel: <TabPanel>one</TabPanel>,
    },
    {
      id: 'tab-images',
      tab: (
        <Tab isKeyboard={isKeyboard} isLast={true}>
          Images
        </Tab>
      ),
      tabPanel: <TabPanel>two</TabPanel>,
    },
  ];

  return (
    <Layout12>
      <Space
        v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
        h={{ size: 'xl', properties: ['padding-left', 'padding-right'] }}
        className="bg-cream"
      >
        <BaseTabs tabs={tabs} label={'Tabs for search'} />
      </Space>
    </Layout12>
  );
};

export default SearchTabs;
