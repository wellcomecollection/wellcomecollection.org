import { ReactNode, FunctionComponent } from 'react';
import styled from 'styled-components';
import { font } from '../../../utils/classnames';
import Space, { SpaceComponentProps } from '../styled/Space';

const ColouredTag: FunctionComponent<SpaceComponentProps> = styled.span.attrs({
  className: `font-white ${font('intb', 6)}`,
})<SpaceComponentProps>`
  display: inline-block;
  background-color: ${props => props.theme.color('neutral.700')};
  padding: 0.2em 0.5em;
  text-transform: uppercase;
  ${props => props.theme.makeSpacePropertyValues('s', ['margin-right'])}
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
    className={font('intr', 6)}
  >
    {tagText && <ColouredTag>{tagText}</ColouredTag>}
    {children}
  </Space>
);
export default MessageBar;
