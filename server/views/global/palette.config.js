import colors from '../../../client/scss/utilities/variables_config/colors.js';

const colorsArray = Object.keys(colors).map(key => {
  return {
    name: key.replace(/'/g, ''),
    hex: colors[key][0],
    attribution: colors[key][1]
  };
});

const primary = colorsArray.filter(i => i.attribution === 'primary')
  .map(i => {
    return {
      name: i.name,
      hex: i.hex
    };
  });

const secondary = colorsArray.filter(i => i.attribution === 'secondary')
  .map(i => {
    return {
      name: i.name,
      hex: i.hex
    };
  });

export const status = 'graduated';
export const context = {
  primary,
  secondary
};

