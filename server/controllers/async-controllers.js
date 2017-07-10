import {getSeries} from '../services/wordpress';
import {PromoListFactory} from '../model/promo-list';
import {getForwardFill, getUnpublishedSeries} from '../model/series';
import {getSeriesColor} from '../data/series';
import {createNumberedList} from '../model/numbered-list';
import {getLatestInstagramPosts} from '../services/instagram';

export const seriesNav = async(ctx, next) => {
  const {id} = ctx.params;
  const {current} = ctx.request.query;
  const seriesResponse = await getSeries(id, 6, 1);
  const series = seriesResponse ? getForwardFill(seriesResponse) : getUnpublishedSeries(id);
  const color = getSeriesColor(id);
  const promoList = PromoListFactory.fromSeries(series);
  const items = promoList.items.toJS();
  const image = items[0].image;
  const seriesNavModel = createNumberedList({
    name: promoList.name,
    image: image,
    items: items,
    color: color
  });

  ctx.render('components/numbered-list/numbered-list', {
    current,
    model: seriesNavModel,
    modifiers: ['horizontal', 'sticky'],
    data: {
      classes: ['js-series-nav'],
      sliderId: `series-nav--${id}`
    }
  });

  ctx.body = {
    html: ctx.body
  };

  return next();
};

export const seriesTransporter = async(ctx, next) => {
  const { id } = ctx.params;
  const { current } = ctx.request.query;
  const seriesResponse = await getSeries(id, 6, {page: 1});
  const series = seriesResponse ? getForwardFill(seriesResponse) : getUnpublishedSeries(id);

  const color = getSeriesColor(id);
  const promoList = PromoListFactory.fromSeries(series);
  const items = promoList.items.toJS();
  const image = items[0].image;
  const seriesNavModel = createNumberedList({
    name: promoList.name,
    image: image,
    items: items,
    color: color
  });

  ctx.render('components/numbered-list/numbered-list', {
    current,
    model: seriesNavModel,
    modifiers: ['transporter'],
    data: {
      classes: ['js-numbered-list-transporter'],
      sliderId: `transporter--${id}`
    }
  });

  ctx.body = {
    html: ctx.body
  };

  return next();
};

export const latestInstagramPosts = async(ctx, next) => {
  const instagramPosts = await getLatestInstagramPosts(10);

  ctx.render('components/social-media-block/social-media-block', {
    model: {
      posts: instagramPosts,
      service: 'Instagram',
      icon: 'social/instagram',
      url: 'https://instagram.com/wellcomecollection',
      handle: 'wellcomecollection'
    }
  });

  ctx.body = {
    html: ctx.body
  };

  return next();
};

export const seriesContainerPromoList = async(ctx, next) => {
  const {id} = ctx.params;
  const series = await getSeries(id, 8, {page: 1});
  const promos = PromoListFactory.fromSeries(series);

  ctx.render('components/series-container/promos-list', {
    promos: promos.items.toJS()
  });

  ctx.body = {
    html: ctx.body
  };

  return next();
};
