// @flow
import BasePage from './BasePage';
import Body from '../Body/Body';
import PageHeader from '../PageHeader/PageHeader';
import HeaderBackground from '../HeaderBackground/HeaderBackground';
import HTMLDate from '../HTMLDate/HTMLDate';
import {UiImage} from '../Images/Images';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import type {Page as PageProps} from '../../../model/pages';

type Props = {|
  page: PageProps
|}

const backgroundTexture = 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';
const Page = ({ page }: Props): BasePage => {
  const DateInfo = page.datePublished && <HTMLDate date={page.datePublished} />;

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
    <BasePage
      id={page.id}
      Header={Header}
      Body={<Body body={body} />}>
    </BasePage>
  );
};

export default Page;
