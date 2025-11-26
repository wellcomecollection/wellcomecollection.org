// eslint-data-component: intentionally omitted
import { CSSProperties } from 'react';
import { useTheme } from 'styled-components';

import { PaletteColor } from '@weco/common/views/themes/config';

const LLShape = ({
  color,
  styles,
}: {
  color?: PaletteColor;
  styles?: CSSProperties;
}) => {
  const theme = useTheme();
  const fillColor = color ? theme.color(color) : 'currentColor';

  return (
    <svg
      viewBox="0 0 496 714"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...(styles && { style: styles })}
    >
      <path d="M200 714H0V0H200V714ZM496 714H296V0H496V714Z" fill={fillColor} />
    </svg>
  );
};

export default LLShape;
