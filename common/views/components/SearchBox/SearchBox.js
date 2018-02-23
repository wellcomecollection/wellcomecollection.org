// @flow

import HTMLInput from '../HTMLInput/HTMLInput';
import Icon from '../Icon/Icon';
import {font} from '../../../utils/classnames';

type Props = {|
  action: string,
  id: string,
  name: string,
  query: string,
  autofocus: boolean,
  onSubmit?: () => void,
  onChange?: () => void
|}

const SearchBox = ({action, id, name, query, autofocus, onChange, onSubmit}: Props) => (
  <div className='search-box js-search-box'>
    <form action={action} onSubmit={onSubmit}>
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
          <span className='flex flex--v-center flex--h-center'>
            <Icon name='search' title='Search' extraClasses='icon--white' />
          </span>
        </button>
      </div>
    </form>
    <button className='search-box__clear absolute line-height-1 plain-button v-center no-padding js-clear'
      data-track-event={`{'category': 'component', 'action': 'clear-search:click', 'label': 'input-id:${id}'}`}
      type='button'>
      <Icon name='clear' title='Clear' />
    </button>
  </div>
);

export default SearchBox;
