// @flow
import { storiesOf } from '@storybook/react';
import Contributors from '../../../common/views/components/Contributors/Contributors';

const contributors = storiesOf('Components', module);
contributors.add('Contributors', () => (
  <Contributors contributors={[]} />
));
