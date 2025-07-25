import { LinkProps } from 'next/link';
import { FunctionComponent } from 'react';

import { arrowSmall } from '@weco/common/icons';
import Button, { ButtonColors } from '@weco/common/views/components/Buttons';
import { themeValues } from '@weco/common/views/themes/config';

type Props = {
  url: string | LinkProps;
  name: string;
  colors?: ButtonColors;
};

const MoreLink: FunctionComponent<Props> = ({ url, name, colors }) => {
  return (
    <Button
      data-component="more-link"
      variant="ButtonSolidLink"
      colors={colors || themeValues.buttonColors.charcoalTransparentCharcoal}
      isIconAfter
      text={name}
      link={url}
      icon={arrowSmall}
    />
  );
};

export default MoreLink;
