import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {getSeries} from '../services/wordpress';
import {getArticleSeries} from '../services/prismic';
import {PromoListFactory} from '../model/promo-list';
import {getForwardFill} from '../model/series';
import {getSeriesColor} from '../data/series';
import {createNumberedList} from '../model/numbered-list';
import {search} from '../../common/services/prismic/search';
import {classNames, spacing} from '../../common/utils/classnames';
import {getArticleSeries as getArticleSeriesProperly} from '../../common/services/prismic/article-series';
import Layout12 from '../../common/views/components/Layout12/Layout12';
import SearchResults from '../../common/views/components/SearchResults/SearchResults';
import CardGrid from '../../common/views/components/CardGrid/CardGrid';

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
      // TODO: (wordpres migration) series.url doesn't need to be here.
      url: `${series.id || series.url}`,
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

const SeriesTransporter = ({series}: any) => {
  return (
    <div>
      <Layout12>
        <div className={classNames({
          [spacing({s: 4}, {margin: ['top', 'bottom']})]: true,
          [spacing({s: 4}, {padding: ['bottom']})]: true,
          'border-bottom-width-1': true,
          'border-color-pumice': true
        })}>
          <h2 className={classNames({
            'h1': true,
            [`font-${series.color}`]: true,
            'plain-link': true,
            'no-margin': true
          })}>
            <a
              className={classNames({
                'plain-link': true
              })}
              href={`/series/${series.id}`}>{series.title}</a>
          </h2>
          <div className={classNames({
            [spacing({s: 2}, {margin: ['top']})]: true
          })}>
            <p className={classNames({
              'no-margin': true
            })}>{series.promoText}</p>
          </div>
        </div>
      </Layout12>
      <CardGrid items={series.items} hidePromoText={true} />
    </div>
  );
};

export const seriesTransporter = async(ctx, next) => {
  const {id} = ctx.params;
  const seriesAndArticles = await getArticleSeriesProperly(ctx.request, {id});

  ctx.body = {
    html: ReactDOMServer.renderToString(
      React.createElement(SeriesTransporter, {
        series: seriesAndArticles.series
      })
    )
  };

  return next();
};

export const renderSearch = async (ctx, next) => {
  const query = ctx.query.query || '';
  const searchResponse = await search(ctx.request, query);

  ctx.body = {
    html: ReactDOMServer.renderToString(
      React.createElement(SearchResults, { items: searchResponse.results })
    )
  };

  return next();
};

export const renderPartOfExhibitLink = async (ctx, next) => {
  const query = ctx.query.query || '';
  const searchResponse = await search(ctx.request, query);

  ctx.body = {
    html: ReactDOMServer.renderToString(
      React.createElement(SearchResults, { items: searchResponse.results })
    )
  };

  return next();
};
