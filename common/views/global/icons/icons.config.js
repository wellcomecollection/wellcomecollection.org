import * as icons from '../../../icons';

const allIcons = Object.keys(icons).map(key => {
  return {
    name: key,
    icons: icons[key]
  };
});

export const status = 'graduated';
export const context = {
  allIcons
};
