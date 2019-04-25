import { storiesOf } from '@storybook/react';
import Readme from './README.md';
import colors from '../../../config/colors';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

const stories = storiesOf('Global', module);

const colorsArr = Object.keys(colors)
  .map(key => {
    const val = colors[key];
    return (
      val.indexOf('#') > -1 && {
        // Don't display e.g. 'currentColor' or 'transparent'
        name: key.replace(/'/g, ''),
        hex: val,
        rgb: hexToRgb(val),
      }
    );
  })
  .filter(Boolean);

const Palette = () => {
  return (
    <div className="styleguide__palette__section">
      {colorsArr.map(color => (
        <div key={color.name} className="styleguide__palette__block">
          <h2 className="styleguide__palette__name">{color.name}</h2>
          <div
            className={`styleguide__palette__color styleguide__palette__color--${
              color.name
            }`}
            style={{ background: color.hex }}
          />
          <div className="styleguide__palette__hex">
            Hex: <code className="styleguide__palette__code">{color.hex}</code>
          </div>
          <div className="styleguide__palette__hex">
            RGB:{' '}
            <code className="styleguide__palette__code">
              {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
            </code>
          </div>
        </div>
      ))}
    </div>
  );
};

stories.add('Palette', Palette, { readme: { sidebar: Readme } });
