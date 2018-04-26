// @flow

import {font} from '../../../../utils/classnames';
import trackOutboundLink from '../../../../utils/track-outbound-link';

type Props = {|
  url: string,
  text: string,
  extraClasses?: string
|}

const SecondaryLink = ({url, text, extraClasses}: Props) => {
  function handleClick(event) {
    trackOutboundLink(event.currentTarget.href);
  }

  return (
    <a
      href={url}
      onClick={handleClick}
      className={`secondary-link ${font({s: 'HNM5', m: 'HNM4'})} ${extraClasses || ''}`}>
      {text}
    </a>
  );
};

export default SecondaryLink;
