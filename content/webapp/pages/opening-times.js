// @flow
import type { Context } from 'next';
import { Component, Fragment } from 'react';
import { getCollectionOpeningTimes } from '@weco/common/services/prismic/opening-times';
import { getPage } from '@weco/common/services/prismic/pages';
import { classNames, spacing, font } from '@weco/common/utils/classnames';
import { formatDay, formatDate } from '@weco/common/utils/format-date';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Body from '@weco/common/views/components/Body/Body';
import Divider from '@weco/common/views/components/Divider/Divider';
import OpeningHours from '@weco/common/views/components/OpeningHours/OpeningHours';
import ExceptionalOpeningHoursTable from '@weco/common/views/components/ExceptionalOpeningHoursTable/ExceptionalOpeningHoursTable';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { contentLd } from '@weco/common/utils/json-ld';
import type { Page } from '@weco/common/model/pages';

type Props = {|
  page: Page,
  openingHours: any, // FIXME: Need the types from the opening-times service
|};

export class OpeningTimesPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    // TODO: (Prismic perf) don't fetch these as two separate calls
    const revisedDisplayPeriod = 15;
    const [openingHours, page] = await Promise.all([
      getCollectionOpeningTimes(ctx.req, revisedDisplayPeriod),
      getPage(ctx.req, 'WwQHTSAAANBfDYXU'),
    ]);
    const galleriesLibrary =
      openingHours &&
      openingHours.placesOpeningHours &&
      openingHours.placesOpeningHours.filter(venue => {
        return (
          venue.name.toLowerCase() === 'galleries' ||
          venue.name.toLowerCase() === 'library'
        );
      });
    const restaurantCafeShop =
      openingHours &&
      openingHours.placesOpeningHours &&
      openingHours.placesOpeningHours.filter(venue => {
        return (
          venue.name.toLowerCase() === 'restaurant' ||
          venue.name.toLowerCase() === 'café' ||
          venue.name.toLowerCase() === 'shop'
        );
      });
    const groupedVenues = {
      galleriesLibrary: {
        title: 'Venue',
        hours: galleriesLibrary,
      },
      restaurantCafeShop: {
        title: 'Eat & Shop',
        hours: restaurantCafeShop,
      },
    };

    return {
      page,
      openingHours: Object.assign({}, openingHours, { groupedVenues }),
    };
  };
  render() {
    const { page, openingHours } = this.props;
    return (
      <PageLayout
        title={page && page.title}
        description={page.promoText || ''}
        url={{ pathname: `/opening-times` }}
        jsonLd={contentLd(page)}
        siteSection={'visit-us'}
        openGraphType={'website'}
        imageUrl={
          page &&
          page.promoImage &&
          convertImageUri(page.promoImage.contentUrl, 800)
        }
        imageAltText={page && page.promoImage && page.promoImage.alt}
      >
        <ContentPage
          id={'openingTimes'}
          Header={
            <PageHeader
              breadcrumbs={{ items: [{ url: '/', text: 'Home' }] }}
              labels={null}
              title={'Opening times'}
              ContentTypeInfo={null}
              Background={null}
              backgroundTexture={
                'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg'
              }
              FeaturedMedia={null}
              HeroPicture={null}
              highlightHeading={true}
            />
          }
          Body={<Body body={page.body} />}
        >
          <Fragment>
            <Fragment>
              <div className="spacing-component">
                <div className="body-text font-HNM4-s font-HNM3-m">
                  <p>
                    Explore our opening hours across the different parts of our
                    building. Keep in mind we&apos;re open late on Thursdays!
                    {openingHours.upcomingExceptionalOpeningPeriods &&
                      openingHours.upcomingExceptionalOpeningPeriods.length >
                        0 && (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: ` We also have <a href='#exceptional'>revised opening hours over the festive holidays</a>.`,
                          }}
                        />
                      )}
                  </p>
                </div>
              </div>
              <h2
                className={classNames({
                  [font({ s: 'WB6', m: 'WB5' })]: true,
                })}
                id="regular"
              >
                Regular opening times
              </h2>

              <div
                className={classNames({
                  [spacing({ s: 4 }, { margin: ['top'] })]: true,
                })}
              >
                <OpeningHours
                  extraClasses="opening-hours--light"
                  upcomingExceptionalOpeningPeriods={null}
                  groupedVenues={openingHours.groupedVenues}
                />
              </div>
              <Divider
                extraClasses={classNames({
                  'divider--pumice': true,
                  'divider--keyline': true,
                  [spacing({ s: 1 }, { margin: ['top'] })]: true,
                  [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
                })}
              />

              {openingHours.upcomingExceptionalOpeningPeriods &&
                openingHours.upcomingExceptionalOpeningPeriods.length > 0 &&
                openingHours.upcomingExceptionalOpeningPeriods.map(
                  (openingPeriod, i, arr) => {
                    const hours = openingHours.exceptionalOpeningHours[i];
                    const firstDate = formatDate(openingPeriod.dates[0]);
                    const lastDate = formatDate(
                      openingPeriod.dates[openingPeriod.dates.length - 1]
                    );
                    return (
                      <Fragment key={openingPeriod.type}>
                        <h2
                          id="exceptional"
                          className={classNames({
                            [font({ s: 'WB6', m: 'WB5' })]: true,
                            'no-margin': true,
                          })}
                        >
                          {openingPeriod.type &&
                            openingPeriod.type === 'Late Spectacular' &&
                            `${formatDay(
                              openingPeriod.dates[0]
                            )} Late Spectacular opening times`}
                          {openingPeriod.type &&
                            openingPeriod.type !== 'other' &&
                            `${openingPeriod.type} opening times`}
                          {(!openingPeriod.type ||
                            openingPeriod.type === 'other') &&
                            'Revised opening times'}
                        </h2>
                        <p
                          className={classNames({
                            [font({ s: 'HNM4' })]: true,
                            [spacing({ s: 2 }, { padding: ['top'] })]: true,
                          })}
                        >
                          Our opening times will change
                          {openingPeriod.dates.length > 1 && (
                            <Fragment>
                              {openingHours.upcomingExceptionalOpeningPeriods
                                .length > 1 && i > 1
                                ? ' and '
                                : ' '}
                              between{' '}
                              <span className="nowrap">{firstDate}</span>&mdash;
                              <span classnames="nowrap">{lastDate}</span>
                              {i === arr.length - 1 ? '.' : ''}
                            </Fragment>
                          )}
                          {openingPeriod.dates.length <= 1 && (
                            <Fragment>
                              on{' '}
                              <span style="whiteSpace: nowrap">
                                {firstDate}
                              </span>
                              {i === arr.length - 1 ? '.' : ''}
                            </Fragment>
                          )}
                        </p>

                        {hours &&
                          hours.dates.map((venues, i) => (
                            <ExceptionalOpeningHoursTable
                              key={i}
                              caption={
                                venues[0].exceptionalDate.overrideDate
                                  ? venues[0].exceptionalDate.overrideDate
                                  : venues[0].exceptionalDate
                              }
                              venues={venues.sort((a, b) => a.order - b.order)}
                              extraClasses={'opening-hours--light'}
                            />
                          ))}

                        <Divider
                          extraClasses={classNames({
                            'divider--pumice': true,
                            'divider--keyline': true,
                            [spacing({ s: 1 }, { margin: ['top'] })]: true,
                            [spacing({ s: 4 }, { margin: ['bottom'] })]: true,
                          })}
                        />
                      </Fragment>
                    );
                  }
                )}
            </Fragment>
          </Fragment>
        </ContentPage>
      </PageLayout>
    );
  }
}

export default OpeningTimesPage;
