// @flow
import {Fragment, useState} from 'react';
import Router from 'next/router';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import Icon from '@weco/common/views/components/Icon/Icon';
import {worksUrl} from '../../services/catalogue/urls';

const workTypes = [
  { id: 'a', label: 'Books' },
  { id: 'b', label: 'Manuscripts, Asian' },
  { id: 'c', label: 'Music' },
  { id: 'd', label: 'Journals' },
  { id: 'e', label: 'Maps' },
  { id: 'f', label: 'E-videos' },
  { id: 'g', label: 'Videorecordings' },
  { id: 'h', label: 'Archives and manuscripts' },
  { id: 'i', label: 'Sound' },
  { id: 'j', label: 'E-journals' },
  { id: 'k', label: 'Pictures' },
  { id: 'l', label: 'Ephemera' },
  { id: 'm', label: 'CD-Roms' },
  { id: 'n', label: 'Cinefilm' },
  { id: 'p', label: 'Mixed materials' },
  { id: 'q', label: 'Digital images' },
  { id: 'r', label: '3-D Objects' },
  { id: 's', label: 'E-sound' },
  { id: 'u', label: 'Standing order' },
  { id: 'v', label: 'E-books' },
  { id: 'w', label: 'Student dissertations' },
  { id: 'x', label: 'E-manuscripts, Asian' },
  { id: 'z', label: 'Web sites ' }
];

type Props = {|
  initialQuery: string,
  initialWorkType: string[],
  initialItemsLocationsLocationType: string[],
  showFilters: boolean
|}

const SearchForm = ({
  initialQuery = '',
  initialWorkType = [],
  initialItemsLocationsLocationType = [],
  showFilters
}: Props) => {
  const [query, setQuery] = useState(initialQuery);
  const [workType, setWorkType] = useState(initialWorkType);
  const [itemsLocationsLocationType, setItemsLocationsLocationType] = useState(initialItemsLocationsLocationType);

  return (
    <form
      action='/works'
      onSubmit={(event) => {
        event.preventDefault();
        const link = worksUrl({
          query,
          workType,
          itemsLocationsLocationType,
          page: 1
        });
        Router.push(link.href, link.as);
        return false;
      }}>
      <TextInput
        label={'Search the catalogue'}
        placeholder={'Search for artworks, photos and more'}
        name='query'
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)} />

      <div className='search-box__button-wrap absolute bg-green'>
        <button className={`search-box__button line-height-1 plain-button no-padding font({s: 'HNL3', m: 'HNL2'})`}>
          <span className='visually-hidden'>Search</span>
          <span className='flex flex--v-center flex--h-center'>
            <Icon name='search' title='Search' extraClasses='icon--white' />
          </span>
        </button>
      </div>

      {showFilters &&
        <Fragment>
          <fieldset>
            {workTypes.map(({id, label}) => {
              return (
                <label key={id}>
                  <input
                    type='checkbox'
                    name='workType'
                    value={id}
                    defaultChecked={workType.indexOf(id) !== -1}
                    onChange={(event) => {
                      const input = event.currentTarget;
                      if (input.checked) {
                        workType.push(input.value);
                      } else {
                        workType.splice(workType.indexOf(input.value, 1));
                      }
                      setWorkType(workType);
                    }} />
                  {label}
                </label>
              );
            })}
          </fieldset>

          <fieldset>
            <label>
              <input
                type='checkbox'
                name='items.locations.locationType'
                value={'iiif-image'}
                defaultChecked={itemsLocationsLocationType.indexOf('iiif-image') !== -1}
                onChange={(event) => {
                  const input = event.currentTarget;
                  if (input.checked) {
                    itemsLocationsLocationType.push(input.value);
                  } else {
                    itemsLocationsLocationType.splice(workType.indexOf(input.value, 1));
                  }
                  setItemsLocationsLocationType(workType);
                }} />
              Images only
            </label>
          </fieldset>
        </Fragment>
      }

      <button type='submit'>Search</button>
    </form>
  );
};
export default SearchForm;
