import {Map} from 'immutable';
import groupBy from 'lodash.groupby';
import {isDatePast} from '../../common/utils/format-date';
import {getEnvWithGlobalsExtensionsAndFilters} from './env-utils';
import markdown from 'nunjucks-markdown';
import marked from 'marked';
import {placesOpeningHours} from '../../common/model/opening-hours';
import {exceptionalDates, upcomingExceptionalOpeningHours, exceptionalOpeningPeriods, approachingExceptionalOpeningPeriods} from '../../common/services/opening-times';
import moment from 'moment';

function london(d) {
  // $FlowFixMe
  return moment.tz(d, 'Europe/London');
};

export default function render(root, extraGlobals) {
  return (ctx, next) => {
    const [flags, cohorts] = ctx.intervalCache.get('flags');
    const globalAlert = ctx.intervalCache.get('globalAlert');
    const futureExceptionalDates = exceptionalDates.filter(exceptionalDate => exceptionalDate && !isDatePast(exceptionalDate));
    const upcomingExceptionalHours = upcomingExceptionalOpeningHours(futureExceptionalDates);
    const exceptionalOpeningHours = groupBy(upcomingExceptionalHours, item => london(item.exceptionalDate).format('YYYY-MM-DD'));
    const exceptionalOpening = exceptionalOpeningPeriods(futureExceptionalDates);
    const upcomingExceptionalOpeningPeriods = approachingExceptionalOpeningPeriods(exceptionalOpening);
    const globals = Map(Object.assign({}, extraGlobals, {
      featuresCohort: ctx.featuresCohort,
      featureFlags: flags || {},
      cohorts: cohorts || {},
      globalAlert: globalAlert,
      openingHours: {
        placesOpeningHours,
        upcomingExceptionalOpeningPeriods,
        exceptionalOpeningHours
      }
    }));
    const env = getEnvWithGlobalsExtensionsAndFilters(root, globals);
    ctx.render = (relPath, templateData) => ctx.body = env.render(`${relPath}.njk`, templateData);
    markdown.register(env, marked);
    return next();
  };
}
