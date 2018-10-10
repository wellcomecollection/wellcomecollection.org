// @flow
import {Component, Fragment} from 'react';
import {classNames, font, spacing, grid} from '@weco/common/utils/classnames';
import {getExhibitions} from '@weco/common/services/prismic/exhibitions';
import {getEvents} from '@weco/common/services/prismic/events';
import {convertJsonToDates} from './event';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import SegmentedControl from '@weco/common/views/components/SegmentedControl/SegmentedControl';
import PrimaryLink from '@weco/common/views/components/Links/PrimaryLink/PrimaryLink';
import SecondaryLink from '@weco/common/views/components/Links/SecondaryLink/SecondaryLink';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import EventsByMonth from '@weco/common/views/components/EventsByMonth/EventsByMonth';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import Icon from '@weco/common/views/components/Icon/Icon';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';
import type {UiExhibition} from '@weco/common/model/exhibitions';
import type {PaginatedResults} from '@weco/common/services/prismic/types';

type Props = {|
  exhibitions: PaginatedResults<UiExhibition>
|}

const Header = ({
  todayOpeningHours,
  activeId
}) => {
  return (
    <div className={classNames({
      'row': true,
      'bg-cream': true,
      [spacing({s: 3, m: 5, l: 5}, {padding: ['top', 'bottom']})]: true
    })}>
      <div className='container'>
        <div className='grid'>
          <div className={grid({s: 12, m: 12, l: 12, xl: 12})}>
            <div className='flex flex--v-center flex--h-space-between flex--wrap'>
              <div>
                <h1 className='inline h1'>What{`'`}s on</h1>
              </div>
              <div className='flex flex--v-center flex--wrap'>
                {todayOpeningHours &&
                  <div className='flex flex--v-center'>
                    <span className={classNames({
                      [font({s: 'HNM5', m: 'HNM4'})]: true,
                      [spacing({s: 2}, {margin: ['right']})]: true
                    })}>
                      Galleries
                      {todayOpeningHours.opens ? ' open ' : ' closed ' }
                      today
                    </span>
                    {todayOpeningHours.opens &&
                      <Fragment>
                        <Icon name={'clock'} extraClasses={'margin-right-s1'} />
                        <span className={classNames({
                          [font({s: 'HNL5', m: 'HNL4'})]: true,
                          [spacing({s: 2}, {margin: ['right']})]: true
                        })}>
                          <Fragment>
                            <time>{todayOpeningHours.opens}</time>
                            {'—'}
                            <time>{todayOpeningHours.closes}</time>
                          </Fragment>
                        </span>
                      </Fragment>
                    }
                  </div>
                }
                <SecondaryLink
                  url={'https://wellcomecollection.org/opening-times'}
                  text={'Full opening times'}
                />
              </div>
            </div>
          </div>
          <div className={classNames({
            [grid({s: 12, m: 10, l: 8, xl: 6})]: true,
            [spacing({s: 2}, { margin: ['top', 'bottom'] })]: true
          })}>
            <SegmentedControl
              id={'whatsOnFilter'}
              activeId={activeId}
              items={[{
                id: 'current-and-coming-up',
                url: '/whats-on',
                text: 'Everything'
              }, {
                id: 'today',
                url: '/whats-on/today',
                text: 'Today'
              }, {
                id: 'this-weekend',
                url: '/whats-on/this-weekend',
                text: 'This weekend'
              }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const pageDescription = 'Discover all of the exhibitions, events and more on offer at Wellcome Collection, the free museum and library for the incurably curious.';
export class ArticleSeriesPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const period = context.query.period || 'current-and-coming-up';
    const exhibitions = await getExhibitions(context.req, {period});
    const events = await getEvents(context.req, {period});
    if (period && events && exhibitions) {
      return {
        period,
        exhibitions,
        events,
        title: 'What\'s on',
        description: pageDescription,
        type: 'website',
        canonicalUrl: `https://wellcomecollection.org/whats-on`,
        imageUrl: null,
        siteSection: 'whatson',
        analyticsCategory: 'public-programme'
      };
    } else {
      return {statusCode: 404};
    }
  }

  render() {
    const {period} = this.props;
    const events = this.props.events.results.map(convertJsonToDates);
    const exhibitions = this.props.exhibitions.results.map(exhibition => {
      return {
        start: exhibition.start && new Date(exhibition.start),
        end: exhibition.end && new Date(exhibition.end),
        ...exhibition
      };
    });
    return (
      <Fragment>
        <Header />

        <div className={classNames({
          [spacing({s: 2, m: 4}, {margin: ['top']})]: true
        })}>
          {period === 'current-and-coming-up' &&
            <Fragment>
              <div className={classNames({
                [spacing({s: 3, m: 5, l: 5}, { margin: ['top'] })]: true,
                [spacing({s: 2}, { margin: ['bottom'] })]: true
              })}>
                <Layout12>
                  <div className={classNames({
                    [classNames({s: 0}, {margin: ['top', 'bottom']})]: true
                  })}>
                    {/* include './date_range.njk' */}
                    <div className='flex flex--v-center flex--h-space-between'>
                      <h2 className='h1'>Exhibitions</h2>
                      <span className={font({s: 'HNM5', m: 'HNM4'})}>Free admission</span>
                    </div>
                  </div>
                </Layout12>

                <CardGrid items={exhibitions} />
                <Layout12>
                  <div className={spacing({s: 3}, { margin: ['top'] })}>
                    <PrimaryLink
                      name={'View past exhibitions'}
                      url={'/exhibitions/past'} />
                  </div>
                </Layout12>

                <SectionHeader
                  title={'Events'}
                  linkText={'Free admission'}
                />
                <EventsByMonth events={events} />
                <Layout12>
                  <div className={spacing({s: 3}, { margin: ['top'] })}>
                    <PrimaryLink name={'View past events'} url={'/events/past'} />
                  </div>
                </Layout12>
              </div>
            </Fragment>
          }
          {period !== 'current-and-coming-up' &&
            <Fragment></Fragment>
          }
        </div>
      </Fragment>
    );
  }
};

export default PageWrapper(ArticleSeriesPage);
