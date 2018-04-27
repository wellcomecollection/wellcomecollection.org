import React from 'react';
import ReactDOMServer from 'react-dom/server';
import searchQuery from 'search-query-parser';
import {getSeries} from '../services/wordpress';
import {PromoListFactory} from '../model/promo-list';
import {getForwardFill} from '../model/series';
import {getSeriesColor} from '../data/series';
import {createNumberedList} from '../model/numbered-list';
import {getArticleSeries} from '../services/prismic';
import {getMultiContent} from '../../common/services/prismic/multi-content';
import ContentListItems from '../../common/views/components/ContentList/ContentListItems';

// Performance alert: we're having to make a call to wordpress and then if that
// fails, we have 2 API calls to Prismic in 'getArticleSeries' in order to get
// the info we need to display the series nav
const getSeriesData = async(ctx) => {
  const {id} = ctx.params;
  const seriesResponse = await getSeries(id, 6, 1);
  const series = seriesResponse ? getForwardFill(seriesResponse) : await getArticleSeries(id);
  const promoList = PromoListFactory.fromSeries(series);
  const items = promoList.items.toJS();
  const image =  items[0].image;
  const color = seriesResponse ? getSeriesColor(id) : series.color;
  return {
    current: ctx.request.query.current,
    model: createNumberedList({
      url: `${series.id}`,
      name: promoList.name,
      image: image,
      items: items,
      color: color
    })
  };
};

export const seriesNav = async(ctx, next) => {
  const {id} = ctx.params;
  const seriesData = await getSeriesData(ctx);

  ctx.render('components/numbered-list/numbered-list', Object.assign({}, seriesData, {
    modifiers: ['horizontal', 'sticky'],
    data: {
      classes: ['js-series-nav'],
      sliderId: `series-nav--${id}`
    }
  }));

  ctx.body = {
    html: ctx.body
  };

  return next();
};

export const seriesTransporter = async(ctx, next) => {
  const {id} = ctx.params;
  const seriesData = await getSeriesData(ctx);

  ctx.render('components/numbered-list/numbered-list', Object.assign({}, seriesData, {
    modifiers: ['transporter'],
    data: {
      classes: ['js-numbered-list-transporter'],
      sliderId: `transporter--${id}`
    }
  }));

  ctx.body = {
    html: ctx.body
  };

  return next();
};

export const contentList = async (ctx, next) => {
  const query = searchQuery.parse(ctx.query.query, { keywords: ['ids'] });
  // searchQueryParser automatically changes comma seperated lists into arrays
  const ids = typeof query.ids === 'string' ? query.ids.split(',') : query.ids;
  const multiContent = await getMultiContent(ctx.request, {ids});
  ctx.body = {
    html: ReactDOMServer.renderToString(
      React.createElement(ContentListItems, { items: multiContent.results })
    )
  };

  return next();
};
