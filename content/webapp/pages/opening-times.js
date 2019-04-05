// @flow
import type { Context } from 'next';
import { Component } from 'react';
import { formatDayDate } from '@weco/common/utils/format-date';
import { getPage } from '@weco/common/services/prismic/pages';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Body from '@weco/common/views/components/Body/Body';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { contentLd } from '@weco/common/utils/json-ld';
import type { Page } from '@weco/common/model/pages';
import {
  parseVenueTimesToOpeningHours,
  groupConsecutiveDays,
  getExceptionalClosedDays,
  backfillExceptionalVenueDays,
} from '@weco/common/services/prismic/opening-times';

type Props = {|
  page: Page,
|};

export class OpeningTimesPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const page = await getPage(ctx.req, 'WwQHTSAAANBfDYXU');

    return {
      page,
    };
  };
  render() {
    const { page } = this.props;
    const libraryVenue = page.body.find(
      bodyPart =>
        bodyPart.type === 'collectionVenue' &&
        bodyPart.value.data.title === 'Library'
    );

    const libraryVenueValue = libraryVenue && libraryVenue.value;
    const parsedLibraryVenue =
      libraryVenueValue && parseVenueTimesToOpeningHours(libraryVenueValue);
    const libraryExceptionalPeriods =
      parsedLibraryVenue && backfillExceptionalVenueDays(parsedLibraryVenue);
    const onlyClosedDays =
      libraryExceptionalPeriods &&
      getExceptionalClosedDays(libraryExceptionalPeriods);
    const groupedConsectiveClosedDays =
      onlyClosedDays && groupConsecutiveDays(onlyClosedDays);
    // TODO need to get this years times into prismic

    // TODO upcoming only
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
          {groupedConsectiveClosedDays &&
            groupedConsectiveClosedDays.length > 0 && (
              <>
                {/* TODO date range component
              TODO problem if days in between aren't closed...
              */}
                The library is closed
                {groupedConsectiveClosedDays.map((closedGroup, i) => (
                  <p key={i}>
                    {`${formatDayDate(
                      closedGroup[0].overrideDate.toDate()
                    )}-${formatDayDate(
                      closedGroup[closedGroup.length - 1].overrideDate.toDate()
                    )}
                    `}
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
