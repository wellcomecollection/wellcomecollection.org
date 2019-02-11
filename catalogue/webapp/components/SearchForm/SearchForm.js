// @flow
import { Fragment, useState, useRef } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import { classNames, font, spacing } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import { worksUrl } from '../../services/catalogue/urls';

type Props = {|
  initialQuery: string,
  initialWorkType: string[],
  initialItemsLocationsLocationType: string[],
  showFilters: boolean,
  ariaDescribedBy: string,
  compact: boolean,
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
  label: string,
  name: string,
  value: string,
  checked: boolean,
  onChange: (event: SyntheticEvent<HTMLInputElement>) => void,
};
const SearchTag = ({
  label,
  name,
  value,
  checked,
  onChange,
}: SearchTagProps) => {
  return (
    <label
      className={classNames({
        'bg-pumice': true,
        'flex-inline': true,
        'flex--v-center': true,
        pointer: true,
        [spacing({ s: 1 }, { padding: ['left', 'right'] })]: true,
        [spacing({ s: 1 }, { margin: ['right'] })]: true,
        [font({ s: 'HNL3' })]: true,
      })}
      style={{ borderRadius: '3px' }}
    >
      <input
        className={classNames({
          [spacing({ s: 1 }, { margin: ['right'] })]: true,
        })}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
};

const SearchForm = ({
  initialQuery = '',
  initialWorkType = [],
  initialItemsLocationsLocationType = [],
  showFilters,
  ariaDescribedBy,
  compact,
}: Props) => {
  const [query, setQuery] = useState(initialQuery);
  const [workType, setWorkType] = useState(initialWorkType);
  const [itemsLocationsLocationType, setItemsLocationsLocationType] = useState(
    initialItemsLocationsLocationType
  );
  const searchInput = useRef(null);

  return (
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

      {showFilters && (
        <Fragment>
          <fieldset
            className={classNames({
              [spacing({ s: 1 }, { margin: ['top'] })]: true,
            })}
          >
            <legend
              className={classNames({
                'float-l': true,
                [spacing({ s: 1 }, { margin: ['right'] })]: true,
                [font({ s: 'HNL4' })]: true,
              })}
              style={{ marginTop: '3px' }}
            >
              Filter by:
            </legend>
            <SearchTag
              name={'workType'}
              label="Images"
              value="k,q"
              checked={
                workType.indexOf('k') !== -1 && workType.indexOf('q') !== -1
              }
              onChange={event => {
                const input = event.currentTarget;
                const newWorkType = input.checked
                  ? [...workType, 'k', 'q']
                  : workType.filter(val => val !== 'k' && val !== 'q');
                setWorkType(newWorkType);
              }}
            />
            <SearchTag
              name={'workType'}
              label="Books"
              value="a"
              checked={workType.indexOf('a') !== -1}
              onChange={event => {
                const input = event.currentTarget;
                const newWorkType = input.checked
                  ? [...workType, 'a']
                  : workType.filter(val => val !== 'a');
                setWorkType(newWorkType);
              }}
            />
            <SearchTag
              name={'items.locations.locationType'}
              label="Online"
              value="iiif-image,iiif-presentation"
              checked={
                itemsLocationsLocationType.indexOf('iiif-image') !== -1 &&
                itemsLocationsLocationType.indexOf('iiif-presentation') !== -1
              }
              onChange={event => {
                const input = event.currentTarget;
                if (input.checked) {
                  setItemsLocationsLocationType([
                    'iiif-image',
                    'iiif-presentation',
                  ]);
                } else {
                  setItemsLocationsLocationType([]);
                }
              }}
            />
          </fieldset>
        </Fragment>
      )}
    </form>
  );
};
export default SearchForm;
