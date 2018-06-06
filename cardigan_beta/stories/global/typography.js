import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs/react';

const stories = storiesOf('Global', module);
const fonts = [
  {
    name: 'WB1',
    size: '156px',
    spacing: '-20',
    lineHeight: '200px'
  },
  {
    name: 'WB2',
    size: '60px',
    spacing: '-20',
    lineHeight: '78px'
  },
  {
    name: 'WB3',
    size: '44px',
    spacing: '0',
    lineHeight: '60px'
  },
  {
    name: 'WB4',
    size: '33px',
    spacing: '0',
    lineHeight: '48px'
  },
  {
    name: 'WB5',
    size: '22px',
    spacing: '20',
    lineHeight: '32px'
  },
  {
    name: 'WB6',
    size: '19px',
    spacing: '20',
    lineHeight: '28px'
  },
  {
    name: 'WB7',
    size: '15px',
    spacing: '20',
    lineHeight: '24px'
  },
  {
    name: 'HNM1',
    size: '36px',
    spacing: '20',
    lineHeight: '48px'
  },
  {
    name: 'HNM2',
    size: '26px',
    spacing: '20',
    lineHeight: '38px'
  },
  {
    name: 'HNM3',
    size: '20px',
    spacing: '40',
    lineHeight: '30px'
  },
  {
    name: 'HNM4',
    size: '16px',
    spacing: '40',
    lineHeight: '24px'
  },
  {
    name: 'HNM5',
    size: '14px',
    spacing: '80',
    lineHeight: '20px'
  },
  {
    name: 'HNM6',
    size: '12px',
    spacing: '80',
    lineHeight: '18px'
  },
  {
    name: 'HNL1',
    size: '36px',
    spacing: '40',
    lineHeight: '48px'
  },
  {
    name: 'HNL2',
    size: '26px',
    spacing: '40',
    lineHeight: '38px'
  },
  {
    name: 'HNL3',
    size: '20px',
    spacing: '40',
    lineHeight: '30px'
  },
  {
    name: 'HNL4',
    size: '16px',
    spacing: '40',
    lineHeight: '24px'
  },
  {
    name: 'HNL5',
    size: '14px',
    spacing: '40',
    lineHeight: '20px'
  },
  {
    name: 'HNL6',
    size: '12px',
    spacing: '80',
    lineHeight: '18px'
  },
  {
    name: 'HNL7',
    size: '11px',
    spacing: '80',
    lineHeight: '18px'
  },
  {
    name: 'LR1',
    size: '18px',
    spacing: '0',
    lineHeight: '24px'
  },
  {
    name: 'LR2',
    size: '14px',
    spacing: '-40',
    lineHeight: '24px'
  },
  {
    name: 'LR3',
    size: '12px',
    spacing: '-20',
    lineHeight: '18px'
  }
];

const Typography = () => {
  const example = text('Text', 'Text goes here');

  return (
    <div>
      {fonts.map(font => (
        <div key={font.name} className='styleguide__font'>
          <h2 className='styleguide__font__name'>{font.name}</h2>
          <p className={`styleguide__font__example--${font.name}`}>{example}</p>
          <dl className='styleguide__font__properties'>
            <dt className='styleguide__font__property'>Font-size:</dt>
            <dd className='styleguide__font__value'>{font.size}</dd>
            <dt className='styleguide__font__property'>Letter-spacing:</dt>
            <dd className='styleguide__font__value'>{font.spacing}</dd>
            <dt className='styleguide__font__property'>Line-height:</dt>
            <dd className='styleguide__font__value'>{font.lineHeight}</dd>
          </dl>
        </div>
      ))}
    </div>
  );
};

stories
  .add('Typography', Typography);
