// @flow
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import HeaderBackground from '../BaseHeader/HeaderBackground';
import {UiImage} from '../Images/Images';
import type {Place} from '../../../model/places';

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
    Background={<HeaderBackground hasWobblyEdge={true} />}
    Breadcrumb={<Breadcrumb items={[{
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
