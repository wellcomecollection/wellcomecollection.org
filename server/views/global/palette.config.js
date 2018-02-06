import colors from './../../ui-config/colors.js';

const colorsArray = Object.keys(colors).map(key => {
  return {
    name: key.replace(/'/g, ''),
    hex: colors[key]
  };
});

export const status = 'graduated';
export const context = {
  colorsArray
};
