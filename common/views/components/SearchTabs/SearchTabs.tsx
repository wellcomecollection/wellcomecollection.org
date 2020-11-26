import BaseTabs, { TabType } from '../BaseTabs/BaseTabs';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Space from '../styled/Space';
import { useContext, FunctionComponent, ReactElement } from 'react';
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
import NextLink from 'next/link';
import { removeEmptyProps } from '../../../utils/json';
import { useRouter } from 'next/router';

const BaseTabsWrapper = styled.div`
  // FIXME: For testing, make the checkboxes/buttons have a white background because they're on grey
  [class*='ButtonInline__InlineButton'],
  [class^='CheckboxRadio__CheckboxRadioBox'] {
    background: white !important;
    border-color: ${props => props.theme.color('marble')};
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
  background: ${props => props.theme.color('pumice')};
  border-left: 1px solid ${props => props.theme.color('cream')};
  border-top: 1px solid ${props => props.theme.color('cream')};

  ${props =>
    props.isLast &&
    `
    border-right: 1px solid ${props.theme.color('cream')};
  `}

  ${props =>
    props.isActive &&
    `
    background: ${props.theme.color('cream')};
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
  background: ${props => props.theme.color('cream')};
`;
type Props = {
  worksRouteProps: WorksRouteProps;
  imagesRouteProps: ImagesRouteProps;
  workTypeAggregations: CatalogueAggregationBucket[];
  shouldShowDescription: boolean;
  activeTabIndex?: number;
  aggregations?: CatalogueAggregations;
  shouldShowFilters: boolean;
  showSortBy: boolean;
};

const SearchTabs: FunctionComponent<Props> = ({
  worksRouteProps,
  imagesRouteProps,
  workTypeAggregations,
  aggregations,
  shouldShowDescription,
  activeTabIndex,
  shouldShowFilters,
  showSortBy,
}: Props): ReactElement<Props> => {
  const router = useRouter();
  const { query } = router.query;

  const { isKeyboard, isEnhanced } = useContext(AppContext);
  const tabs: TabType[] = [
    {
      id: 'tab-library-catalogue',
      tab: function TabWithDisplayName(isActive, isFocused) {
        return (
          <NextLink
            href={{
              pathname: '/works',
              query: removeEmptyProps({
                query,
              }),
            }}
          >
            <a
              className={classNames({
                'plain-link': true,
              })}
            >
              <Tab
                isActive={isActive}
                isFocused={isFocused}
                isKeyboard={isKeyboard}
              >
                Library catalogue
              </Tab>
            </a>
          </NextLink>
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
            ariaDescribedBy={'library-catalogue-form-description'}
            routeProps={worksRouteProps}
            workTypeAggregations={workTypeAggregations}
            isImageSearch={false}
            aggregations={aggregations}
            shouldShowFilters={shouldShowFilters}
            showSortBy={showSortBy}
          />
        </TabPanel>
      ),
    },
    {
      id: 'tab-images',
      tab: function TabWithDisplayName(isActive, isFocused) {
        return (
          <NextLink
            href={{
              pathname: '/images',
              query: removeEmptyProps({
                query,
              }),
            }}
          >
            <a
              className={classNames({
                'plain-link': true,
              })}
            >
              <Tab
                isActive={isActive}
                isFocused={isFocused}
                isKeyboard={isKeyboard}
                isLast={true}
              >
                Images
              </Tab>
            </a>
          </NextLink>
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
            ariaDescribedBy="images-form-description"
            routeProps={imagesRouteProps}
            workTypeAggregations={workTypeAggregations}
            isImageSearch={true}
            shouldShowFilters={isEnhanced && shouldShowFilters} // non js images filters doesnt work hide for now\
            aggregations={aggregations}
            showSortBy={showSortBy}
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

  return (
    <BaseTabsWrapper>
      <BaseTabs
        tabs={tabs}
        label={'Tabs for search'}
        activeTabIndex={activeTabIndex}
        onTabClick={onTabClick}
      />
    </BaseTabsWrapper>
  );
};

export default SearchTabs;
