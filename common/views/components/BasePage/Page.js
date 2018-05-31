// @flow
import BasePage from './BasePage';
import Body from '../Body/Body';
import BaseHeader from '../BaseHeader/BaseHeader';
import HTMLDate from '../HTMLDate/HTMLDate';
import {UiImage} from '../Images/Images';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import type {Page} from '../../../model/pages';

type Props = {|
  page: Page
|}

const InstallationPage = ({ page }: Props) => {
  const DateInfo = page.datePublished && <HTMLDate date={page.datePublished} />;

  const hasFeaturedMedia = page.body.length > 1 &&
    (page.body[0].type === 'picture' || page.body[0].type === 'videoEmbed');
  const body = hasFeaturedMedia ? page.body.slice(1, page.body.length) : page.body;
  const FeaturedMedia = hasFeaturedMedia
    ? page.body[0].type === 'picture' ? UiImage(page.body[0].value)
      : page.body[0].type === 'videoEmbed' ? VideoEmbed(page.body[0].value)
        : null : null;

  const Header = (<BaseHeader
    title={page.title}
    DateInfo={DateInfo}
    Background={null}
    TagBar={null}
    InfoBar={null}
    Description={null}
    FeaturedMedia={FeaturedMedia}
  />);

  return (
    <BasePage
      id={page.id}
      Header={Header}
      Body={<Body
        body={body} />}>
    </BasePage>
  );
};

export default InstallationPage;
