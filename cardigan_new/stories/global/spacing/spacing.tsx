import { FunctionComponent } from 'react';
import styled from 'styled-components';

import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import { PaletteColor } from '@weco/common/views/themes/config';

const ColorSection = styled.div<{ $bgColor: PaletteColor }>`
  background-color: ${props => props.theme.color(props.$bgColor)};
  color: ${props => props.theme.color('white')};
`;

export const Spacing: FunctionComponent = () => {
  return (
    <ColorSection $bgColor="warmNeutral.300">
      <SpacingSection>
        <ColorSection $bgColor="accent.green" style={{ minHeight: '200px' }}>
          Section
        </ColorSection>
      </SpacingSection>
      <SpacingSection>
        <ColorSection $bgColor="accent.green" style={{ minHeight: '200px' }}>
          Section
          <SpacingComponent>
            <ColorSection $bgColor="accent.blue" style={{ minHeight: '100px' }}>
              Component
            </ColorSection>
          </SpacingComponent>
          <SpacingComponent>
            <ColorSection $bgColor="accent.blue" style={{ minHeight: '100px' }}>
              Component
            </ColorSection>
          </SpacingComponent>
          <SpacingComponent>
            <ColorSection $bgColor="accent.blue" style={{ minHeight: '100px' }}>
              Component
            </ColorSection>
          </SpacingComponent>
        </ColorSection>
      </SpacingSection>
      <SpacingSection>
        <ColorSection $bgColor="accent.green" style={{ minHeight: '200px' }}>
          Section
        </ColorSection>
      </SpacingSection>
    </ColorSection>
  );
};
