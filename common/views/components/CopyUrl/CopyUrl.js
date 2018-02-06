// @flow

import {spacing, font} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import HTMLInput from '../HTMLInput/HTMLInput';

type Props = {|
  id: string,
  url: string,
|}

const CopyUrl = ({id, url}: Props) => (
  <div>
    <HTMLInput
      id='share'
      type='text'
      label='share url'
      defaultValue={url}
      isLabelHidden={true}
      fontStyles={{s: 'HNL5', m: 'HNL4'}} />

    <button aria-live='polite'
      data-copy-text={url}
      data-track-event={`{"category": "component", "action": "copy-url:click", "label": "id:${id}"}`}
      className={`${spacing({s: 2}, {margin: ['top']})} ${font({s: 'HNM5', m: 'HNM4'})} btn btn--light is-hidden js-copy-url pointer`}>
      <Icon name='check' extraClasses='icon--black is-hidden' />
      <span className='js-copy-text'>Copy link</span>
    </button>
  </div>
);

export default CopyUrl;
