import breakpoints from '../../../client/scss/utilities/variables_config/breakpoints';
import gridConfig from '../../../client/scss/utilities/variables_config/grid-config';

export const context = {
  pageDescription: {
    title: 'Visual Architecture',
    lead: true,
    meta: {
      value: `Note: the below describes a few ideals that have not yet been implemented, but it will give us and
others direction.`
    }
  },
  breakpoints: Object.keys(breakpoints).map((key) => {
    return {
      name: key,
      size: breakpoints[key]
    };
  }),
  gridConfig: Object.keys(gridConfig).map((key) => {
    return {
      name: key,
      gutterWidth: gridConfig[key].gutter,
      marginWidth: gridConfig[key].padding
    };
  })
};
