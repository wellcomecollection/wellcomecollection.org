import {Map} from 'immutable';
import {getEnvWithGlobalsExtensionsAndFilters} from './env-utils';
import markdown from 'nunjucks-markdown';
import marked from 'marked';

export default function render(root, extraGlobals) {
  return (ctx, next) => {
    const [flags, cohorts] = ctx.intervalCache.get('flags');
    const globalAlert = ctx.intervalCache.get('globalAlert');
    const openingHours = ctx.intervalCache.get('collectionOpeningTimes');
    const galleriesLibrary = openingHours && openingHours.placesOpeningHours && openingHours.placesOpeningHours.filter(venue => {
      return venue.name.toLowerCase() === 'galleries' || venue.name.toLowerCase() === 'library';
    });
    const restaurantCafeShop = openingHours && openingHours.placesOpeningHours && openingHours.placesOpeningHours.filter(venue => {
      return venue.name.toLowerCase() === 'restaurant' || venue.name.toLowerCase() === 'café' || venue.name.toLowerCase() === 'shop';
    });
    const groupedVenues = {
      galleriesLibrary: {
        title: 'Venue',
        hours: galleriesLibrary
      },
      restaurantCafeShop: {
        title: 'Eat & Shop',
        hours: restaurantCafeShop
      }
    };
    const globals = Map(Object.assign({}, extraGlobals, {
      featuresCohort: ctx.featuresCohort,
      featureFlags: flags || {},
      cohorts: cohorts || {},
      globalAlert: globalAlert,
      openingHours: Object.assign({}, openingHours, {groupedVenues})
    }));
    const env = getEnvWithGlobalsExtensionsAndFilters(root, globals);
    ctx.render = (relPath, templateData) => ctx.body = env.render(`${relPath}.njk`, templateData);
    markdown.register(env, marked);
    return next();
  };
}
