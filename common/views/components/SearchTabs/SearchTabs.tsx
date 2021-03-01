import BaseTabs, { TabType } from '../BaseTabs/BaseTabs';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Space from '../styled/Space';
import { useContext, FunctionComponent, ReactElement } from 'react';
import { AppContext } from '../AppContext/AppContext';
import SearchForm from '@weco/common/views/components/SearchForm/SearchForm';
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
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import BetaBar from '@weco/common/views/components/BetaBar/BetaBar';

const BetaBarContainer = styled.div`
  // on larger screens we shift the BetaBar to the right on the same level as the tabs
  ${props => props.theme.media.medium`
    position: absolute;
    right: 0;
  `}
`;

const BaseTabsWrapper = styled.div`
  // FIXME: For testing, make the checkboxes/buttons have a white background because they're on grey
  [class*='ButtonInline__InlineButton'],
  [class^='CheckboxRadio__CheckboxRadioBox'] {
    background: white !important;
    border-color: ${props => props.theme.color('marble')};
  }
`;

type TabProps = {
  isLast: boolean;
  isActive: boolean;
  isFocused: boolean;
  isKeyboard: boolean;
};

const Tab = styled(Space).attrs({
  as: 'span',
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'flex-inline': true,
    [font('hnm', 5)]: true,
  }),
})<TabProps>`
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
  disableLink?: boolean;
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
  disableLink = false,
}: Props): ReactElement<Props> => {
  const router = useRouter();
  const { query } = router.query;
  const { isKeyboard, isEnhanced } = useContext(AppContext);
  const tabCondition = (!disableLink && isEnhanced) || !isEnhanced;
  const tabs: TabType[] = [
    {
      id: 'tab-library-catalogue',
      tab: function TabWithDisplayName(isActive, isFocused) {
        return (
          <ConditionalWrapper
            condition={tabCondition}
            wrapper={children => (
              <NextLink
                scroll={false}
                href={{
                  pathname: '/works',
                  query: removeEmptyProps({
                    source: 'search_tabs',
                    query,
                  }),
                }}
                as={{
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
                  {children}
                </a>
              </NextLink>
            )}
          >
            <Tab
              isActive={isActive}
              isFocused={isFocused}
              isKeyboard={isKeyboard}
              isLast={false}
            >
              Library catalogue
            </Tab>
          </ConditionalWrapper>
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
            Find thousands of books, manuscripts, visual materials and
            unpublished archives from our collections, many of them with free
            online access.
          </Space>
          <SearchForm
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
          <ConditionalWrapper
            condition={tabCondition}
            wrapper={children => (
              <NextLink
                scroll={false}
                href={{
                  pathname: '/images',
                  query: removeEmptyProps({
                    source: 'search_tabs',
                    query,
                  }),
                }}
                as={{
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
                  {children}
                </a>
              </NextLink>
            )}
          >
            <Tab
              isActive={isActive}
              isFocused={isFocused}
              isKeyboard={isKeyboard}
              isLast={true}
            >
              Images
            </Tab>
          </ConditionalWrapper>
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
            museum collections, including paintings, illustrations, photos and
            more.
          </Space>
          <SearchForm
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
    <div style={{ position: 'relative' }}>
      <BetaBarContainer>
        <BetaBar />
      </BetaBarContainer>
      <BaseTabsWrapper>
        <BaseTabs
          tabs={tabs}
          label={'Tabs for search'}
          activeTabIndex={activeTabIndex}
          onTabClick={onTabClick}
        />
      </BaseTabsWrapper>
    </div>
  );
};

export default SearchTabs;
