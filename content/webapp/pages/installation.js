// @flow
import type {Context} from 'next';
import {Component} from 'react';
import {getInstallation} from '@weco/common/services/prismic/installations';
import {exhibitionLd} from '@weco/common/utils/json-ld';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import DateAndStatusIndicator from '@weco/common/views/components/DateAndStatusIndicator/DateAndStatusIndicator';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import Body from '@weco/common/views/components/Body/Body';
import {
  default as PageHeader,
  getFeaturedMedia
} from '@weco/common/views/components/PageHeader/PageHeader';
import type {Installation} from '@weco/common/model/installations';

type Props = {|
  installation: Installation
|}

class InstallationPage extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const {id} = ctx.query;
    const installation = await getInstallation(ctx.req, id);

    if (installation) {
      return {
        installation
      };
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
      labels: installation.labels,
      metadataDescription: installation.metadataDescription
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
      <PageLayout
        title={installation.title}
        description={installation.metadataDescription || installation.promoText || ''}
        url={{pathname: `/installations/${installation.id}`}}
        jsonLd={exhibitionLd(installation)}
        openGraphType={'website'}
        siteSection={'whats-on'}
        imageUrl={installation.image && convertImageUri(installation.image.contentUrl, 800)}
        imageAltText={installation.image && installation.image.alt}>
        <ContentPage
          id={installation.id}
          Header={Header}
          Body={<Body body={installation.body} />}
          contributorProps={{ contributors: installation.contributors }}
        >
        </ContentPage>
      </PageLayout>
    );
  }
}

export default InstallationPage;
