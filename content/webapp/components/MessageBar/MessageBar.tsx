import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Space, {
  SpaceComponentProps,
} from '@weco/common/views/components/styled/Space';

type ColouredTagProps = PropsWithChildren<SpaceComponentProps>;

const ColouredTag: FunctionComponent<ColouredTagProps> = styled.span.attrs({
  className: font('intb', 6),
})<ColouredTagProps>`
  display: inline-block;
  color: ${props => props.theme.color('white')};
  background-color: ${props => props.theme.color('neutral.700')};
  padding: 0.2em 0.5em;
  text-transform: uppercase;
  ${props => props.theme.makeSpacePropertyValues('s', ['margin-right'])}
`;

type Props = PropsWithChildren<{
  tagText?: string;
}>;

const MessageBar: FunctionComponent<Props> = ({ tagText, children }) => (
  <Space
    $v={{
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
