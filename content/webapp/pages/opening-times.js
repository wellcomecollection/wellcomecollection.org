// @flow
import type { Context } from 'next';
import { Component } from 'react';
import { getPage } from '@weco/common/services/prismic/pages';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Body from '@weco/common/views/components/Body/Body';
import CompactCard from '@weco/common/views/components/CompactCard/CompactCard';
import ImagePlaceholder from '@weco/common/views/components/ImagePlaceholder/ImagePlaceholder';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { contentLd } from '@weco/common/utils/json-ld';
import type { Page } from '@weco/common/model/pages';

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
              breadcrumbs={{
                items: [
                  {
                    url: '/visit-us',
                    text: 'Visit us',
                  },
                ],
              }}
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
          <div className="body-text">
            <h2 className="h2" id="planning">
              Planning your visit in advance
            </h2>
            <p>
              Visiting on a{' '}
              <a href="https://www.gov.uk/bank-holidays">bank holiday</a> or
              during Christmas break? Our galleries, café, restaurant and shop
              will be open with adjusted hours.
            </p>
            <p>
              The building is always closed on 24-26 December and 1 January.
            </p>
          </div>
          <CompactCard
            url="/pages/XKNANBAAAAFWc2h-"
            title="Entry at busy times"
            labels={{ labels: [] }}
            description="Our temporary exhibitions can become crowded at times, so to keep the galleries safe and comfortable, we may manage numbers with queuing or timed tickets."
            urlOverride={null}
            partNumber={null}
            color={null}
            Image={<ImagePlaceholder color={`turquoise`} />}
            DateInfo={null}
            StatusIndicator={null}
          />
        </ContentPage>
      </PageLayout>
    );
  }
}

export default OpeningTimesPage;
