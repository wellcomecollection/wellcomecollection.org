export function determineFeaturesCohort() {
  return (ctx, next) => {
    ctx.featuresCohort = ctx.cookies.get('WC_featuresCohort') || 'default';
    return next();
  };
}
