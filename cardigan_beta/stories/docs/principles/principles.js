import { storiesOf } from '@storybook/react';
import principlesReadme from './README.md';
import { doc }  from 'storybook-readme';

const stories = storiesOf('Documentation', module);

stories
  .add('Principles', doc(principlesReadme));
