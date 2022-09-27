import { FunctionComponent } from 'react';
import styled from 'styled-components';

import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

const ColorSection = styled.div<{ bgColor: string }>`
  background-color: ${props => props.theme.newColor(props.bgColor)};
`;

export const Spacing: FunctionComponent = () => {
  return (
    <ColorSection bgColor="warmNeutral.300" className="font-white">
      <SpacingSection>
        <ColorSection bgColor="accent.green" style={{ minHeight: '200px' }}>
          Section
        </ColorSection>
      </SpacingSection>
      <SpacingSection>
        <ColorSection bgColor="accent.green" style={{ minHeight: '200px' }}>
          Section
          <SpacingComponent>
            <ColorSection bgColor="accent.blue" style={{ minHeight: '100px' }}>
              Component
            </ColorSection>
          </SpacingComponent>
          <SpacingComponent>
            <ColorSection bgColor="accent.blue" style={{ minHeight: '100px' }}>
              Component
            </ColorSection>
          </SpacingComponent>
          <SpacingComponent>
            <ColorSection bgColor="accent.blue" style={{ minHeight: '100px' }}>
              Component
            </ColorSection>
          </SpacingComponent>
        </ColorSection>
      </SpacingSection>
      <SpacingSection>
        <ColorSection bgColor="accent.green" style={{ minHeight: '200px' }}>
          Section
        </ColorSection>
      </SpacingSection>
    </ColorSection>
  );
};
