// @flow
import type { Context } from 'next';
import { Component } from 'react';
import { getPlace } from '@weco/common/services/prismic/places';
// $FlowFixMe (tsx)
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
// $FlowFixMe (tsx)
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
// $FlowFixMe(tsx)
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import { UiImage } from '@weco/common/views/components/Images/Images';
// $FlowFixMe (tsx)
import Body from '@weco/common/views/components/Body/Body';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import type { Place } from '@weco/common/model/places';
// $FlowFixMe
import { getGlobalContextData } from '@weco/common/views/components/GlobalContextProvider/GlobalContextProvider';

type Props = {|
  place: Place,
  globalContextData: any,
|};

export class PlacePage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const globalContextData = getGlobalContextData(ctx);
    const { id, memoizedPrismic } = ctx.query;
    const place = await getPlace(ctx.req, id, memoizedPrismic);

    if (place) {
      return {
        place,
        globalContextData,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const { globalContextData, place } = this.props;
    const image = place.promo && place.promo.image;
    const tasl = image && {
      isFull: false,
      contentUrl: image.contentUrl,
      title: image.title,
      author: image.author,
      sourceName: image.source && image.source.name,
      sourceLink: image.source && image.source.link,
      license: image.license,
      copyrightHolder: image.copyright && image.copyright.holder,
      copyrightLink: image.copyright && image.copyright.link,
    };
    /* https://github.com/facebook/flow/issues/2405 */
    /* $FlowFixMe */
    const FeaturedMedia = place.promo && <UiImage tasl={tasl} {...image} />;
    const breadcrumbs = {
      items: [
        {
          text: 'Places',
        },
        {
          url: `/places/${place.id}`,
          text: place.title,
          isHidden: true,
        },
      ],
    };
    const Header = (
      <PageHeader
        breadcrumbs={breadcrumbs}
        labels={null}
        title={place.title}
        FeaturedMedia={FeaturedMedia}
        Background={<HeaderBackground hasWobblyEdge={true} />}
        ContentTypeInfo={null}
        HeroPicture={null}
      />
    );

    return (
      <PageLayout
        title={place.title}
        description={place.metadataDescription || place.promoText || ''}
        url={{ pathname: `/places/${place.id}` }}
        jsonLd={{ '@type': 'WebPage' }}
        openGraphType={'website'}
        siteSection={'visit-us'}
        imageUrl={place.image && convertImageUri(place.image.contentUrl, 800)}
        imageAltText={place.image && place.image.alt}
        globalContextData={globalContextData}
      >
        <ContentPage
          id={place.id}
          Header={Header}
          Body={<Body body={place.body} pageId={place.id} />}
        />
      </PageLayout>
    );
  }
}

export default PlacePage;
