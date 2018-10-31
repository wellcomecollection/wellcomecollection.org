import { storiesOf } from '@storybook/react';
import SpacingSection from '../../../../common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '../../../../common/views/components/SpacingComponent/SpacingComponent';
import spacingReadme from './README.md';

const SpacingDemo = () => {
  return (
    <div className='bg-cream font-white'>
      <SpacingSection>
        <div className='bg-green' style={{minHeight: '200px'}}>Section</div>
      </SpacingSection>
      <SpacingSection>
        <div className='bg-green' style={{minHeight: '200px'}}>
          Section
          <SpacingComponent>
            <div className='bg-teal' style={{minHeight: '100px'}}>Component</div>
          </SpacingComponent>
          <SpacingComponent>
            <div className='bg-teal' style={{minHeight: '100px'}}>Component</div>
          </SpacingComponent>
          <SpacingComponent>
            <div className='bg-teal' style={{minHeight: '100px'}}>Component</div>
          </SpacingComponent>
        </div>
      </SpacingSection>
      <SpacingSection>
        <div className='bg-green' style={{minHeight: '200px'}}>Section</div>
      </SpacingSection>
    </div>
  );
};

const stories = storiesOf('Global', module);

stories
  .add('Spacing', SpacingDemo, {info: spacingReadme});
