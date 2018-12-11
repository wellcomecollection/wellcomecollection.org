// @flow
import {Component} from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import Body from '@weco/common/views/components/Body/Body';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import {UiImage} from '@weco/common/views/components/Images/Images';
import {convertImageUri} from '@weco/common/utils/convert-image-uri';
import {getPage} from '@weco/common/services/prismic/pages';
import {contentLd} from '@weco/common/utils/json-ld';
import type {Page as PageType} from '@weco/common/model/pages';
import type {GetInitialPropsProps} from '@weco/common/views/components/PageWrapper/PageWrapper';

type Props = {|
  page: PageType
|}

const backgroundTexture = 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';
export class Page extends Component<Props> {
  static getInitialProps = async (context: GetInitialPropsProps) => {
    const {id} = context.query;
    const page = await getPage(context.req, id);

    if (page) {
      return {
        page
      };
    }
  }

  render() {
    const {page} = this.props;
    const DateInfo = page.datePublished && <HTMLDate date={new Date(page.datePublished)} />;

    const hasFeaturedMedia = page.body.length > 1 &&
    (page.body[0].type === 'picture' || page.body[0].type === 'videoEmbed');
    const body = hasFeaturedMedia ? page.body.slice(1, page.body.length) : page.body;
    const FeaturedMedia = hasFeaturedMedia
      ? page.body[0].type === 'picture' ? <UiImage {...page.body[0].value.image} />
        : page.body[0].type === 'videoEmbed' ? <VideoEmbed {...page.body[0].value} />
          : null : null;

    // TODO: This is not the way to do site sections
    const breadcrumbs = {
      items: page.siteSection ? [{
        text: page.siteSection === 'visit-us' ? 'Visit us' : 'What we do',
        url: `/${page.siteSection}`
      }] : [{
        url: '/',
        text: 'Home'
      }]
    };
    const Header = (<PageHeader
      breadcrumbs={breadcrumbs}
      labels={null}
      title={page.title}
      FeaturedMedia={FeaturedMedia}
      Background={FeaturedMedia && <HeaderBackground backgroundTexture={backgroundTexture} />}
      ContentTypeInfo={DateInfo}
      HeroPicture={null}
      backgroundTexture={!FeaturedMedia ? backgroundTexture : null}
      highlightHeading={true}
    />);
    return (
      <PageLayout
        title={page.title}
        description={page.metadataDescription || page.promoText || ''}
        url={{pathname: `/pages/${page.id}`}}
        jsonLd={contentLd(page)}
        openGraphType={'website'}
        siteSection={page.siteSection === 'what-we-do' || page.siteSection === 'visit-us' ? page.siteSection : null}
        imageUrl={page.image && convertImageUri(page.image.contentUrl, 800)}
        imageAltText={page.image && page.image.alt}>
        <ContentPage
          id={page.id}
          Header={Header}
          Body={<Body body={body} />}>
        </ContentPage>
      </PageLayout>
    );
  }
};

export default Page;
