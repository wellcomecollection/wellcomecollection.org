// @flow
import {Component} from 'react';
import {getInstallation} from '@weco/common/services/prismic/installations';
import {exhibitionLd} from '@weco/common/utils/json-ld';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import PageWrapper from '@weco/common/views/components/PageWrapper/PageWrapper';
import DateAndStatusIndicator from '@weco/common/views/components/DateAndStatusIndicator/DateAndStatusIndicator';
import HeaderBackground from '@weco/common/views/components/BaseHeader/HeaderBackground';
import BasePage from '@weco/common/views/components/BasePage/BasePage';
import Body from '@weco/common/views/components/Body/Body';
import {
  default as PageHeader,
  getFeaturedMedia
} from '@weco/common/views/components/PageHeader/PageHeader';
import type {Installation} from '@weco/common/model/installations';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';

type Props = {|
  installation: Installation
|}

class InstallationPage extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {id} = context.query;
    const installation = await getInstallation(context.req, id);

    if (installation) {
      return {
        installation,
        title: installation.title,
        description: installation.promoText,
        type: 'installation',
        canonicalUrl: `https://wellcomecollection.org/installations/${installation.id}`,
        imageUrl: installation.image && convertImageUri(installation.image.contentUrl, 800),
        siteSection: 'whatson',
        category: 'public-programme',
        pageJsonLd: exhibitionLd(installation)
      };
    } else {
      return {statusCode: 404};
    }
  }

  render() {
    const {installation} = this.props;
    const FeaturedMedia = getFeaturedMedia({
      id: installation.id,
      title: installation.title,
      contributors: installation.contributors,
      contributorsTitle: installation.contributorsTitle,
      promo: installation.promo,
      body: installation.body,
      standfirst: installation.standfirst,
      promoImage: installation.promoImage,
      promoText: installation.promoText,
      image: installation.image,
      squareImage: installation.squareImage,
      widescreenImage: installation.widescreenImage,
      labels: installation.labels
    });
    const breadcrumbs = {
      items: [
        {
          text: 'Installations'
        },
        {
          url: `/installations/${installation.id}`,
          text: installation.title,
          isHidden: true
        }
      ]
    };
    const Header = <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{labels: installation.labels}}
      title={installation.title}
      FeaturedMedia={FeaturedMedia}
      Background={<HeaderBackground hasWobblyEdge={true} />}
      ContentTypeInfo={
        <DateAndStatusIndicator
          start={installation.start}
          end={installation.end} />
      }
      HeroPicture={null}
    />;
    return (
      <BasePage
        id={installation.id}
        Header={Header}
        Body={<Body body={installation.body} />}
        contributorProps={{ contributors: installation.contributors }}
      >
      </BasePage>
    );
  }
}

export default PageWrapper(InstallationPage);
