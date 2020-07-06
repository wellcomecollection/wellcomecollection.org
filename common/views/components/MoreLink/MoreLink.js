// @flow
import { trackEvent } from '../../../utils/ga';
import type { GaEvent } from '../../../utils/ga';
import ButtonOutlinedLink from '../ButtonOutlinedLink/ButtonOutlinedLink';

type Props = {|
  url: string,
  name: string,
  screenReaderText?: string,
  trackingEvent?: GaEvent,
|};

const MoreLink = ({ url, name, screenReaderText, trackingEvent }: Props) => {
  function handleClick(event) {
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
      text={`${name}`}
      link={url}
      icon={`arrowSmall`}
    />
  );
};

export default MoreLink;
