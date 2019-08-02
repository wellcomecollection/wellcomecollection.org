// @flow
import { type Node } from 'react';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';

const PurpleTag = styled.span.attrs(props => ({
  className: classNames({
    caps: true,
    'inline-block': true,
    'bg-purple': true,
    'font-white': true,
    [font('hnm', 5)]: true,
    'margin-right-6': true,
  }),
}))`
  padding: 0.2em 0.5em;
`;

type Props = {|
  tagText?: string,
  children: Node,
|};

const MessageBar = ({ tagText, children }: Props) => (
  <Space
    v={{
      size: 'm',
      properties: ['padding-top', 'padding-bottom'],
    }}
    className={classNames({
      [font('hnl', 5)]: true,
    })}
  >
    {tagText && <PurpleTag>{tagText}</PurpleTag>}
    {children}
  </Space>
);
export default MessageBar;
