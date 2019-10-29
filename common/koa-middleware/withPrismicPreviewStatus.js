function withPrismicPreviewStatus(ctx, next) {
  // for previews on localhost we use /preview to determine whether the 'isPreview' cookie should be set
  // this kinda works for live too, but not for shared preview links, as they never hit /preview
  // we therefore look for the subdomain .preview to determine if it's a preview
  ctx.isPreview = Boolean(ctx.request.host.startsWith('preview.'));
  return next();
}

module.exports = withPrismicPreviewStatus;
