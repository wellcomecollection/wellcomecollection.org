// @flow
import {Component, Fragment} from 'react';
import {getCollectionOpeningTimes} from '@weco/common/services/prismic/opening-times';
import {getPage} from '@weco/common/services/prismic/pages';
import {classNames, spacing, grid, font} from '@weco/common/utils/classnames';
import {formatDay, formatDate, formatYear, formatDayMonth} from '@weco/common/utils/format-date';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Body from '@weco/common/views/components/Body/Body';
import Divider from '@weco/common/views/components/Divider/Divider';
import OpeningHours from '@weco/common/views/components/OpeningHours/OpeningHours';
import ExceptionalOpeningHoursTable from '@weco/common/views/components/ExceptionalOpeningHoursTable/ExceptionalOpeningHoursTable';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {contentLd} from '@weco/common/utils/json-ld';
import type {Page} from '@weco/common/model/pages';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';

type Props = {|
  page: Page,
  openingHours: any // FIXME: Need the types from the opening-times service
|}

export class OpeningTimesPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    // TODO: (Prismic perf) don't fetch these as two separate calls
    const [openingHours, page] = await Promise.all([
      getCollectionOpeningTimes(context.req),
      getPage(context.req, 'WwQHTSAAANBfDYXU')
    ]);
    const galleriesLibrary = openingHours && openingHours.placesOpeningHours && openingHours.placesOpeningHours.filter(venue => {
      return venue.name.toLowerCase() === 'galleries' || venue.name.toLowerCase() === 'library';
    });
    const restaurantCafeShop = openingHours && openingHours.placesOpeningHours && openingHours.placesOpeningHours.filter(venue => {
      return venue.name.toLowerCase() === 'restaurant' || venue.name.toLowerCase() === 'café' || venue.name.toLowerCase() === 'shop';
    });
    const groupedVenues = {
      galleriesLibrary: {
        title: 'Venue',
        hours: galleriesLibrary
      },
      restaurantCafeShop: {
        title: 'Eat & Shop',
        hours: restaurantCafeShop
      }
    };

    return {
      title: page && page.title || '',
      description: page && page.promo && page.promo.caption || '',
      type: 'website',
      canonicalUrl: `https://wellcomecollection.org/opening-times`,
      imageUrl: page && page.promo && page.promo.image && convertImageUri(page.promo.image.contentUrl, 800),
      siteSection: 'visit-us',
      analyticsCategory: 'information',
      pageJsonLd: contentLd(page),
      openingHours: Object.assign({}, openingHours, {groupedVenues}),
      page
    };
  }
  render() {
    const {page, openingHours} = this.props;
    return (
      <ContentPage
        id={'openingTimes'}
        Header={
          <PageHeader
            breadcrumbs={{ items: [{url: '/', text: 'Home'}] }}
            labels={null}
            title={'Opening times'}
            ContentTypeInfo={null}
            Background={null}
            backgroundTexture={'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg'}
            FeaturedMedia={null}
            HeroPicture={null}
            highlightHeading={true} />
        }
        Body={<Body body={[]} />}
      >

        <h2 className={classNames({
          [font({s: 'WB6', m: 'WB5'})]: true,
          'no-margin': true
        })} id='regular'>Regular opening times</h2>

        <OpeningHours
          extraClasses='opening-hours--light'
          upcomingExceptionalOpeningPeriods={openingHours.upcomingExceptionalOpeningPeriods}
          groupedVenues={openingHours.groupedVenues} />

        <Divider
          extraClasses={classNames({
            'divider--pumice': true,
            'divider--keyline': true,
            [spacing({s: 1}, {margin: ['top']})]: true,
            [spacing({s: 4}, {margin: ['bottom']})]: true
          })} />

        {openingHours.upcomingExceptionalOpeningPeriods && openingHours.upcomingExceptionalOpeningPeriods.length > 0 &&
            openingHours.upcomingExceptionalOpeningPeriods.map((openingPeriod, i, arr) => {
              const hours = openingHours.exceptionalOpeningHours[i - 1];
              const firstDate = formatDate(openingPeriod.dates[0]);
              const lastDate = formatDate(openingPeriod.dates[openingPeriod.dates.length - 1]);
              return (
                <Fragment key={openingPeriod.type}>
                  <h2
                    id={i === 1 ? 'exceptional' : null}
                    className={classNames({
                      [grid({s: 12, m: 12, l: 12, xl: 12})]: true,
                      [font({s: 'WB6', m: 'WB5'})]: true,
                      'no-margin': true
                    })}>
                    {openingPeriod.type && openingPeriod.type === 'Late Spectacular' &&
                        `${formatDay(openingPeriod.dates[0])} Late Spectacular opening times`
                    }
                    {openingPeriod.type && openingPeriod.type !== 'other' &&
                        `${openingPeriod.type} opening times`
                    }
                    {(!openingPeriod.type || openingPeriod.type === 'other') && 'Revised opening times'}
                  </h2>
                  <p className={classNames({
                    [font({s: 'HNM4'})]: true,
                    [grid({s: 12, m: 12, l: 12, xl: 12})]: true,
                    [spacing({s: 2}, {padding: ['top']})]: true
                  })}>
                    Our opening times will change
                    {openingPeriod.dates.length > 1 &&
                      <Fragment>
                        {openingHours.upcomingExceptionalOpeningPeriods.length > 1 && i > 1 ? ' and ' : ' '}
                        between <span className='nowrap'>{firstDate}</span>&mdash;<span clasNames='nowrap'>{lastDate}</span>
                        {i === arr.length - 1 ? '.' : ''}
                      </Fragment>
                    }

                    {openingPeriod.dates.length <= 1 &&
                      <Fragment>
                        on <span style='whiteSpace: nowrap'>{firstDate}</span>
                        {i === arr.length - 1 ? '.' : ''}
                      </Fragment>
                    }
                  </p>
                  {hours.dates.map((venues, i) =>

                    <ExceptionalOpeningHoursTable key={i}
                      caption={venues[0].exceptionalDate.overrideDate}
                      venues={venues}
                      extraClasses={'opening-hours--light'} />

                  )}

                  <Divider
                    extraClasses={classNames({
                      'divider--pumice': true,
                      'divider--keyline': true,
                      [spacing({s: 1}, {margin: ['top']})]: true,
                      [spacing({s: 4}, {margin: ['bottom']})]: true
                    })} />

                </Fragment>
              );
            })
        }
        {openingHours.exceptionalClosedDates.length > 0 &&
            <Fragment>
              <h2 className={`${font({s: 'WB6', m: 'WB5'})} no-margin`} id='exceptional'>
                  Closure dates for{' '}
                {openingHours.exceptionalClosedDates[0].periodStart ? formatYear(openingHours.exceptionalClosedDates[0].periodStart) : ' the coming year'}
              </h2>
              {openingHours.exceptionalClosedDates.map(period => {
                return (
                  <div key={period.periodStart} className={spacing({s: 6}, {margin: ['bottom']})}>
                    <h3 className={font({s: 'WB7', m: 'WB6'})}>
                      {period.periodStart !== period.periodEnd &&
                          <Fragment>{formatDate(period.periodStart)}&mdash;{formatDate(period.periodEnd)}</Fragment>
                      }
                      {period.periodStart === period.periodEnd &&
                          <Fragment>{formatDate(period.periodStart)}</Fragment>
                      }
                    </h3>
                    {Object.keys(period.venues).map(venue => {
                      const modified = period.venues[venue];
                      return (
                        <p key={venue} className={spacing({s: 1}, {margin: ['bottom']})}>
                          {venue} will be closed on{' '}
                          {modified.map((item, i) => {
                            return (
                              <Fragment key={i}>
                                {modified.length > 2 && (i >= 1 && i < modified.length - 1) && ', '}
                                {modified.length >= 2 && i === modified.length - 1 && ' and '}
                                {
                                  item.exceptionalDate.overrideDate &&
                                    formatDayMonth(item.exceptionalDate.overrideDate)
                                }
                                {
                                  !item.exceptionalDate.overrideDate &&
                                    formatDayMonth(item.exceptionalDate)
                                }
                              </Fragment>
                            );
                          })}
                        </p>
                      );
                    })}
                  </div>
                );
              })}
              <Divider
                extraClasses={classNames({
                  'divider--pumice': true,
                  'divider--keyline': true,
                  [spacing({s: 1}, {margin: ['top']})]: true,
                  [spacing({s: 4}, {margin: ['bottom']})]: true
                })} />
            </Fragment>
        }
        <div id='busy' className={`body-text`}>
          {page.body.length > 0 && <PrismicHtmlBlock html={page.body[0].value} />}
        </div>

      </ContentPage>
    );
  }
}

export default PageWrapper(OpeningTimesPage);
