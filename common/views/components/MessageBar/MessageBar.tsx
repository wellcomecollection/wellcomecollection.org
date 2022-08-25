import { ReactNode, FunctionComponent } from 'react';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
import Space, { SpaceComponentProps } from '../styled/Space';

const ColouredTag: FunctionComponent<SpaceComponentProps> = styled.span.attrs({
  className: classNames({
    caps: true,
    'inline-block': true,
    'bg-charcoal': true,
    'font-white': true,
    [font('intb', 6)]: true,
  }),
})<SpaceComponentProps>`
  padding: 0.2em 0.5em;
  ${props =>
    props.theme.makeSpacePropertyValues(
      's',
      ['margin-right'],
      undefined,
      undefined
    )}
`;

type Props = {
  tagText?: string;
  children: ReactNode;
};

const MessageBar: FunctionComponent<Props> = ({ tagText, children }: Props) => (
  <Space
    v={{
      size: 'm',
      properties: ['padding-top', 'padding-bottom'],
    }}
    className={classNames({
      [font('intr', 6)]: true,
    })}
  >
    {tagText && <ColouredTag>{tagText}</ColouredTag>}
    {children}
  </Space>
);
export default MessageBar;
