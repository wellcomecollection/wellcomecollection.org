import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { getCrop } from '@weco/common/model/image';
import { EventDocument } from '@weco/content/services/wellcome/content/types/api';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import Space from '@weco/common/views/components/styled/Space';
import WatchLabel from '@weco/content/components/WatchLabel/WatchLabel';
import EventDateRange from '@weco/content/components/EventDateRange';
import {
  getLastEndTime,
  transformEventTimes,
} from '@weco/content/services/prismic/transformers/events';
import { isPast as checkIfIsPast } from '@weco/common/utils/dates';
import Icon from '@weco/common/views/components/Icon/Icon';
import { getLocationText } from 'components/EventPromo/EventPromo';
import { location } from '@weco/common/icons';
import { PlaceBasic } from '@weco/content/types/places';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  CardBody,
  CardImageWrapper,
  CardLabels,
  CardOuter,
  CardPostBody,
  CardTitle,
} from '@weco/content/components/Card/Card';
import TextWithDot from '@weco/content/components/TextWithDot';
import Divider from '@weco/common/views/components/Divider/Divider';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import { Label } from '@weco/common/model/labels';

type Props = {
  events: EventDocument[];
};

const EventsContainer = styled.div`
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
`;

const DateInfo = styled.p.attrs({
  className: font('intr', 5),
})`
  padding: 0;
  margin: 0;
`;

const LocationWrapper = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 's', properties: ['margin-top', 'margin-bottom'] },
})`
  display: flex;
  align-items: center;
`;

// Pretty much the equivalent to EventPromo component, but as the data is structured differently, it felt easier to copy here.
// Should we merge them and make it more complex? As the goal is to only use the Content API at some point, I'm wondering if it's worth the effort?
const EventsSearchResults: FunctionComponent<Props> = ({ events }: Props) => {
  return (
    <EventsContainer>
      {events.map(event => {
        const image = transformImage(event.image);
        const croppedImage = getCrop(image, '32:15');

        const times = transformEventTimes(event.id, event.times);

        const lastEndTime = getLastEndTime(times);
        const isPast = lastEndTime ? checkIfIsPast(lastEndTime) : true;

        const isOnline = Boolean(
          event.locations.find(l => l.label === 'Online')
        );

        const locations: PlaceBasic[] = event.locations
          .map(l => {
            return l.label ? { title: l.label } : undefined;
          })
          .filter(t => isNotUndefined(t)) as PlaceBasic[];

        const primaryLabels = [
          event.format.label,
          ...event.audiences.map(a => a.label),
        ].map(text => ({ text }));

        const secondaryLabels = [...event.interpretations]
          .map(interpretation => ({
            text: interpretation.label,
          }))
          .filter(isNotUndefined) as Label[];

        return (
          <CardOuter
            key={event.id}
            href={linkResolver({ id: event.id, type: 'events' })}
          >
            <CardImageWrapper>
              {croppedImage && (
                <>
                  <PrismicImage
                    image={{
                      // We intentionally omit the alt text on promos, so screen reader
                      // users don't have to listen to the alt text before hearing the
                      // title of the item in the list.
                      //
                      // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
                      ...croppedImage,
                      alt: '',
                    }}
                    sizes={{
                      xlarge: 1 / 4,
                      large: 1 / 3,
                      medium: 1 / 2,
                      small: 1,
                    }}
                    quality="low"
                  />
                </>
              )}

              {primaryLabels.length > 0 && (
                <CardLabels labels={primaryLabels} />
              )}
            </CardImageWrapper>

            <CardBody>
              <div>
                <CardTitle>{event.title}</CardTitle>

                {(isOnline || locations.length > 0) && (
                  <LocationWrapper>
                    <Icon icon={location} matchText />
                    <Space $h={{ size: 'xs', properties: ['margin-left'] }}>
                      {getLocationText(isOnline, locations)}
                    </Space>
                  </LocationWrapper>
                )}

                {event.isAvailableOnline && (
                  <Space $v={{ size: 's', properties: ['margin-top'] }}>
                    <WatchLabel text="Available to watch" />
                  </Space>
                )}

                {!isPast && (
                  <>
                    <DateInfo>
                      <EventDateRange
                        eventTimes={times}
                        splitTime={true}
                        // TODO change with date filtering, defaults to today
                        // fromDate={}
                      />
                    </DateInfo>
                  </>
                )}

                {/* TODO isFullyBooked needs to be added to API reponse */}
                {/* {upcomingDatesFullyBooked(event) && (
                <Space $v={{ size: 'm', properties: ['margin-top'] }}>
                  <TextWithDot
                    className={font('intr', 5)}
                    dotColor="validation.red"
                    text="Fully booked"
                  />
                </Space>
              )} */}

                {!isPast && times.length > 1 && (
                  <p className={font('intb', 6)}>See all dates/times</p>
                )}
                {isPast && !event.isAvailableOnline && (
                  <div>
                    <TextWithDot
                      className={font('intr', 5)}
                      dotColor="neutral.500"
                      text="Past"
                    />
                  </div>
                )}
              </div>
            </CardBody>

            {event.series.length > 0 && (
              <CardPostBody>
                {event.series.map(series => (
                  <p
                    key={series.title}
                    className={font('intb', 6)}
                    style={{ marginBottom: 0 }}
                  >
                    <span className={font('intr', 6)}>Part of</span>{' '}
                    {series.title}
                  </p>
                ))}
              </CardPostBody>
            )}

            {secondaryLabels.length > 0 && (
              <Space
                $h={{
                  size: 'm',
                  properties: ['padding-left', 'padding-right'],
                }}
                $v={{ size: 'm', properties: ['padding-bottom'] }}
              >
                <Divider lineColor="white" />
                <Space $v={{ size: 's', properties: ['padding-top'] }}>
                  <LabelsList
                    labels={secondaryLabels}
                    defaultLabelColor="black"
                  />
                </Space>
              </Space>
            )}
          </CardOuter>
        );
      })}
    </EventsContainer>
  );
};

export default EventsSearchResults;
