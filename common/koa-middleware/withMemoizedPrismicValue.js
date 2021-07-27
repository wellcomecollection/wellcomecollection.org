const withMemoizedPrismicValue = ({
  name,
  getValueFromApi,
  refreshInterval,
}) => {
  let memoized;
  let lastUpdated = Number.MAX_VALUE;
  const refresh = async memoizedPrismic => {
    memoized = await getValueFromApi(memoizedPrismic);
    lastUpdated = Date.now();
  };

  return async (ctx, next) => {
    if (!memoized || Date.now() - lastUpdated > refreshInterval) {
      await refresh(ctx.memoizedPrismic);
    }
    ctx[name] = memoized;
    return next();
  };
};

module.exports = withMemoizedPrismicValue;
