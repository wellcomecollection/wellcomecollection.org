import { storiesOf } from '@storybook/react';
import BasicPage from '../../common/views/components/Templates/BasicPage/BasicPage';
import StatusIndicator from '../../common/views/components/StatusIndicator/StatusIndicator';
import WobblyBackground from '../../common/views/components/Templates/BasicPage/WobblyBackground';

storiesOf('Templates/Basic page', module)
  .add('without an image', () => (
    <BasicPage
      Background={WobblyBackground()}
      title='This can be a title of some type of length'
      body={[]}
      DateInfo={<div>Some date — some other date</div>}
      Description={<div>This is a description</div>}
      InfoBar={<StatusIndicator start={new Date()} end={new Date()} />} />
  ));
