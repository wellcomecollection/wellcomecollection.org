// @flow
import type { Label as LabelType, LabelColor } from '../../../model/labels';
import { font, classNames } from '../../../utils/classnames';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
import styled from 'styled-components';

const LabelContainer = styled(Space).attrs(props => ({
  className: classNames({
    'nowrap line-height-1': true,
    [font('hnm', 6)]: true,
  }),
}))`
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

export type Props = {|
  label: LabelType,
  labelColor?: LabelColor,
|};

const Label = ({ label, labelColor = 'yellow' }: Props) => {
  return (
    <LabelContainer
      v={{
        size: 's',
        properties: ['padding-top', 'padding-bottom'],
      }}
      h={{ size: 's', properties: ['padding-left', 'padding-right'] }}
      fontColor={labelColor === 'black' ? 'yellow' : 'black'}
      labelColor={labelColor}
    >
      {label.text}
    </LabelContainer>
  );
};

export default Label;
