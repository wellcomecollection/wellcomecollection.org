// @flow
import type { Context } from 'next';
import { Component, useContext } from 'react';
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
  groupConsecutiveDays,
  getExceptionalClosedDays,
  backfillExceptionalVenueDays,
  getExceptionalOpeningPeriods,
} from '@weco/common/services/prismic/opening-times';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';

type Props = {|
  page: Page,
|};

const LibraryClosed = ({ page }) => {
  const openingTimes = useContext(OpeningTimesContext);
  const exceptionalPeriods = getExceptionalOpeningPeriods(openingTimes);

  const libraryVenue = openingTimes.collectionOpeningTimes.placesOpeningHours.find(
    venue => venue.name.toLowerCase() === 'library'
  );
  const libraryExceptionalPeriods =
    libraryVenue &&
    backfillExceptionalVenueDays(libraryVenue, exceptionalPeriods);
  const onlyClosedDays =
    libraryExceptionalPeriods &&
    getExceptionalClosedDays(libraryExceptionalPeriods);
  const groupedConsectiveClosedDays =
    onlyClosedDays && groupConsecutiveDays(onlyClosedDays);

  return groupedConsectiveClosedDays
    ? groupedConsectiveClosedDays.length > 0 && (
        <div className="body-text">
          <h2>Library closures</h2>
          <p className="no-margin">
            The library will be closed on the following dates:
          </p>
          <ul>
            {/* TODO date range component */}
            {groupedConsectiveClosedDays.map((closedGroup, i) => (
              <li key={i}>
                {formatDayDate(closedGroup[0].overrideDate.toDate())}
                {closedGroup.length > 1 && (
                  <>
                    &mdash;
                    {formatDayDate(
                      closedGroup[closedGroup.length - 1].overrideDate.toDate()
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )
    : null;
};

export class OpeningTimesPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const page = await getPage(ctx.req, 'WwQHTSAAANBfDYXU');

    return {
      page,
    };
  };
  render() {
    const { page } = this.props;
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
          Body={<Body body={page.body} pageId={'openingTimes'} />}
        >
          <LibraryClosed page={page} />
        </ContentPage>
      </PageLayout>
    );
  }
}

export default OpeningTimesPage;
