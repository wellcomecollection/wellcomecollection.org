import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';
import Readme from './README.md';

const stories = storiesOf('Global', module);

const sizes = [1, 2, 3, 4, 5, 6];
const families = ['wb', 'hnm', 'hnl', 'lr'];

const Typography = () => {
  const example = text('Text', 'Make it pop');

  return (
    <div>
      {families.map(font => (
        <div key={font}>
          {sizes.map(size => (
            <div key={size} className="styleguide__font">
              <h2 className="styleguide__font__name">
                <code>
                  font-{font} font-size-{size}
                </code>
              </h2>
              <p
                className={`no-margin styleguide__font__example font-size-${size} font-${font}`}
              >
                {example}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

stories.add('Typography', Typography, { readme: { sidebar: Readme } });
