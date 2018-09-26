// @flow
import {Component} from 'react';
import {getPlace} from '@weco/common/services/prismic/places';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import HeaderBackground from '@weco/common/views/components/BaseHeader/HeaderBackground';
import {UiImage} from '@weco/common/views/components/Images/Images';
import Body from '@weco/common/views/components/Body/Body';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import type {Place} from '@weco/common/model/places';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';

type Props = {|
  place: Place
|}

export class ArticleSeriesPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {id} = context.query;
    const place = await getPlace(context.req, id);

    if (place) {
      return {
        place,
        title: place.title,
        description: place.promoText,
        type: 'website',
        canonicalUrl: `https://wellcomecollection.org/places/${place.id}`,
        imageUrl: place.image && convertImageUri(place.image.contentUrl, 800),
        siteSection: 'places',
        analyticsCategory: 'editorial'
      };
    } else {
      return {statusCode: 404};
    }
  }

  render() {
    const {place} = this.props;
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
      copyrightLink: image.copyright && image.copyright.link
    };
    /* https://github.com/facebook/flow/issues/2405 */
    /* $FlowFixMe */
    const FeaturedMedia = place.promo && <UiImage tasl={tasl} {...image} />;
    const breadcrumbs = {
      items: [{
        text: 'Places'
      }]
    };
    const Header = (<PageHeader
      breadcrumbs={breadcrumbs}
      labels={null}
      title={place.title}
      FeaturedMedia={FeaturedMedia}
      Background={<HeaderBackground hasWobblyEdge={true} />}
      ContentTypeInfo={null}
      HeroPicture={null}
    />);

    return (
      <BasePage
        id={place.id}
        Header={Header}
        Body={<Body body={place.body} />}
      >
      </BasePage>
    );
  }
};

export default PageWrapper(ArticleSeriesPage);
