const prefixName = 'toggle_';
const cookieExpiry = 31536000;

function withAbTest(ctx, next) {
  const validToggle = (toggles, toggleItem) => {
    return Object.keys(toggles).filter(toggle => {
      return toggle === toggleItem;
    });
  };

  if (ctx.toggles) {
    // want to enable abtest
    if (ctx.query.abtest) {
      const validToggleFeature = validToggle(ctx.toggles, ctx.query.abtest); // check valid token before set cookie
      if (validToggleFeature.length) {
        ctx.cookies.set(prefixName + ctx.query.abtest, true, {
          maxAge: cookieExpiry,
        });
      }
      // want to turn abtest off
    } else if (ctx.query.abtestoff) {
      const validToggleFeature = validToggle(ctx.toggles, ctx.query.abtestoff); // check valid token before set book
      if (validToggleFeature.length) {
        ctx.cookies.set(prefixName + ctx.query.abtestoff, null);
      }
    }
  }

  return next();
}

module.exports = withAbTest;
