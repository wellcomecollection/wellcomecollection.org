import { CSSProperties, FunctionComponent } from 'react';
import styled from 'styled-components';

import { LabelColor, Label as LabelType } from '@weco/common/model/labels';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

type LabelContainerProps = {
  $fontColor: PaletteColor;
  $labelColor: PaletteColor;
};

const LabelContainer = styled(Space).attrs({
  className: font('sans-bold', -2),
})<LabelContainerProps>`
  white-space: nowrap;
  line-height: 1;
  color: ${props => props.theme.color(props.$fontColor)};
  background-color: ${props => props.theme.color(props.$labelColor)};

  ${props => {
    if (props.$labelColor === 'white' || props.$labelColor === 'transparent') {
      return `border: 1px solid ${props.theme.color('neutral.500')};`;
    } else {
      return `border: 1px solid ${props.theme.color(props.$labelColor)};`;
    }
  }}
`;

export type Props = {
  label: LabelType;
  defaultLabelColor?: LabelColor;
};

const Label: FunctionComponent<Props> = ({
  label,
  defaultLabelColor = 'yellow',
}: Props) => {
  return (
    <LabelContainer
      style={{ '--label-length': label.text.length } as CSSProperties}
      $v={{
        size: 'xs',
        properties: ['padding-top', 'padding-bottom'],
      }}
      $h={{
        size: 'xs',
        properties: ['padding-left', 'padding-right'],
      }}
      $fontColor={
        label.textColor ||
        (label.labelColor === 'black' || defaultLabelColor === 'black'
          ? 'yellow'
          : 'black')
      }
      $labelColor={label.labelColor || defaultLabelColor}
    >
      {label.text}
    </LabelContainer>
  );
};

export default Label;
