export function determineFeaturesCohort(config) {
  return (ctx, next) => {
    config.featuresCohort = ctx.cookies.get('featuresCohort') || 'default';
    return next();
  };
}
