import { ParsedUrlQuery } from 'querystring';
import BaseTabs, { TabType } from './SearchTabs.BaseTabs';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import Space from '../styled/Space';
import { useContext, FunctionComponent, ReactElement, useRef } from 'react';
import { AppContext } from '../AppContext/AppContext';
import SearchForm from '@weco/common/views/components/SearchForm/SearchForm';
import { trackGaEvent } from '@weco/common/utils/ga';
import NextLink from 'next/link';
import { removeEmptyProps } from '../../../utils/json';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import { propsToQuery } from '../../../utils/routes';

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
  className: font('intb', 5),
})<TabProps>`
  display: inline-flex;
  background: ${props => props.theme.color('white')};
  border-width: 1px 1px 0 1px;
  border-style: solid;
  border-color: ${props => props.theme.color('warmNeutral.400')};

  ${props =>
    props.isActive &&
    `
    border-color: ${props.theme.color('warmNeutral.300')};
    background: ${props.theme.color('warmNeutral.300')};
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
  ${props => props.theme.media('medium')`
    width: auto;
  `}
`;

const TabPanel = styled(Space)`
  background: ${props => props.theme.color('warmNeutral.300')};
`;

type Props = {
  query: string;
  shouldShowDescription: boolean;
  activeTabIndex?: number;
};

const SearchTabs: FunctionComponent<Props> = ({
  query,
  shouldShowDescription,
  activeTabIndex,
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
                  pathname: '/search/works',
                  query: removeEmptyProps({
                    source: 'search_tabs',
                    query,
                  }),
                }}
                as={{
                  pathname: '/search/works',
                  query: removeEmptyProps({
                    query,
                  }),
                }}
                className="plain-link"
                aria-current={isActive ? 'page' : undefined}
              >
                {children}
              </NextLink>
            )}
          >
            <Tab
              isActive={true}
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
            linkResolver={params => {
              const queryWithSource = propsToQuery(params);
              /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
              const { source = undefined, ...queryWithoutSource } = {
                ...queryWithSource,
              };

              const as = {
                pathname: '/search/works',
                query: queryWithoutSource as ParsedUrlQuery,
              };

              const href = {
                pathname: '/search/works',
                query: queryWithSource,
              };

              return { href, as };
            }}
            ariaDescribedBy="library-catalogue-form-description"
            isImageSearch={false}
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
                  pathname: '/search/images',
                  query: removeEmptyProps({
                    source: 'search_tabs',
                    query,
                  }),
                }}
                as={{
                  pathname: '/search/images',
                  query: removeEmptyProps({
                    query,
                  }),
                }}
                className="plain-link"
                aria-current={isActive ? 'page' : undefined}
              >
                {children}
              </NextLink>
            )}
          >
            <Tab
              isActive={false}
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
            linkResolver={params => {
              const queryWithSource = propsToQuery(params);
              /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
              const { source = undefined, ...queryWithoutSource } = {
                ...queryWithSource,
              };

              const as = {
                pathname: '/search/images',
                query: queryWithoutSource as ParsedUrlQuery,
              };

              const href = {
                pathname: '/search/images',
                query: queryWithSource,
              };

              return { href, as };
            }}
            ariaDescribedBy="images-form-description"
            isImageSearch={true}
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
    trackGaEvent({
      category: 'SearchTabs',
      action: 'click tab',
      label: `${id}`,
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      <BaseTabs
        tabs={tabs}
        label="Search"
        activeTabIndex={activeTabIndex}
        onTabClick={onTabClick}
      />
    </div>
  );
};

export default SearchTabs;
