import { font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';
import { FC } from 'react';

const Wrapper = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
  },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: `inline-block ${font('intb', 5)}`,
})`
  border-left: 5px solid ${props => props.theme.color('yellow')};
`;

type Props = {
  text: string;
};

const Message: FC<Props> = ({ text }) => <Wrapper>{text}</Wrapper>;
export default Message;
