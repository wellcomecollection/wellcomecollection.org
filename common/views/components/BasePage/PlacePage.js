// @flow
import BasePage from './BasePage';
import PageHeader from '../PageHeader/PageHeader';
import Body from '../Body/Body';
import HeaderBackground from '../HeaderBackground/HeaderBackground';
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
};

export default PlacePage;
