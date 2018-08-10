// @flow
import LabelsList from '../LabelsList/LabelsList';
import DateRange from '../DateRange/DateRange';
import CompactCard from '../CompactCard/CompactCard';
import Image from '../Image/Image';
import type {UiEvent} from '../../../model/events';

type Props = {|
  event: UiEvent
|}

const EventCard = ({ event }: Props) => {
  const labels = [event.format ? {
    url: null,
    text: event.format.title
  } : null].concat(event.audiences.map(audience => ({
    url: null,
    text: audience.title
  }))).filter(Boolean);
  // TODO: We need to centralise this somewhere
  const dateRange = event.times.length > 0 && {
    start: event.times[0].range.startDateTime,
    end: event.times[0].range.endDateTime
  };

  const LabelsComponent = <LabelsList labels={labels} />;
  const DateRangeComponent = dateRange ? <DateRange {...dateRange} /> : null;
  const ImageComponent = event.promo && event.promo.image && <Image {...event.promo.image} />;

  return <CompactCard
    url={`/events/${event.id}`}
    title={event.title}
    promoType={'EventPromo'}
    description={null}
    urlOverride={event.promo && event.promo.link}
    Tags={LabelsComponent}
    Image={ImageComponent}
    DateInfo={DateRangeComponent}
  />;
};

export default EventCard;
