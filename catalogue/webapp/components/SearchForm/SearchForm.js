// @flow
import { type CatalogueResultsList } from '@weco/common/model/catalogue';
import { type NextLinkType } from '@weco/common/model/next-link-type';
import { useState, useRef } from 'react';
import Router from 'next/router';
import NextLink from 'next/link';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { classNames, font, spacing } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { worksUrl } from '@weco/common/services/catalogue/urls';

type Props = {|
  initialQuery: string,
  initialWorkType: string[],
  initialItemsLocationsLocationType: string[],
  ariaDescribedBy: string,
  compact: boolean,
  works: ?CatalogueResultsList,
|};

const SearchInputWrapper = styled.div`
  background: ${props => props.theme.colors.white};
  margin-right: ${props => 8 * props.theme.spacingUnit}px;

  ${props => props.theme.media.medium`
    margin-right: ${props => 10 * props.theme.spacingUnit}px;
  `}
`;

const SearchButtonWrapper = styled.div`
  height: 100%;
  top: 0;
  right: 0;
  width: ${props => 8 * props.theme.spacingUnit}px;

  ${props => props.theme.media.medium`
    width: ${props => 10 * props.theme.spacingUnit}px;
  `}
`;

const ClearSearch = styled.button`
  right: 12px;
`;

type SearchTagProps = {
  link: NextLinkType,
  label: string,
  checked: boolean,
};
const SearchTag = ({ link, label, checked }: SearchTagProps) => {
  return (
    <NextLink {...link}>
      <a
        className={classNames({
          // 'bg-pumice': true,
          'flex-inline': true,
          'flex--v-center': true,
          pointer: true,
          [spacing(
            { s: 1 },
            { padding: ['left', 'right'], margin: ['left'] }
          )]: true,
          [font({ s: 'HNL4' })]: true,
        })}
        style={{ borderRadius: '3px', textDecoration: 'underline' }}
      >
        <input
          className={classNames({
            [spacing({ s: 1 }, { margin: ['right'] })]: true,
          })}
          type="checkbox"
          checked={checked}
        />
        {label}
      </a>
    </NextLink>
  );
};

const SearchForm = ({
  initialQuery = '',
  initialWorkType = [],
  initialItemsLocationsLocationType = [],
  ariaDescribedBy,
  compact,
  works,
}: Props) => {
  const [query, setQuery] = useState(initialQuery);
  const workType = initialWorkType;
  const [itemsLocationsLocationType] = useState(
    initialItemsLocationsLocationType
  );
  const searchInput = useRef(null);

  return (
    <>
      <form
        action="/works"
        aria-describedby={ariaDescribedBy}
        onSubmit={event => {
          event.preventDefault();

          trackEvent({
            category: 'SearchForm',
            action: 'submit search',
            label: query,
          });

          const link = worksUrl({
            query,
            workType,
            itemsLocationsLocationType,
            page: 1,
          });

          Router.push(link.href, link.as);

          return false;
        }}
      >
        <div className="relative">
          <SearchInputWrapper className="relative">
            <TextInput
              label={'Search the catalogue'}
              placeholder={'Search for artworks, photos and more'}
              name="query"
              value={query}
              autoFocus={query === ''}
              onChange={event => setQuery(event.currentTarget.value)}
              ref={searchInput}
              className={font({
                s: compact ? 'HNL4' : 'HNL3',
                m: compact ? 'HNL3' : 'HNL2',
              })}
            />

            {query && (
              <ClearSearch
                className="absolute line-height-1 plain-button v-center no-padding"
                onClick={() => {
                  trackEvent({
                    category: 'SearchForm',
                    action: 'clear search',
                    label: 'works-search',
                  });

                  setQuery('');

                  searchInput.current && searchInput.current.focus();
                }}
                type="button"
              >
                <Icon name="clear" title="Clear" />
              </ClearSearch>
            )}
          </SearchInputWrapper>

          <SearchButtonWrapper className="absolute bg-green">
            <button
              className={classNames({
                'full-width': true,
                'full-height': true,
                'line-height-1': true,
                'plain-button no-padding': true,
                [font({ s: 'HNL3', m: 'HNL2' })]: true,
              })}
            >
              <span className="visually-hidden">Search</span>
              <span className="flex flex--v-center flex--h-center">
                <Icon name="search" title="Search" extraClasses="icon--white" />
              </span>
            </button>
          </SearchButtonWrapper>
        </div>
      </form>
      <TogglesContext.Consumer>
        {({ showCatalogueSearchFilters, feedback }) =>
          (showCatalogueSearchFilters || feedback) && (
            <div
              className={classNames({
                flex: true,
                'flex--wrap': true,
                'flex--v-center': true,
                [spacing({ s: 1 }, { margin: ['top'] })]: true,
              })}
            >
              {feedback && (
                <p
                  className={classNames({
                    [font({ s: 'HNL4' })]: true,
                    relative: true,
                    [spacing({ s: 2 }, { margin: ['right'] })]: true,
                    [spacing({ s: 0 }, { margin: ['bottom'] })]: true,
                  })}
                  style={{
                    left: '1px',
                    flexGrow: 1,
                  }}
                >
                  Our search is currently in beta.{' '}
                  <a href="https://www.surveymonkey.co.uk/r/W3NBWV2">
                    Let us know what you think
                  </a>
                </p>
              )}
              {showCatalogueSearchFilters && works && (
                <fieldset
                  className={classNames({
                    relative: true,
                  })}
                  style={{
                    left: '1px',
                  }}
                >
                  <legend
                    className={classNames({
                      'float-l': true,
                      [font({ s: 'HNM4' })]: true,
                    })}
                    style={{ marginTop: '3px' }}
                  >
                    Filter by:
                  </legend>
                  <SearchTag
                    name={'workType'}
                    label="Digital images"
                    value="q"
                    checked={workType.indexOf('q') !== -1}
                    link={worksUrl({
                      query,
                      workType:
                        workType.indexOf('q') !== -1
                          ? workType.filter(workType => workType !== 'q')
                          : [...workType, 'q'],
                      itemsLocationsLocationType,
                      page: 1,
                    })}
                  />
                  <SearchTag
                    name={'workType'}
                    label="Pictures"
                    value="k"
                    checked={workType.indexOf('k') !== -1}
                    link={worksUrl({
                      query,
                      workType:
                        workType.indexOf('k') !== -1
                          ? workType.filter(workType => workType !== 'k')
                          : [...workType, 'k'],
                      itemsLocationsLocationType,
                      page: 1,
                    })}
                  />
                  <SearchTag
                    name={'workType'}
                    label="Books"
                    value="a"
                    checked={workType.indexOf('a') !== -1}
                    link={worksUrl({
                      query,
                      workType:
                        workType.indexOf('a') !== -1
                          ? workType.filter(workType => workType !== 'a')
                          : [...workType, 'a'],
                      itemsLocationsLocationType,
                      page: 1,
                    })}
                  />
                </fieldset>
              )}
            </div>
          )
        }
      </TogglesContext.Consumer>
    </>
  );
};
export default SearchForm;
