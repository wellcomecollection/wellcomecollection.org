import { FunctionComponent, ReactNode } from 'react';
import Space from '../styled/Space';

type Props = {
  children: ReactNode;
};

const SpacingSection: FunctionComponent<Props> = ({ children }) => {
  return (
    <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>{children}</Space>
  );
};

export default SpacingSection;
