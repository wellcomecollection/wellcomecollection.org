export function determineFeaturesCohort(config) {
  return (ctx, next) => {
    config.featuresCohort = ctx.cookies.get('WC_featuresCohort') || 'default';
    return next();
  };
}
