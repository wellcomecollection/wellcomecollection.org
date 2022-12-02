import { FunctionComponent, ReactElement } from 'react';
import { trackGaEvent, GaEvent } from '../../../utils/ga';
import ButtonSolidLink from '../ButtonSolidLink/ButtonSolidLink';
import { arrowSmall } from '@weco/common/icons';
import { themeValues } from '@weco/common/views/themes/config';

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
      trackGaEvent({
        category: 'MoreLink',
        action: 'follow link',
        label: `${url} | text: ${name}`,
      });
    }
  }

  return (
    <ButtonSolidLink
      colors={themeValues.buttonColors.charcoalTransparentCharcoal}
      isIconAfter={true}
      clickHandler={handleClick}
      text={name}
      link={url}
      icon={arrowSmall}
    />
  );
};

export default MoreLink;
