import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
  className?: string;
  children: ReactNode;
};

const Align = styled.span`
  .fonts-loaded & {
    transform: translateY(-${props => props.theme.fontVerticalOffset});
    display: inline-block;
  }
`;

const AlignFont: FunctionComponent<Props> = ({ children, className }) => {
  return <Align className={className}>{children}</Align>;
};

export default AlignFont;
