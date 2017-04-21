import {createPageConfig} from '../model/page-config';
import {getCatalogueItem} from '../services/wellcomecollection-api';

export const catalogueItem = async(ctx, next) => {
  const id = ctx.params.id;
  const item = await getCatalogueItem(id);

  ctx.render('pages/catalogue-item', {
    pageConfig: createPageConfig({
      title: 'Catalogue item',
      inSection: 'explore'
    }),
    item
  });

  return next();
};
