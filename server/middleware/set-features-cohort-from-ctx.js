import {setFeaturesCohort} from '../utils/flags';

export function setFeaturesCohortFromCtx() {
  return (ctx, next) => {
    const featuresCohort = ctx.request.query.cohort || ctx.cookies.get('WC_featuresCohort') || 'default';
    setFeaturesCohort(featuresCohort);
    return next();
  }
}
