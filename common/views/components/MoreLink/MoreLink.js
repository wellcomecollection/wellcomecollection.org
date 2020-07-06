// @flow

import { trackEvent } from '../../../utils/ga';
import type { GaEvent } from '../../../utils/ga';
// $FlowFixMe
import ButtonOutlinedLink from '../ButtonOutlinedLink/ButtonOutlinedLink';

type Props = {|
  url: string,
  name: string,
  trackingEvent?: GaEvent,
|};

const MoreLink = ({ url, name, trackingEvent }: Props) => {
  function handleClick(event: SyntheticEvent<HTMLAnchorElement>) {
    if (trackingEvent) {
      trackEvent({
        category: 'MoreLink',
        action: 'follow link',
        label: `${url} | text: ${name}`,
      });
    }
  }

  return (
    <ButtonOutlinedLink
      clickHandler={handleClick}
      text={name}
      link={url}
      icon={`arrowSmall`}
    />
  );
};

export default MoreLink;
