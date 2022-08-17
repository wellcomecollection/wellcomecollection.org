import { ReactNode } from 'react';
import { classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';

const Wrapper = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
  },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'inline-block': true,
    [font('intb', 5)]: true,
  }),
})`
  border-left: 5px solid ${props => props.theme.color('yellow')};
`;

type Props = {
  text: string;
};

const Message: ReactNode = ({ text }: Props) => <Wrapper>{text}</Wrapper>;
export default Message;
