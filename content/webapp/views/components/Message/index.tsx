import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

const Wrapper = styled(Space).attrs({
  className: font('sans-bold', -1),
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  display: inline-block;
  border-left: 5px solid ${props => props.theme.color('yellow')};
`;

type Props = {
  text: string;
};

const Message: FunctionComponent<Props> = ({ text }) => (
  <Wrapper data-component="message">{text}</Wrapper>
);
export default Message;
