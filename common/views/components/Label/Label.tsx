import { FunctionComponent } from 'react';
import { Label as LabelType, LabelColor } from '../../../model/labels';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';

type LabelContainerProps = {
  fontColor: string;
  labelColor: string;
};

const LabelContainer = styled(Space).attrs({
  className: font('intb', 6),
})<LabelContainerProps>`
  white-space: nowrap;
  line-height: 1;
  color: ${props => props.theme.newColor(props.fontColor)};
  background-color: ${props => props.theme.newColor(props.labelColor)};

  ${props => {
    if (props.labelColor === 'white' || props.labelColor === 'transparent') {
      return `border: 1px solid ${props.theme.color('silver')};`;
    } else {
      return `border: 1px solid ${props.theme.newColor(props.labelColor)};`;
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
      v={{
        size: 'xs',
        properties: ['padding-top', 'padding-bottom'],
      }}
      h={{
        size: 'xs',
        properties: ['padding-left', 'padding-right'],
      }}
      fontColor={
        label.textColor ||
        (label.labelColor === 'black' || defaultLabelColor === 'black'
          ? 'yellow'
          : 'black')
      }
      labelColor={label.labelColor || defaultLabelColor}
    >
      {label.text}
    </LabelContainer>
  );
};

export default Label;
