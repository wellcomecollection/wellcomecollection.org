import { FunctionComponent } from 'react';
import Space from '../styled/Space';

const SpacingSection: FunctionComponent = ({ children }) => (
  <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>{children}</Space>
);

export default SpacingSection;
