import { FunctionComponent } from 'react';
import { LinkProps } from 'next/link';
import { trackGaEvent, GaEvent } from '../../../utils/ga';
import ButtonSolidLink from '../ButtonSolidLink/ButtonSolidLink';
import { arrowSmall } from '@weco/common/icons';
import { themeValues } from '@weco/common/views/themes/config';
import { ButtonColors } from '../ButtonSolid/ButtonSolid';

type Props = {
  url: string | LinkProps;
  name: string;
  colors?: ButtonColors;
  hoverUnderline?: boolean;
  trackingEvent?: GaEvent;
};

const MoreLink: FunctionComponent<Props> = ({
  url,
  name,
  colors,
  hoverUnderline,
  trackingEvent,
}) => {
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
      colors={colors || themeValues.buttonColors.charcoalTransparentCharcoal}
      isIconAfter
      clickHandler={handleClick}
      text={name}
      link={url}
      icon={arrowSmall}
      hoverUnderline={hoverUnderline}
    />
  );
};

export default MoreLink;
