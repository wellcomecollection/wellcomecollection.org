// @flow
import type { Context } from 'next';
import { Component } from 'react';
import { getPage } from '@weco/common/services/prismic/pages';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Body from '@weco/common/views/components/Body/Body';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { contentLd } from '@weco/common/utils/json-ld';
import type { Page } from '@weco/common/model/pages';
import { parseVenueTimesToOpeningHours } from '@weco/common/services/prismic/opening-times';

type Props = {|
  page: Page,
|};

export class OpeningTimesPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    // TODO: (Prismic perf) don't fetch these as two separate calls
    const page = await getPage(ctx.req, 'WwQHTSAAANBfDYXU');

    return {
      page,
    };
  };
  render() {
    const { page } = this.props;
    const libraryVenue = page.body.find(
      bodyPart =>
        bodyPart.type === 'venueTimes' &&
        bodyPart.value.data.title === 'Library'
    );
    const libraryVenueValue = libraryVenue && libraryVenue.value;
    const exceptionalLibraryDates =
      libraryVenueValue &&
      parseVenueTimesToOpeningHours(libraryVenueValue).openingHours.exceptional;
    const libraryClosedDates = exceptionalLibraryDates.filter(
      date => date.opens === null
    );
    // TODO order first
    const libraryClosedPeriods = libraryClosedDates.reduce(
      (acc, date) => {
        const group = acc[acc.length - 1];
        if (
          date.overrideDate.diff(
            (group[group.length - 1] && group[group.length - 1].overrideDate) ||
              date.overrideDate,
            'days'
          ) > 1
        ) {
          acc.push([date]);
        } else {
          group.push(date);
        }
        return acc;
      },
      [[]]
    ); // TODO upcoming only
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
          {libraryClosedPeriods && (
            <>
              <h1>Library closures</h1>
              {libraryClosedPeriods.map((period, i) => (
                <p key={i} className="no-margin">
                  {period[0].overrideDate.format('dddd, MMMM Do YYYY')}
                  {period.length > 1 &&
                    `—${period[period.length - 1].overrideDate.format(
                      'dddd, MMMM Do YYYY'
                    )}`}
                </p>
              ))}
            </>
          )}
        </ContentPage>
      </PageLayout>
    );
  }
}

export default OpeningTimesPage;
