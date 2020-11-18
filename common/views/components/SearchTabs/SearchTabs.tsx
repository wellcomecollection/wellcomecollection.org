import BaseTabs, { TabType } from '../BaseTabs/BaseTabs';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Space from '../styled/Space';
import { useContext, useState, FunctionComponent, ReactElement } from 'react';
import { AppContext } from '../AppContext/AppContext';
import PrototypeSearchForm from '@weco/common/views/components/PrototypeSearchForm/PrototypeSearchForm';
import {
  WorksRouteProps,
  ImagesRouteProps,
} from '@weco/common/services/catalogue/ts_routes';
import {
  CatalogueAggregationBucket,
  CatalogueAggregations,
} from '@weco/common/model/catalogue';
import { trackEvent } from '@weco/common/utils/ga';

const DelayUnenhanced = styled.div<{ isEnhanced: boolean }>`
  opacity: ${props => (props.isEnhanced ? '1' : '0')};
  height: ${props => (props.isEnhanced ? 'auto' : '0')};
  overflow: ${props => (props.isEnhanced ? 'visible' : 'hidden')};
  animation: ${props => props.theme.keyframes.showUnenhanced} 1ms 1s forwards;

  ${props =>
    props.isEnhanced &&
    `
    animation: none;
  `}
`;

const BaseTabsWrapper = styled(DelayUnenhanced)`
  // FIXME: For testing, make the checkboxes/buttons have a white background because they're on grey
  [class*='ButtonInline__InlineButton'],
  [class^='CheckboxRadio__CheckboxRadioBox'] {
    background: white !important;
  }
`;

const Tab = styled(Space).attrs({
  as: 'span',
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'flex-inline': true,
    [font('hnm', 5)]: true,
  }),
})`
  background: ${props => props.theme.color('white')};
  border-left: 1px solid #e1e1e1;
  border-top: 1px solid #e1e1e1;

  ${props =>
    props.isLast &&
    `
    border-right: 1px solid #e1e1e1;
  `}

  ${props =>
    props.isActive &&
    `
    background: #e1e1e1;
  `}

  ${props =>
    props.isFocused &&
    `
    box-shadow: ${props.isKeyboard ? props.theme.focusBoxShadow : null};
    position: relative;
    z-index: 1;
  `}
`;

const TabPanel = styled(Space)`
  background: #e1e1e1;
`;
type Props = {
  worksRouteProps: WorksRouteProps;
  imagesRouteProps: ImagesRouteProps;
  workTypeAggregations: CatalogueAggregationBucket[];
  shouldShowDescription: boolean;
  activeTabIndex?: number;
  aggregations?: CatalogueAggregations;
};

const SearchTabs: FunctionComponent<Props> = ({
  worksRouteProps,
  imagesRouteProps,
  workTypeAggregations,
  aggregations,
  shouldShowDescription,
  activeTabIndex,
}: Props): ReactElement<Props> => {
  const { isKeyboard, isEnhanced } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(
    activeTabIndex === 0 ? 'tab-library-catalogue' : 'tab-images'
  );
  const tabs: TabType[] = [
    {
      id: 'tab-library-catalogue',
      tab: function TabWithDisplayName(isActive, isFocused) {
        return (
          <Tab
            isActive={isActive}
            isFocused={isFocused}
            isKeyboard={isKeyboard}
          >
            Library catalogue
          </Tab>
        );
      },
      tabPanel: (
        <TabPanel>
          <Space
            v={{ size: 'm', properties: ['padding-top'] }}
            h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
            className={classNames({
              'visually-hidden': !shouldShowDescription,
              [font('hnl', 5)]: true,
            })}
            id="library-catalogue-form-description"
          >
            Find thousands of books, images, artworks, unpublished archives and
            manuscripts in our collections, many of them with free online
            access.
          </Space>
          <PrototypeSearchForm
            isActive={activeTab === 'tab-library-catalogue'}
            ariaDescribedBy={'library-catalogue-form-description'}
            routeProps={worksRouteProps}
            workTypeAggregations={workTypeAggregations}
            isImageSearch={false}
            aggregations={aggregations}
          />
        </TabPanel>
      ),
    },
    {
      id: 'tab-images',
      tab: function TabWithDisplayName(isActive, isFocused) {
        return (
          <Tab
            isActive={isActive}
            isFocused={isFocused}
            isKeyboard={isKeyboard}
            isLast={true}
          >
            Images
          </Tab>
        );
      },
      tabPanel: (
        <TabPanel>
          <Space
            v={{ size: 'm', properties: ['padding-top'] }}
            h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
            className={classNames({
              'visually-hidden': !shouldShowDescription,
              [font('hnl', 5)]: true,
            })}
            id="images-form-description"
          >
            Search for free, downloadable images taken from our library and
            museum collections, including objects at the Science Museum.
          </Space>
          <PrototypeSearchForm
            isActive={activeTab === 'tab-images'}
            ariaDescribedBy="images-form-description"
            routeProps={imagesRouteProps}
            workTypeAggregations={workTypeAggregations}
            isImageSearch={true}
            aggregations={aggregations}
          />
        </TabPanel>
      ),
    },
  ];

  function onTabClick(id: string) {
    trackEvent({
      category: 'SearchTabs',
      action: 'click tab',
      label: `${id}`,
    });
  }

  function onTabChanged(id: string) {
    setActiveTab(id);
  }

  return (
    <BaseTabsWrapper isEnhanced={isEnhanced}>
      <BaseTabs
        tabs={tabs}
        label={'Tabs for search'}
        activeTabIndex={activeTabIndex}
        onTabClick={onTabClick}
        onTabChanged={onTabChanged}
      />
    </BaseTabsWrapper>
  );
};

export default SearchTabs;
