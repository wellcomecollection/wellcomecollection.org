import BaseTabs from '../BaseTabs/BaseTabs';
import { classNames, font } from '@weco/common/utils/classnames';
import { TabType } from '../BaseTabs/BaseTabs';
import styled from 'styled-components';
import Space from '../styled/Space';
import { useContext } from 'react';
import { AppContext } from '../AppContext/AppContext';
import PrototypeSearchForm from '@weco/common/views/components/PrototypeSearchForm/PrototypeSearchForm';
import {
  WorksRouteProps,
  ImagesRouteProps,
} from '@weco/common/services/catalogue/ts_routes';
import { CatalogueAggregationBucket } from '@weco/common/model/catalogue';
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
  border-left: 1px solid ${props => props.theme.color('smoke')};
  border-top: 1px solid ${props => props.theme.color('smoke')};

  ${props =>
    props.isLast &&
    `
    border-right: 1px solid ${props.theme.color('smoke')};
  `}

  ${props =>
    props.isActive &&
    `
    background: ${props.theme.color('smoke')};
  `}

  ${props =>
    props.isFocused &&
    `
    box-shadow: ${props.isKeyboard ? props.theme.focusBoxShadow : null};
    position: relative;
    z-index: 1;
  `}
`;

const TabPanel = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  background: ${props => props.theme.color('smoke')};
  border: 1px solid ${props => props.theme.color('smoke')};
`;
type Props = {
  worksRouteProps: WorksRouteProps;
  imagesRouteProps: ImagesRouteProps;
  workTypeAggregations: CatalogueAggregationBucket[];
  shouldShowFilters: boolean;
  activeTabIndex?: number;
};

const SearchTabs = ({
  worksRouteProps,
  imagesRouteProps,
  workTypeAggregations,
  shouldShowFilters,
  activeTabIndex,
}: Props) => {
  const { isKeyboard } = useContext(AppContext);

  const tabs: TabType[] = [
    {
      id: 'tab-library-catalogue',
      tab: (isActive, isFocused) => (
        <Tab isActive={isActive} isFocused={isFocused} isKeyboard={isKeyboard}>
          Library catalogue
        </Tab>
      ),
      tabPanel: (
        <TabPanel>
          <p
            className={shouldShowFilters ? 'visually-hidden' : null}
            id="library-catalogue-form-description"
          >
            Find thousands of books, images, artworks, unpublished archives and
            manuscripts in our collections, many of them with free online
            access.
          </p>
          <PrototypeSearchForm
            ariaDescribedBy={'library-catalogue-form-description'}
            routeProps={worksRouteProps}
            workTypeAggregations={workTypeAggregations}
            isImageSearch={false}
            shouldShowFilters={shouldShowFilters}
          />
        </TabPanel>
      ),
    },
    {
      id: 'tab-images',
      tab: (isActive, isFocused) => (
        <Tab
          isActive={isActive}
          isFocused={isFocused}
          isKeyboard={isKeyboard}
          isLast={true}
        >
          Images
        </Tab>
      ),
      tabPanel: (
        <TabPanel>
          <p
            className={shouldShowFilters ? 'visually-hidden' : null}
            id="images-form-description"
          >
            Search for free, downloadable images taken from our library and
            museum collections, including objects at the Science Museum.
          </p>
          <PrototypeSearchForm
            ariaDescribedBy="images-form-description"
            routeProps={imagesRouteProps}
            workTypeAggregations={workTypeAggregations}
            isImageSearch={true}
            shouldShowFilters={shouldShowFilters}
          />
        </TabPanel>
      ),
    },
  ];

  return (
    <BaseTabs
      tabs={tabs}
      label={'Tabs for search'}
      activeTabIndex={activeTabIndex}
    />
  );
};

export default SearchTabs;
