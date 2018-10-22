// @flow
import {Component, Fragment} from 'react';
import {classNames, font, spacing, cssGrid} from '@weco/common/utils/classnames';
import {getExhibitions} from '@weco/common/services/prismic/exhibitions';
import {getEvents} from '@weco/common/services/prismic/events';
import {getArticles} from '@weco/common/services/prismic/articles';
import {convertJsonToDates} from './event';
import pharmacyOfColourData from '@weco/common/data/the-pharmacy-of-colour';
import ourVoiceOurWayData from '@weco/common/data/our-voice-our-way';
import {
  exhibitionLd,
  eventLd,
  articleLd
} from '@weco/common/utils/json-ld';
import {default as PageWrapper} from '@weco/common/views/components/PageWrapper/PageWrapper';
import Promo from '@weco/common/views/components/Promo/Promo';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import ExhibitionsAndEvents from '@weco/common/views/components/ExhibitionsAndEvents/ExhibitionsAndEvents';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import type {UiExhibition} from '@weco/common/model/exhibitions';
import type {UiEvent} from '@weco/common/model/events';
import type {Article} from '@weco/common/model/articles';
import type {PaginatedResults} from '@weco/common/services/prismic/types';

type Props = {|
  exhibitions: PaginatedResults<UiExhibition>,
  events: PaginatedResults<UiEvent>,
  articles: PaginatedResults<Article>,
  tryTheseTooPromos: any[],
  eatShopPromos: any[]
|}

const pageDescription = 'Visit our free museum and library in central London connecting science, medicine, life and art. Explore our exhibitions, live events, gallery tours, restaurant, cafe, bookshop, and cafe. Fully accessible. Open late on Thursday evenings.';
const pageImage = 'https://iiif.wellcomecollection.org/image/prismic:fc1e68b0528abbab8429d95afb5cfa4c74d40d52_tf_180516_2060224.jpg/full/800,/0/default.jpg';
export class HomePage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const exhibitionsPromise = getExhibitions(context.req, {
      period: 'next-seven-days',
      order: 'asc'
    });
    const eventsPromise = getEvents(context.req, {
      period: 'next-seven-days',
      order: 'asc'
    });
    const articlesPromise = getArticles(context.req, {pageSize: 4});
    const [exhibitions, events, articles] = await Promise.all([
      exhibitionsPromise, eventsPromise, articlesPromise
    ]);

    if (events && exhibitions && articles) {
      return {
        exhibitions,
        events,
        articles,
        title: null,
        description: pageDescription,
        type: 'website',
        canonicalUrl: `https://wellcomecollection.org/`,
        imageUrl: pageImage,
        siteSection: 'index',
        analyticsCategory: 'editorial',
        pageJsonLd: [
          ...exhibitions.results.map(exhibitionLd),
          ...events.results.map(eventLd),
          ...articles.results.map(articleLd)
        ]
      };
    } else {
      return {statusCode: 404};
    }
  }

  render() {
    const events = this.props.events.results.map(convertJsonToDates);
    const exhibitions = this.props.exhibitions.results.map(exhibition => {
      return {
        start: exhibition.start && new Date(exhibition.start),
        end: exhibition.end && new Date(exhibition.end),
        ...exhibition
      };
    });
    const articles = this.props.articles;
    return (
      <Fragment>
        <div className='css-grid__container'>
          <div className='css-grid'>
            <div className={classNames({
              [cssGrid({s: 12, m: 12, l: 10, xl: 9})]: true
            })}>
              <h1 className={classNames({
                [font({s: 'WB4', m: 'WB3'})]: true,
                [spacing({s: 3}, {margin: ['top', 'bottom']})]: true
              })}>
                The free museum and library for the incurably curious
              </h1>
            </div>
          </div>
        </div>

        <SectionHeader
          title='This week at Wellcome Collection'
          linkText='All exhibitions and events'
          linkUrl='/whats-on'
        />
        <ExhibitionsAndEvents
          exhibitions={exhibitions}
          events={events}
          extras={[ourVoiceOurWayData, pharmacyOfColourData]}
        />

        <SectionHeader
          title='Latest articles, comics and more'
          linkText='All stories'
          linkUrl='/stories'
        />

        <div className='css-grid__container'>
          <div className='css-grid'>
            {articles.results.map(article => {
              const isSerial = article.series.find(series => series.schedule.length > 0);
              return (
                <div
                  key={article.id}
                  className={classNames({
                    [cssGrid({s: 12, m: 6, l: 3, xl: 3})]: true
                  })}>
                  {/* $FlowFixMe */}
                  <Promo
                    sizes={'(min-width: 1420px) 282px, (min-width: 960px) calc(21.36vw - 17px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)'}
                    url={`/articles/${article.id}`}
                    contentType={article.format && article.format.title || (isSerial ? 'Serial' : 'Story')}
                    image={article.image}
                    title={article.title}
                    weight={'default'}
                    description={article.promoText}
                    series={article.series}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Fragment>
    );
  }
};

export default PageWrapper(HomePage);
