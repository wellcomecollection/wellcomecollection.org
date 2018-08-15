import { storiesOf } from '@storybook/react';
import Icon from '../../../../common/views/components/Icon/Icon';
import * as icons from '../../../../common/icons';
import iconsReadme from './README.md';

const stories = storiesOf('Global', module);

const Icons = () => (
  <div>
    {Object.keys(icons).map(key => (
      <div key={key} className='styleguide__icon'>
        <p className='styleguide__icon__id'>{key}</p>
        <Icon name={key} />
      </div>
    ))}
  </div>
);

stories
  .add('Icons', Icons, {info: iconsReadme});
