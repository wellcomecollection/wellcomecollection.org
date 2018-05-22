// @flow
import BasicPage from './BasicPage';
import HTMLDate from '../../HTMLDate/HTMLDate';
import {UiImage} from '../../Images/Images';
import VideoEmbed from '../../VideoEmbed/VideoEmbed';
import type {Page} from '../../../../model/pages';

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

  return (
    <BasicPage
      id={page.id}
      DateInfo={DateInfo}
      Background={null}
      TagBar={null}
      InfoBar={null}
      Description={null}
      FeaturedMedia={FeaturedMedia}
      title={page.title}
      body={body}>
    </BasicPage>
  );
};

export default InstallationPage;
