import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';

type Props = {
  className?: string;
  children: ReactNode;
};

const Align = styled.span<{ isActive: boolean }>`
  ${props =>
    props.isActive &&
    `
    transform: translateY(-${props.theme.fontVerticalOffset});
    display: inline-block;
  `}
`;

const AlignFont: FC<Props> = ({ children, className }) => {
  return (
    <Align className={className} isActive={useIsFontsLoaded()}>
      {children}
    </Align>
  );
};

export default AlignFont;
