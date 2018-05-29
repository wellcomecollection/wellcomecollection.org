// @flow
import BasePage from './BasePage';
import HTMLDate from '../HTMLDate/HTMLDate';
import {UiImage} from '../Images/Images';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import type {Page as PageProps} from '../../../model/pages';

type Props = {|
  page: PageProps
|}

const Page = ({ page }: Props): BasePage => {
  const DateInfo = page.datePublished && <HTMLDate date={page.datePublished} />;
  console.info(page.body);

  const hasFeaturedMedia = page.body.length > 1 &&
    (page.body[0].type === 'picture' || page.body[0].type === 'videoEmbed');
  const body = hasFeaturedMedia ? page.body.slice(1, page.body.length) : page.body;
  const FeaturedMedia = hasFeaturedMedia
    ? page.body[0].type === 'picture' ? UiImage(page.body[0].value.image)
      : page.body[0].type === 'videoEmbed' ? VideoEmbed(page.body[0].value)
        : null : null;

  return (
    <BasePage
      id={page.id}
      DateInfo={DateInfo}
      Background={null}
      TagBar={null}
      InfoBar={null}
      Description={null}
      FeaturedMedia={FeaturedMedia}
      title={page.title}
      body={body}>
    </BasePage>
  );
};

export default Page;
