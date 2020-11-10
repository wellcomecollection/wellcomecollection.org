import { trackEvent, GaEvent } from '../../../utils/ga';
import ButtonOutlinedLink from '../ButtonOutlinedLink/ButtonOutlinedLink';

type Props = {
  url: string;
  name: string;
  trackingEvent?: GaEvent;
};

const MoreLink = ({ url, name, trackingEvent }: Props): JSX.Element => {
  function handleClick() {
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
