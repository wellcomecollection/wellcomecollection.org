import { useContext, FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';

type Props = {
  className?: string;
  children: ReactNode;
};

const Align = styled.span<{ isOn: boolean }>`
  .fonts-loaded & {
    ${props =>
      props.isOn &&
      `
      transform: translateY(-${props.theme.fontVerticalOffset});
      display: inline-block;
    `}
  }
`;

const AlignFont: FunctionComponent<Props> = ({ children, className }) => {
  const { helveticaRegular } = useContext(TogglesContext);
  return (
    <Align isOn={helveticaRegular} className={className}>
      {children}
    </Align>
  );
};

export default AlignFont;
