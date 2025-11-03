// eslint-data-component: intentionally omitted
import { LinkProps } from 'next/link';
import { FunctionComponent } from 'react';
import { useTheme } from 'styled-components';

import { arrowSmall } from '@weco/common/icons';
import Button, { ButtonColors } from '@weco/common/views/components/Buttons';

type Props = {
  url: string | LinkProps;
  name: string;
  colors?: ButtonColors;
  ariaLabel?: string;
};

const MoreLink: FunctionComponent<Props> = ({
  url,
  name,
  colors,
  ariaLabel,
}) => {
  const theme = useTheme();

  return (
    <Button
      variant="ButtonSolidLink"
      ariaLabel={ariaLabel}
      colors={colors || theme.buttonColors.charcoalTransparentCharcoal}
      isIconAfter
      text={name}
      link={url}
      icon={arrowSmall}
    />
  );
};

export default MoreLink;
