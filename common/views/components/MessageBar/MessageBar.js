// @flow
import { type Node } from 'react';
import styled from 'styled-components';
import { classNames, font, spacing } from '../../../utils/classnames';

const PurpleTag = styled.span.attrs(props => ({
  className: classNames({
    caps: true,
    'inline-block': true,
    'bg-purple': true,
    'font-white': true,
    [font({ s: 'HNM5' })]: true,
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
  <div
    className={classNames({
      [font({ s: 'HNL4' })]: true,
      [spacing({ s: 3 }, { padding: ['top', 'bottom'] })]: true,
    })}
  >
    {tagText && <PurpleTag>{tagText}</PurpleTag>}
    {children}
  </div>
);
export default MessageBar;
