import { ParsedUrlQuery } from 'querystring';
import BaseTabs, { TabType } from '../BaseTabs/BaseTabs';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Space from '../styled/Space';
import { useContext, FunctionComponent, ReactElement, useRef } from 'react';
import { AppContext } from '../AppContext/AppContext';
import SearchForm from '@weco/common/views/components/SearchForm/SearchForm';
import { trackEvent } from '@weco/common/utils/ga';
import NextLink from 'next/link';
import { removeEmptyProps } from '../../../utils/json';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import { Filter } from '../../../services/catalogue/filters';
import { propsToQuery } from '../../../utils/routes';

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
    [font('intb', 5)]: true,
  }),
})<TabProps>`
  background: ${props => props.theme.color('white')};
  border-left: 1px solid ${props => props.theme.color('pumice')};
  border-top: 1px solid ${props => props.theme.color('pumice')};
  border-right: 1px solid ${props => props.theme.color('pumice')};

  ${props =>
    props.isActive &&
    `
    border-color: ${props.theme.color('cream')};
    background: ${props.theme.color('cream')};
  `}

  ${props =>
    props.isFocused &&
    `
    box-shadow: ${props.isKeyboard ? props.theme.focusBoxShadow : null};
    position: relative;
    z-index: 1;
  `}

  width: 100%;
  text-align: center;
  ${props => props.theme.media.medium`
    width: auto;
  `}
`;

const TabPanel = styled(Space)`
  background: ${props => props.theme.color('cream')};
`;

type Props = {
  query: string;
  sort?: string;
  sortOrder?: string;
  shouldShowDescription: boolean;
  activeTabIndex?: number;
  shouldShowFilters: boolean;
  showSortBy: boolean;
  worksFilters: Filter[];
  imagesFilters: Filter[];
};

const SearchTabs: FunctionComponent<Props> = ({
  query,
  sort,
  sortOrder,
  shouldShowDescription,
  activeTabIndex,
  shouldShowFilters,
  showSortBy,
  worksFilters,
  imagesFilters,
}: Props): ReactElement<Props> => {
  const { isKeyboard, isEnhanced } = useContext(AppContext);
  const searchImagesFormRef = useRef<HTMLFormElement>();
  const searchWorksFormRef = useRef<HTMLFormElement>();

  const tabs: TabType[] = [
    {
      id: 'tab-library-catalogue',
      tab: function TabWithDisplayName(isActive, isFocused) {
        return (
          <ConditionalWrapper
            condition={!isEnhanced}
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
                  aria-current={isActive ? 'page' : undefined}
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
              [font('intr', 5)]: true,
            })}
            id="library-catalogue-form-description"
          >
            Find thousands of books, manuscripts, visual materials and
            unpublished archives from our collections, many of them with free
            online access.
          </Space>
          <SearchForm
            ref={searchWorksFormRef}
            query={query}
            sort={sort}
            sortOrder={sortOrder}
            linkResolver={params => {
              const queryWithSource = propsToQuery(params);
              const { source = undefined, ...queryWithoutSource } = {
                ...queryWithSource,
              };

              const as = {
                pathname: '/works',
                query: queryWithoutSource as ParsedUrlQuery,
              };

              const href = {
                pathname: '/works',
                query: queryWithSource,
              };

              return { href, as };
            }}
            ariaDescribedBy={'library-catalogue-form-description'}
            isImageSearch={false}
            shouldShowFilters={shouldShowFilters}
            showSortBy={showSortBy}
            filters={worksFilters}
          />
        </TabPanel>
      ),
    },
    {
      id: 'tab-images',
      tab: function TabWithDisplayName(isActive, isFocused) {
        return (
          <ConditionalWrapper
            condition={!isEnhanced}
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
                  aria-current={isActive ? 'page' : undefined}
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
              [font('intr', 5)]: true,
            })}
            id="images-form-description"
          >
            Search for free, downloadable images taken from our library and
            museum collections, including paintings, illustrations, photos and
            more.
          </Space>
          <SearchForm
            ref={searchImagesFormRef}
            query={query}
            sort={undefined}
            sortOrder={undefined}
            linkResolver={params => {
              const queryWithSource = propsToQuery(params);
              const { source = undefined, ...queryWithoutSource } = {
                ...queryWithSource,
              };

              const as = {
                pathname: '/images',
                query: queryWithoutSource as ParsedUrlQuery,
              };

              const href = {
                pathname: '/images',
                query: queryWithSource,
              };

              return { href, as };
            }}
            ariaDescribedBy="images-form-description"
            isImageSearch={true}
            shouldShowFilters={isEnhanced && shouldShowFilters} // non js images filters doesnt work hide for now\
            showSortBy={showSortBy}
            filters={imagesFilters}
          />
        </TabPanel>
      ),
    },
  ];

  function onTabClick(id: string) {
    if (id === 'tab-images') {
      searchImagesFormRef?.current?.submit();
    } else {
      searchWorksFormRef?.current?.submit();
    }
    trackEvent({
      category: 'SearchTabs',
      action: 'click tab',
      label: `${id}`,
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      <BaseTabsWrapper>
        <BaseTabs
          tabs={tabs}
          label={'Search'}
          activeTabIndex={activeTabIndex}
          onTabClick={onTabClick}
        />
      </BaseTabsWrapper>
    </div>
  );
};

export default SearchTabs;
