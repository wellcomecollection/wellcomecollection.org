import { CSSProperties, FunctionComponent } from 'react';
import styled from 'styled-components';

import { LabelColor, Label as LabelType } from '@weco/common/model/labels';
import { typography } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';

type LabelContainerProps = {
  $fontColor: PaletteColor;
  $labelColor: PaletteColor;
  $showBorder: boolean;
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
      props.theme.color(props.$showBorder ? 'neutral.500' : props.$labelColor)};
`;

export type Props = {
  label: LabelType;
  defaultLabelColor?: LabelColor;
  showBorder?: boolean;
};

const Label: FunctionComponent<Props> = ({
  label,
  defaultLabelColor = 'yellow',
  showBorder = false,
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
          ? 'yellow'
          : 'black')
      }
      $labelColor={label.labelColor || defaultLabelColor}
      $showBorder={showBorder}
    >
      {label.text}
    </LabelContainer>
  );
};

export default Label;
