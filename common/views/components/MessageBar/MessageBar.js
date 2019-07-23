// @flow
import { type Node } from 'react';
import styled from 'styled-components';
import { classNames, font, spacing } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';

const PurpleTag = styled.span.attrs(props => ({
  className: classNames({
    caps: true,
    'inline-block': true,
    'bg-purple': true,
    'font-white': true,
    [font('hnm', 5)]: true,
    [spacing({ s: 1 }, { margin: ['right'] })]: true,
  }),
}))`
  padding: 0.2em 0.5em;
`;

type Props = {|
  tagText?: string,
  children: Node,
|};

const MessageBar = ({ tagText, children }: Props) => (
  <VerticalSpace
    size="m"
    properties={['padding-top', 'padding-bottom']}
    className={classNames({
      [font('hnl', 5)]: true,
    })}
  >
    {tagText && <PurpleTag>{tagText}</PurpleTag>}
    {children}
  </VerticalSpace>
);
export default MessageBar;
