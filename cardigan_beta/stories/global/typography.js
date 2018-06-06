import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
import fonts from '../../../server/ui-config/fonts';
import { withReadme } from 'storybook-readme';
import typographyReadme from './typography.md';

const stories = storiesOf('Global', module);

const fontsArr = Object.keys(fonts)
  .map(key => {
    return {...fonts[key], name: key.replace(/'/g, '')};
  });

const Typography = () => {
  const example = text('Text', 'Make it pop');

  return (
    <div>
      {fontsArr.map(font => (
        <div key={font.name} className='styleguide__font'>
          <h2 className='styleguide__font__name'>{font.name}</h2>
          <p className={`styleguide__font__example--${font.name}`}>{example}</p>
          <dl className='styleguide__font__properties'>
            <dt className='styleguide__font__property'>Font-size: </dt>
            <dd className='styleguide__font__value'>{font["'font-size'"]}</dd>
            <dt className='styleguide__font__property'>Letter-spacing: </dt>
            <dd className='styleguide__font__value'>{font["'letter-spacing'"]}</dd>
            <dt className='styleguide__font__property'>Line-height: </dt>
            <dd className='styleguide__font__value'>{font["'line-height'"]}</dd>
          </dl>
        </div>
      ))}
    </div>
  );
};

stories
  .add('Typography', withReadme(typographyReadme, Typography));
