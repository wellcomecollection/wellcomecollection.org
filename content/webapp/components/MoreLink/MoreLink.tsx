import { FunctionComponent } from 'react';
import { LinkProps } from 'next/link';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import { arrowSmall } from '@weco/common/icons';
import { themeValues } from '@weco/common/views/themes/config';
import { ButtonColors } from '@weco/common/views/components/ButtonSolid/ButtonSolid';

type Props = {
  url: string | LinkProps;
  name: string;
  colors?: ButtonColors;
  hoverUnderline?: boolean;
};

const MoreLink: FunctionComponent<Props> = ({
  url,
  name,
  colors,
  hoverUnderline,
}) => {
  return (
    <ButtonSolidLink
      colors={colors || themeValues.buttonColors.charcoalTransparentCharcoal}
      isIconAfter
      text={name}
      link={url}
      icon={arrowSmall}
      hoverUnderline={hoverUnderline}
    />
  );
};

export default MoreLink;
