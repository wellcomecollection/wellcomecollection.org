// @flow
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import Tags from '../Tags/Tags';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import {UiImage} from '../Images/Images';
import type {Place} from '../../../model/place';

type Props = {|
  place: Place
|}

const PlacePage = ({ place }: Props) => {
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
  const Header = (<BaseHeader
    title={place.title}
    Background={<WobblyBackground />}
    TagBar={<Tags tags={[{
      text: 'Places'
    }]} />}
    DateInfo={null}
    InfoBar={null}
    Description={null}
    FeaturedMedia={FeaturedMedia}
    LabelBar={null}
    isFree={false}
  />);

  return (
    <BasePage
      id={place.id}
      Header={Header}
      Body={<Body body={place.body} />}
    >
    </BasePage>
  );
};

export default PlacePage;
