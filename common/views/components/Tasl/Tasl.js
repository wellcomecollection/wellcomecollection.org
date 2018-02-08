// @flow

import {font, spacing} from '../../../utils/classnames';
import getTaslMarkup from '../../../utils/get-tasl-markup';
import Icon from '../Icon/Icon';

type Props = {
  isFull: boolean,
  contentUrl: string,
  title?: string,
  author?: string,
  sourceName?: string,
  sourceLink?: string,
  license?: string,
  copyrightHolder?: string,
  copyrightLink?: string
}

const Tasl = ({isFull, contentUrl, title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink}: Props) => (
  <div className={`
    ${isFull ? 'tasl--top' : 'tasl--bottom'}
    ${font({s: 'LR3', m: 'LR2'})}
    tasl drawer js-show-hide
  `}
  data-track-action="toggle-image-credit"
  data-track-label={`image:${contentUrl}`}>
    {!isFull &&
      <button className="tasl__button plain-button js-show-hide-trigger absolute">
        <span className="tasl__icon tasl__icon--open flex--v-center flex--h-center bg-transparent-black">
          <Icon name='information' title='information' extraClasses='icon--white' />
        </span>
        <span className="tasl__icon tasl__icon--close flex--v-center flex--h-center bg-transparent-black">
          <Icon name='cross' title='close' extraClasses='icon--white' />
        </span>
      </button>
    }

    <div className={`
      drawer__body js-show-hide-drawer bg-black font-white
      ${spacing({s: 1}, {padding: ['top', 'bottom', 'left']})}
      ${spacing({s: 6}, {padding: ['right']})}`}>
      {getTaslMarkup({title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink})}
    </div>
    {isFull &&
      <button className="tasl__button absolute plain-button js-show-hide-trigger">
        <span className="tasl__icon tasl__icon--open flex--v-center flex--h-center bg-transparent-black">
          <Icon name='information' title='information' extraClasses='icon--white' />
        </span>
        <span className="tasl__icon tasl__icon--close flex--v-center flex--h-center bg-transparent-black">
          <Icon name='cross' title='close' extraClasses='icon--white' />
        </span>
      </button>
    }
  </div>
);

export default Tasl;
