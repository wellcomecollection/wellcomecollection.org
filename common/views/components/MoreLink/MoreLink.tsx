import { FunctionComponent, ReactElement } from 'react';
import { trackEvent, GaEvent } from '../../../utils/ga';
import ButtonOutlinedLink from '../ButtonOutlinedLink/ButtonOutlinedLink';

type Props = {
  url: string;
  name: string;
  trackingEvent?: GaEvent;
};

const MoreLink: FunctionComponent<Props> = ({
  url,
  name,
  trackingEvent,
}: Props): ReactElement<Props> => {
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
