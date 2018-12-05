// @flow
import {font} from '../../../utils/classnames';
import {trackEvent} from '../../../utils/ga';
import HTMLInput from '../HTMLInput/HTMLInput';
import Icon from '../Icon/Icon';

type Props = {|
  action: string,
  id: string,
  name: string,
  query: string,
  filters: Object,
  autofocus: boolean,
  onSubmit?: (SyntheticEvent<HTMLFormElement>) => any,
  onChange?: (SyntheticEvent<HTMLInputElement>) => any
|}

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

const SearchBox = ({
  action,
  id,
  name,
  query,
  filters,
  autofocus,
  onChange,
  onSubmit
}: Props) => (
  <form action={action} onSubmit={onSubmit}>
    <div className='search-box js-search-box'>
      <HTMLInput
        id={id}
        type='text'
        name={name}
        label='search'
        defaultValue={query}
        placeholder='Search for artworks, photos and more'
        autofocus={autofocus}
        isLabelHidden={true}
        onChange={onChange} />
      <div className='search-box__button-wrap absolute bg-green'>
        <button className={`search-box__button line-height-1 plain-button no-padding ${font({s: 'HNL3', m: 'HNL2'})}`}>
          <span className='visually-hidden'>Search</span>
          <span className='flex flex--v-center flex--h-center'>
            <Icon name='search' title='Search' extraClasses='icon--white' />
          </span>
        </button>
      </div>

      <button className='search-box__clear absolute line-height-1 plain-button v-center no-padding js-clear'
        onClick={() => trackEvent({
          category: 'component',
          action: `clear-search:click`,
          label: `input-id:${id}`
        })}
        type='button'>
        <Icon name='clear' title='Clear' />
      </button>
    </div>

    {workTypes.map(({id, label}) => (
      <label key={id}>
        <input
          type='checkbox'
          name='workType'
          value={id}
          checked={filters.workType.indexOf(id) !== -1} />
        {label}
      </label>
    ))}
    <hr />
    <label>
      <input
        type='checkbox'
        name='workType'
        value={id}
        checked={filters['items.locations.locationType']} />
      Images only
    </label>
  </form>
);

export default SearchBox;
