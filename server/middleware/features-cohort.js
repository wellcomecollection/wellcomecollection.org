export function determineFeaturesCohort() {
  return (ctx, next) => {
    ctx.featuresCohort = ctx.request.query.cohort || ctx.cookies.get('WC_featuresCohort') || 'default';
    return next();
  };
}
