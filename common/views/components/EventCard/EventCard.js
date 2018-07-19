// @flow
import Labels from '../Labels/Labels';
import ContentCard from '../ContentCard/ContentCard';
import Image from '../Image/Image';
import type {UiEvent} from '../../../model/events';

type Props = {|
  event: UiEvent
|}

const EventCard = ({ event }: Props) => {
  const LabelsComponent = <Labels items={[]} />;

  return <ContentCard
    url={`/events/${event.id}`}
    title={event.title}
    promoType={'EventPromo'}
    description={null}
    urlOverride={event.promo && event.promo.link}
    Tags={LabelsComponent}
    Image={event.promo && event.promo.image && <Image {...event.promo.image} />}
  />;
};

export default EventCard;
