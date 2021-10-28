import { FC } from 'react';
import { Label as LabelType, LabelColor } from '../../../model/labels';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';
import AlignFont from '../styled/AlignFont';

type LabelContainerProps = {
  fontColor: string;
  labelColor: string;
};

const LabelContainer = styled(Space).attrs({
  className: classNames({
    'nowrap line-height-1': true,
    [font('hnb', 6)]: true,
  }),
})<LabelContainerProps>`
  color: ${props => props.theme.color(props.fontColor)};
  background-color: ${props => props.theme.color(props.labelColor)};

  ${props => {
    if (props.labelColor === 'white' || props.labelColor === 'transparent') {
      return `border: 1px solid ${props.theme.color('silver')};`;
    } else {
      return `border: 1px solid ${props.theme.color(props.labelColor)};`;
    }
  }}
`;

export type Props = {
  label: LabelType;
  defaultLabelColor?: LabelColor;
};

const Label: FC<Props> = ({
  label,
  defaultLabelColor = 'yellow',
}: Props) => {
  return (
    <LabelContainer
      v={{
        size: 's',
        properties: ['padding-top', 'padding-bottom'],
        overrides: { large: 2 },
      }}
      h={{
        size: 's',
        properties: ['padding-left', 'padding-right'],
        overrides: { large: 2 },
      }}
      fontColor={
        label.textColor ||
        (label.labelColor === 'black' || defaultLabelColor === 'black'
          ? 'yellow'
          : 'black')
      }
      labelColor={label.labelColor || defaultLabelColor}
    >
      <AlignFont>{label.text}</AlignFont>
    </LabelContainer>
  );
};

export default Label;
