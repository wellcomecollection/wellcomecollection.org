// @flow
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { UiImage } from '../Images/Images';
import LabelsList from '../LabelsList/LabelsList';
import Dot from '../Dot/Dot';
import EventDateRange from '../EventDateRange/EventDateRange';
import { type UiEvent, isEventFullyBooked } from '../../../model/events';
import Moment from 'moment';
import Space from '../styled/Space';
import { CardOuter, CardBody } from '../Card/Card';
/* $FlowFixMe (tsx) */
import Divider from '../Divider/Divider';
import styled from 'styled-components';

const OnlineIndicator = styled.span.attrs(() => ({
  className: classNames({
    [font('hnm', 6)]: true,
  }),
}))`
  display: inline-block;
  color: ${props => props.theme.color('pewter')};
  border: 1px solid ${props => props.theme.color('pewter')};
  border-radius: 4px;
  line-height: 1;
  padding: ${props => `${props.theme.spacingUnit/2}px`}
`
type Props = {|
  event: UiEvent,
  position?: number,
  dateString?: string,
  timeString?: string,
  fromDate?: Moment,
|};

const EventPromo = ({
  event,
  position = 0,
  dateString,
  timeString,
  fromDate,
}: Props) => {
  const fullyBooked = isEventFullyBooked(event);
  const isPast = event.isPast;
  return (
    <CardOuter
      data-component="EventPromo"
      data-component-state={JSON.stringify({ position: position })}
      href={(event.promo && event.promo.link) || `/events/${event.id}`}
      onClick={() => {
        trackEvent({
          category: 'EventPromo',
          action: 'follow link',
          label: `${event.id} | position: ${position}`,
        });
      }}
    >
      <div className="relative">
        {/* FIXME: Image type tidy */}
        {event.promoImage && (
          // $FlowFixMe
          <UiImage
            {...event.promoImage}
            sizesQueries="(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)"
            showTasl={false}
          />
        )}

        {event.labels.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0 }}>
            <LabelsList labels={event.primaryLabels} />
          </div>
        )}
      </div>

      <CardBody>
        <div>
          <Space
            v={{
              size: 's',
              properties: ['margin-bottom'],
            }}
            as="h2"
            className={classNames({
              'promo-link__title': true,
              [font('wb', 3)]: true,
            })}
          >
            {event.title}
          </Space>

          {event.isOnline && <OnlineIndicator>Online</OnlineIndicator>}
          {!isPast && (
            <p className={`${font('hnl', 5)} no-padding no-margin`}>
              <EventDateRange
                event={event}
                splitTime={true}
                fromDate={fromDate}
              />
            </p>
          )}

          {!isPast && dateString && (
            <p className={`${font('hnl', 5)} no-padding no-margin`}>
              {dateString}
            </p>
          )}

          {!isPast && timeString && (
            <p className={`${font('hnl', 5)} no-padding no-margin`}>
              {timeString}
            </p>
          )}

          {!isPast && fullyBooked && (
            <Space
              v={{ size: 'm', properties: ['margin-top'] }}
              className={`${font('hnl', 5)} flex flex--v-center`}
            >
              <Space
                as="span"
                h={{ size: 'xs', properties: ['margin-right'] }}
                className={`flex flex--v-center`}
              >
                <Dot color={'red'} />
              </Space>
              Fully booked
            </Space>
          )}
          {!isPast && event.scheduleLength > 0 && (
            <p className={`${font('hnm', 5)} no-padding no-margin`}>
              {`${event.scheduleLength} ${
                event.scheduleLength > 1 ? 'events' : 'event'
              }`}
            </p>
          )}

          {!isPast && event.times.length > 1 && (
            <p className={`${font('hnm', 6)}`}>See all dates/times</p>
          )}

          {isPast && (
            <div className={`${font('hnl', 5)} flex flex--v-center`}>
              <Space
                as="span"
                h={{ size: 'xs', properties: ['margin-right'] }}
                className={`flex flex--v-center`}
              >
                <Dot color={'marble'} />
              </Space>
              Past
            </div>
          )}
        </div>

        {event.series.length > 0 && (
          <Space v={{ size: 'l', properties: ['margin-top'] }}>
            {event.series.map(series => (
              <p key={series.title} className={`${font('hnm', 6)} no-margin`}>
                <span className={font('hnl', 6)}>Part of</span> {series.title}
              </p>
            ))}
          </Space>
        )}
      </CardBody>
      <Divider extraClasses="divider--white divider--keyline" />
      {event.secondaryLabels.length > 0 && (
        <Space
          v={{
            size: 's',
            properties: ['padding-top', 'padding-bottom'],
          }}
          h={{ size: 's', properties: ['padding-left', 'padding-right'] }}
        >
          <LabelsList
            labels={event.secondaryLabels}
            labelColor="black"
            secondary={true}
          />
        </Space>
      )}
    </CardOuter>
  );
};

export default EventPromo;
