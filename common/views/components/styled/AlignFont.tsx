import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';
import { useToggles } from '@weco/common/server-data/Context';

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

const AlignFont: FunctionComponent<Props> = ({ children, className }) => {
  const { inter } = useToggles();
  const isActive = useIsFontsLoaded(inter);

  return inter ? (
    <>{children}</>
  ) : (
    <Align className={className} isActive={isActive}>
      {children}
    </Align>
  );
};

export default AlignFont;
