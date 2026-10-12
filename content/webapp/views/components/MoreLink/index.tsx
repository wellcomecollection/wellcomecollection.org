// eslint-data-component: intentionally omitted
import { LinkProps } from 'next/link';
import { FunctionComponent } from 'react';
import { useTheme } from 'styled-components';

import { arrowSmall } from '@weco/common/icons';
import Button, {
  ButtonColors,
  ButtonHierarchy,
} from '@weco/common/views/components/Buttons';

type Props = {
  url: string | LinkProps;
  name: string;
  colors?: ButtonColors;
  ariaLabel?: string;
  hierarchy?: ButtonHierarchy;
  isOnDark?: boolean;
};

const MoreLink: FunctionComponent<Props> = ({
  url,
  name,
  colors,
  ariaLabel,
  hierarchy,
  isOnDark,
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
      hierarchy={hierarchy}
      isOnDark={isOnDark}
    />
  );
};

export default MoreLink;
