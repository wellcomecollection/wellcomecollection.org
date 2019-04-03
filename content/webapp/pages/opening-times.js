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
          <h1>Library closed dates</h1>
          <table>
            <tbody className="opening-hours__tbody">
              {parseVenueTimesToOpeningHours(
                page.body.find(
                  bodyPart =>
                    bodyPart.type === 'venueTimes' &&
                    bodyPart.value.data.title === 'Library'
                ).value
              ).openingHours.exceptional.map(day => (
                <tr key={day.overrideDate} className="opening-hours__tr">
                  <td className="opening-hours__td">
                    {day.overrideDate.format('dddd, MMMM Do')}
                  </td>
                  {day.opens ? (
                    <td className="opening-hours__td">
                      {day.opens}&mdash;{day.closes}
                    </td>
                  ) : (
                    <td className="opening-hours__td">Closed</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </ContentPage>
      </PageLayout>
    );
  }
}

export default OpeningTimesPage;
