// @flow
import type { Label as LabelType } from '../../../model/labels';
import { font, classNames } from '../../../utils/classnames';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
import styled from 'styled-components';

const LabelContainer = styled(Space).attrs(props => ({
  className: classNames({
    'nowrap line-height-1': true,
    'rounded-diagonal': props.roundedDiagonal,
    [font('hnm', 6)]: true,
    'plain-link font-white bg-green bg-hover-black': props.isLink,
  }),
}))`
  ${props => {
    if (!props.isLink) {
      return `color: ${props.theme.color(props.fontColor)};
      background-color: ${props.theme.color(props.labelColor)};
    `;
    }
  }}
  ${props => {
    if (props.labelColor === 'white') {
      return `border: 1px solid ${props.theme.color('pumice')};`;
    } else {
      return `border: 1px solid ${props.theme.color(props.labelColor)};`;
    }
  }}
`;

export type Props = {|
  label: LabelType,
  labelColor?: 'orange' | 'yellow' | 'black' | 'cream' | 'white',
  roundedDiagonal?: boolean,
|};

function getFontColor(bgColor) {
  switch (true) {
    case bgColor === 'black':
      return 'yellow';
    case bgColor === 'cream' || bgColor === 'white':
      return 'charcoal';
    default:
      return 'black';
  }
}

const Label = ({
  label,
  labelColor = 'yellow',
  roundedDiagonal = false,
}: Props) => {
  const fontColor = getFontColor(labelColor);
  return (
    <LabelContainer
      v={{
        size: 's',
        properties: ['padding-top', 'padding-bottom'],
      }}
      h={{ size: 's', properties: ['padding-left', 'padding-right'] }}
      as={label.url ? 'a' : 'div'}
      href={label.url}
      fontColor={fontColor}
      labelColor={labelColor}
      isLink={Boolean(label.url)}
      roundedDiagonal={roundedDiagonal}
    >
      {label.text}
    </LabelContainer>
  );
};

export default Label;
