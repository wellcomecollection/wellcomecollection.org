// @flow
import Labels from '../Labels/Labels';
import DateRange from '../DateRange/DateRange';
import ContentCard from '../ContentCard/ContentCard';
import Image from '../Image/Image';
import type {UiEvent} from '../../../model/events';

type Props = {|
  event: UiEvent
|}

const EventCard = ({ event }: Props) => {
  const labels = [
    (event.format ? {
      label: event.format.title
    } : null)
  ].concat(event.audiences.map(audience => ({
    label: audience.title
  }))).filter(Boolean);
  const LabelsComponent = <Labels items={labels} />;
  const DateRangeComponent = <DateRange start={new Date()} end={new Date()} />;

  return <ContentCard
    url={`/events/${event.id}`}
    title={event.title}
    promoType={'EventPromo'}
    description={null}
    urlOverride={event.promo && event.promo.link}
    Tags={LabelsComponent}
    Image={event.promo && event.promo.image && <Image {...event.promo.image} />}
    DateInfo={DateRangeComponent}
  />;
};

export default EventCard;
