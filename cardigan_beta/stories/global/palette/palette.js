import { storiesOf } from '@storybook/react';
import colors from '../../../../server/ui-config/colors';
import { withReadme } from 'storybook-readme';
import paletteReadme from './README.md';

const stories = storiesOf('Global', module);

const colorsArr = Object.keys(colors)
  .map(key => {
    const val = colors[key];
    return val.indexOf('#') > -1 && { // Don't display e.g. 'currentColor' or 'transparent'
      name: key.replace(/'/g, ''),
      hex: val
    };
  }).filter(Boolean);

const Palette = () => {
  return (
    <div className='styleguide__palette__section'>
      {colorsArr.map(color => (
        <div key={color.name} className='styleguide__palette__block'>
          <h2 className='styleguide__palette__name'>{color.name}</h2>
          <div className={`styleguide__palette__color styleguide__palette__color--${color.name}`} style={{background: color.hex}}></div>
          <span className='styleguide__palette__hex'>Hex: <code className='styleguide__palette__code'>{color.hex}</code></span>
        </div>
      ))}
    </div>
  );
};

stories
  .add('Palette', withReadme(paletteReadme, Palette));
