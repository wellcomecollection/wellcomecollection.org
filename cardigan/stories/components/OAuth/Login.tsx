import { storiesOf } from '@storybook/react';
import Login from '../../../../common/views/components/oauth/Login';

const LoginExample = () => {
  return <Login text={'Identity'} />;
};

const stories = storiesOf('Components/Oath', module);
stories.add('Oauth login', LoginExample);
