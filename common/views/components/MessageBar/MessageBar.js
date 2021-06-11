// @flow
import { type Node, type ComponentType } from 'react';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
// $FlowFixMe (tsx)
import AlignFont from '../styled/AlignFont';
// $FlowFixMe (tsx)
import Space, { type SpaceComponentProps } from '../styled/Space';

const ColouredTag: ComponentType<SpaceComponentProps> = styled(Space).attrs(
  props => ({
    className: classNames({
      caps: true,
      'inline-block': true,
      'bg-charcoal': true,
      'font-white': true,
      [font('hnm', 6)]: true,
    }),
  })
)`
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
      [font('hnl', 6)]: true,
    })}
  >
    {tagText && (
      <ColouredTag
        as="span"
        h={{
          size: 's',
          properties: ['margin-right'],
        }}
      >
        <AlignFont>{tagText}</AlignFont>
      </ColouredTag>
    )}
    {children}
  </Space>
);
export default MessageBar;
