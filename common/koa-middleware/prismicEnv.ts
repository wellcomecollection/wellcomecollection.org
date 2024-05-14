import Koa from 'koa';

export const prismicEnv = async (
  ctx: Koa.Context,
  next: Koa.Next
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<any> => {
  const isPrismicStage = ctx.cookies.get('toggle_prismicStage');
  const noisyUrl =
    ctx.request.url === '/account/api/auth/me' ||
    ctx.request.url.match(/_next.*/);

  if (!noisyUrl && isPrismicStage && process.env.PRISMIC_ENV !== 'stage') {
    process.env.PRISMIC_ENV = 'stage';
  } else if (
    !noisyUrl &&
    !isPrismicStage &&
    process.env.PRISMIC_ENV !== 'prod'
  ) {
    process.env.PRISMIC_ENV = 'prod';
  }

  await next();
};
