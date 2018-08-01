// @flow

import {font} from '../../../../utils/classnames';
import Icon from '../../Icon/Icon';
import trackOutboundLink from '../../../../utils/track-outbound-link';

type Props = {|
  url: string,
  name: string,
  screenReaderText?: string,
  isJumpLink?: boolean
|}

const PrimaryLink = ({url, name, screenReaderText, isJumpLink = false}: Props) => {
  function handleClick(event) {
    trackOutboundLink(event.currentTarget.href);
  }

  return (
    <a
      onClick={handleClick}
      className={[
        'primary-link',
        'flex-inline',
        'flex-v-center',
        'plain-link',
        font({s: 'HNM4'})].join(' ')} href={url} data-component='PrimaryLink'>
      {isJumpLink &&
        <Icon name='arrowSmall' extraClasses='icon--green icon--90' />
      }
      {name}
      {screenReaderText && <span className='visually-hidden'> {screenReaderText}</span>}
      {!isJumpLink &&
        <Icon name='arrowSmall' extraClasses='icon--green' />
      }
    </a>
  );
};

export default PrimaryLink;
