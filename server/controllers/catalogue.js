import {getCatalogueItem} from '../services/wellcomecollection-api';

export async function catalogueItem(ctx, next) {
  const id = ctx.params.id;
  const item = await getCatalogueItem(id);

  ctx.body = item.body;
  return next();
}
