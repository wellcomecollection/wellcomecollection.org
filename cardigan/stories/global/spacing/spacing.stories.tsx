import { FunctionComponent } from 'react';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

export const Spacing: FunctionComponent = () => {
  return (
    <div className="bg-cream font-white">
      <SpacingSection>
        <div className="bg-green" style={{ minHeight: '200px' }}>
          Section
        </div>
      </SpacingSection>
      <SpacingSection>
        <div className="bg-green" style={{ minHeight: '200px' }}>
          Section
          <SpacingComponent>
            <div className="bg-teal" style={{ minHeight: '100px' }}>
              Component
            </div>
          </SpacingComponent>
          <SpacingComponent>
            <div className="bg-teal" style={{ minHeight: '100px' }}>
              Component
            </div>
          </SpacingComponent>
          <SpacingComponent>
            <div className="bg-teal" style={{ minHeight: '100px' }}>
              Component
            </div>
          </SpacingComponent>
        </div>
      </SpacingSection>
      <SpacingSection>
        <div className="bg-green" style={{ minHeight: '200px' }}>
          Section
        </div>
      </SpacingSection>
    </div>
  );
};
