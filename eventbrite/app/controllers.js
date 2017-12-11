// @flow
export async function getEventbriteEvent(ctx, next) {
  ctx.body = ctx.params.id;
}
