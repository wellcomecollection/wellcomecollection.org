// @flow
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import Contributors from '../Contributors/Contributors';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import {UiImage} from '../Images/Images';
import EventPlace from '../EventPlace/EventPlace';
import type {Event} from '../../../model/events';

type Props = {|
  event: Event
|}

const EventPage = ({ event }: Props) => {
  const image = event.promo && event.promo.image;
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
  const FeaturedMedia = event.promo && <UiImage tasl={tasl} {...image} />;
  const Header = (<BaseHeader
    title={event.title}
    Background={WobblyBackground()}
    TagBar={null}
    DateInfo={null}
    InfoBar={null}
    Description={null}
    FeaturedMedia={FeaturedMedia}
  />);

  return (
    <BasePage
      id={event.id}
      Header={Header}
      Body={<Body body={event.body} />}
    >
      {event.contributors.length > 0
        ? <Contributors contributors={event.contributors} /> : null
      }
      {event.place && <EventPlace
        title={event.place.title}
        level={event.place.level}
        locationInformation={event.place.locationInformation}
      />}
    </BasePage>
  );
};

export default EventPage;
