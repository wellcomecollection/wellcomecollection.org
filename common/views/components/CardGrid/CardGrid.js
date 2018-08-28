// @flow
import {classNames, cssGrid} from '../../../utils/classnames';
import ExhibitionPromo from '../ExhibitionPromo/ExhibitionPromo';
import EventPromo from '../EventPromo/EventPromo';
import DailyTourPromo from '../DailyTourPromo/DailyTourPromo';
import type {UiExhibition} from '../../../model/exhibitions';
import type {UiEvent} from '../../../model/events';

type EvEx = UiEvent | UiExhibition; // TODO: This should be MultiContent
type Props = {|
  items: EvEx[]
|}

const CardGrid = ({
  items
}: Props) => (
  <div className='css-grid__container'>
    <div className='css-grid'>
      {items.map((item, i) => (
        <div key={item.id} className={classNames({
          [cssGrid({s: 12, m: 6, l: 4, xl: 4})]: true
        })}>
          {item.id === 'tours' && <DailyTourPromo />}
          {item.type === 'exhibitions' &&
            // TODO: (remove Picture type)
            // $FlowFixMe
            <ExhibitionPromo
              id={item.id}
              url={`/exhibitions/${item.id}`}
              title={item.title}
              description={item.promoText || ''}
              format={item.format}
              // TODO: (remove Picture type)
              // $FlowFixMe
              image={item.promoImage}
              start={item.start}
              end={item.end}
              statusOverride={item.statusOverride}
              position={i} />
          }
          {item.type === 'events' &&
            // TODO: (remove Picture type)
            // $FlowFixMe
            <EventPromo
              id={item.id}
              url={`/events/${item.id}`}
              title={item.title}
              description={item.promoText || ''}
              bookingType={null}
              start={item.times.length > 0 ? item.times[0].range.startDateTime : null}
              end={item.times.length > 0 ? item.times[item.times.length - 1].range.endDateTime : null}
              format={item.format}
              isMultiDate={item.times.length > 1}
              isFullyBooked={false}
              hasNotFullyBookedTimes={false}
              // TODO: (remove Picture type)
              // $FlowFixMe
              image={item.promoImage}
              interpretations={item.interpretations}
              eventbriteId={item.eventbriteId}
              dateString={null}
              timeString={null}
              audience={item.audiences.length > 0 ? item.audiences[0] : null}
              series={item.series}
              schedule={[]}
              position={i} />
          }
        </div>
      ))}
    </div>
  </div>
);

export default CardGrid;
