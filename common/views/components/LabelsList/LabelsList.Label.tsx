import { CSSProperties, FunctionComponent } from 'react';
import styled from 'styled-components';

import { LabelColor, Label as LabelType } from '@weco/common/model/labels';
import { typography } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import {
  legacyColorName,
  PinnableColor,
} from '@weco/common/views/themes/config';

type LabelContainerProps = {
  $fontColor: PinnableColor;
  $labelColor: PinnableColor;
  $outlineLightLabels: boolean;
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

  ${props => {
    const labelColorName = legacyColorName(props.$labelColor);
    const isWhiteOrTransparent =
      labelColorName === 'white' || labelColorName === 'transparent';

    if (!isWhiteOrTransparent) {
      return `border: 1px solid ${props.theme.color(props.$labelColor)};`;
    }

    return `border: 1px solid ${props.theme.color(
      props.$outlineLightLabels
        ? { brand: 'neutral.70', legacy: 'neutral.500' }
        : props.$labelColor
    )};`;
  }}
`;

// Format labels (Display, Workshop, Book extract…)
export const formatLabelColor: LabelColor = {
  brand: 'pink.30',
  legacy: 'yellow',
};

export type Props = {
  label: LabelType;
  defaultLabelColor?: LabelColor;
  outlineLightLabels?: boolean;
};

const Label: FunctionComponent<Props> = ({
  label,
  defaultLabelColor = formatLabelColor,
  outlineLightLabels = true,
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
        ((label.labelColor && legacyColorName(label.labelColor) === 'black') ||
        legacyColorName(defaultLabelColor) === 'black'
          ? { brand: 'teal.20', legacy: 'yellow' }
          : 'black')
      }
      $labelColor={label.labelColor || defaultLabelColor}
      $outlineLightLabels={outlineLightLabels}
    >
      {label.text}
    </LabelContainer>
  );
};

export default Label;
