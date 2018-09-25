// @flow
import CompactCard from '../CompactCard/CompactCard';
import Image from '../Image/Image';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import EventDateRange from '../EventDateRange/EventDateRange';
import type {UiEvent} from '../../../model/events';

type Props = {|
  event: UiEvent
|}

const EventCard = ({ event }: Props) => {
  const formatLabel = [event.format ? {
    url: null,
    text: event.format.title
  } : null];
  const audienceLabels = event.audiences.map(audience => ({
    url: null,
    text: audience.title
  }));
  const interpretationLabels = event.interpretations.map(interpretation => ({
    url: null,
    text: interpretation.interpretationType.title
  }));
  const labels = [
    ...formatLabel,
    ...audienceLabels,
    ...interpretationLabels
  ].filter(Boolean);

  const DateRangeComponent = EventDateRange({event});
  const ImageComponent = event.promo && event.promo.image && <Image {...event.promo.image} />;

  const firstTime = event.times[0];
  const lastTime = event.times[event.times.length - 1];
  const StatusIndicatorComponent =
    event.isPast ? <StatusIndicator start={firstTime.range.startDateTime} end={lastTime.range.endDateTime} /> : null;

  return <CompactCard
    url={`/events/${event.id}`}
    title={event.title}
    partNumber={null}
    promoType={'EventPromo'}
    labels={{labels}}
    description={null}
    urlOverride={event.promo && event.promo.link}
    Image={ImageComponent}
    DateInfo={DateRangeComponent}
    StatusIndicator={StatusIndicatorComponent}
  />;
};

export default EventCard;
