// @flow
import { type CatalogueResultsList } from '@weco/common/model/catalogue';
import { useRef, useContext, useState } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import { classNames, font } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import SearchContext from '../SearchContext/SearchContext';

type Props = {|
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

const SearchForm = ({ ariaDescribedBy, compact, works }: Props) => {
  const { query, itemsLocationsLocationType, workType } = useContext(
    SearchContext
  );
  const [preQuery, setPreQuery] = useState(query);
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
            query: preQuery,
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
            <TogglesContext.Consumer>
              {({ booksRelease }) => (
                <TextInput
                  label={'Search the catalogue'}
                  placeholder={`Search for ${
                    booksRelease
                      ? 'books and pictures'
                      : 'artworks, photos and more'
                  }`}
                  name="query"
                  value={preQuery}
                  autoFocus={preQuery === ''}
                  onChange={event => setPreQuery(event.currentTarget.value)}
                  ref={searchInput}
                  className={font({
                    s: compact ? 'HNL4' : 'HNL3',
                    m: compact ? 'HNL3' : 'HNL2',
                  })}
                />
              )}
            </TogglesContext.Consumer>

            {preQuery && (
              <ClearSearch
                className="absolute line-height-1 plain-button v-center no-padding"
                onClick={() => {
                  trackEvent({
                    category: 'SearchForm',
                    action: 'clear search',
                    label: 'works-search',
                  });

                  setPreQuery('');

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
        {itemsLocationsLocationType && (
          <input
            type="hidden"
            name="items.locations.locationType"
            value={itemsLocationsLocationType.join(',')}
          />
        )}
        {workType && (
          <input type="hidden" name="workType" value={workType.join(',')} />
        )}
      </form>
    </>
  );
};
export default SearchForm;
