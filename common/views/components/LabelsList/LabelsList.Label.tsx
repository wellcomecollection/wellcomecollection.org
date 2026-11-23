import { CSSProperties, FunctionComponent } from 'react';
import styled, { DefaultTheme } from 'styled-components';

import { LabelColor, Label as LabelType } from '@weco/common/model/labels';
import { typography } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import {
  DesignSystemColor,
  ThemeColor,
} from '@weco/common/views/themes/config';

type LabelContainerProps = {
  $fontColor: ThemeColor;
  $labelColor: ThemeColor;
};

const lightBrandColors: DesignSystemColor[] = [
  'white',
  'neutral.05',
  'neutral.10',
];

// Light labels get an outline. Compare the colour that's actually shown,
// as an alias (e.g. `white`) and a design system name can be the same colour.
const isLightLabel = (color: ThemeColor, theme: DefaultTheme) => {
  const shown = theme.color(color);

  return (
    shown === 'transparent' ||
    lightBrandColors.some(light => theme.color(light) === shown)
  );
};

const LabelContainer = styled(Space).attrs({
  className: typography('body', 'sm', 'strong'),
})<LabelContainerProps>`
  white-space: nowrap;

  /* We need to do .{class}.{class} to override any line-height set by the font utility */
  && {
    line-height: 1;
  }

  color: ${props => props.theme.color(props.$fontColor)};
  background-color: ${props => props.theme.color(props.$labelColor)};

  border: 1px solid
    ${props =>
      props.theme.color(
        isLightLabel(props.$labelColor, props.theme)
          ? 'neutral.70'
          : props.$labelColor
      )};
`;

// Format labels (Display, Workshop, Book extract…)
export const formatLabelColor: LabelColor = 'pink.30';

export type Props = {
  label: LabelType;
  defaultLabelColor?: LabelColor;
};

const Label: FunctionComponent<Props> = ({
  label,
  defaultLabelColor = formatLabelColor,
}: Props) => {
  return (
    <LabelContainer
      style={{ '--label-length': label.text.length } as CSSProperties}
      $v={{
        size: '2xs',
        properties: ['padding-top', 'padding-bottom'],
      }}
      $h={{
        size: '2xs',
        properties: ['padding-left', 'padding-right'],
      }}
      $fontColor={
        label.textColor ||
        (label.labelColor === 'black' || defaultLabelColor === 'black'
          ? 'teal.20'
          : 'black')
      }
      $labelColor={label.labelColor || defaultLabelColor}
    >
      {label.text}
    </LabelContainer>
  );
};

export default Label;
