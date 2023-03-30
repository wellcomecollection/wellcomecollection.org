import { FunctionComponent, PropsWithChildren } from 'react';
import Space from '../styled/Space';

const SpacingSection: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>{children}</Space>
  );
};

export default SpacingSection;
