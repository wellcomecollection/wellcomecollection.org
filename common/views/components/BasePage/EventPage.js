// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import Contributors from '../Contributors/Contributors';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import Tags from '../Tags/Tags';
import {UiImage} from '../Images/Images';
import type {Event} from '../../../model/events';
import {spacing, font} from '../../../utils/classnames';
import {formatAndDedupeOnDate, formatAndDedupeOnTime, joinDateStrings} from '../../../utils/format-date';

type Props = {|
  event: Event
|}

function dateInfo(times) {
  return (
    <Fragment>
      {times.map((eventTime, index) => {
        const formattedDateRange =  formatAndDedupeOnDate(eventTime.range.startDateTime, eventTime.range.endDateTime);
        return (
          <div key={index} className={`border-top-width-1 border-color-pumice ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>
            <time className='block'>
              <b className={font({s: 'HNM4'})}>{joinDateStrings(formattedDateRange)}</b>
            </time>
            {formattedDateRange.length === 1 && (
              <div className='flex'>
                <time className='block'>
                  {joinDateStrings(formatAndDedupeOnTime(eventTime.range.startDateTime, eventTime.range.endDateTime))}
                </time>
              </div>
            )}
          </div>
        );
      })}
    </Fragment>
  );
}

function infoBar(cost) {
  return (
    <p className='no-margin'>
      {cost || 'Free admission'}
    </p>
  );
}

//       {% icon interpretation.interpretationType.title | replace(' ', '_') | replace('-', '_') | lower %}
const BookingInfo = ({bookingInformation, interpretations}: any) => ( // TODO props / icon
  <div className='body-text'>
    {interpretations.map((i) => {
      return (i.interpretationType.description &&
        <Fragment>
          <h2 className='flex flex--v-center'>
            <span className={`flex flex--v-center ${spacing({s: 1}, {margin: ['right']})}`}>
              icon goes here
            </span>
            <span>{i.interpretationType.title}</span>
          </h2>
          {i.isPrimary && <div dangerouslySetInnerHTML={{__html: i.interpretationType.primaryDescription}} />}
          {!i.isPrimary && <div dangerouslySetInnerHTML={{__html: i.interpretationType.description}} />}
        </Fragment>
      );
    })}
    {bookingInformation &&
      <Fragment>
        <h3 className={font({s: 'HNM4'})}>Booking information</h3>
        <div className={`plain-text ${font({s: 'HNL4'})} ${spacing({s: 4}, {margin: ['bottom']})}`} dangerouslySetInnerHTML={{__html: bookingInformation}} />
      </Fragment>}
    <p className={`plain-text no-margin ${font({s: 'HNL4'})}`}>
      <a href='https://wellcomecollection.org/visit-us/events-tickets'>Our event terms and conditions</a>
    </p>
  </div>
);

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
  const DateInfo = event.times && dateInfo(event.times);
  const InfoBar = infoBar(event.cost);
  const formatTag = event.format ? [{text: event.format.title}] : [];
  const interpretationsTags = event.interpretations ? event.interpretations.map(i => ({text: i.interpretationType.title})) : [];
  const TagBar = <Tags tags={formatTag.concat(interpretationsTags)} />;
  const Header = (<BaseHeader
    title={event.title}
    Background={WobblyBackground()}
    TagBar={TagBar}
    DateInfo={DateInfo}
    InfoBar={InfoBar}
    Description={null}
    FeaturedMedia={FeaturedMedia}
  />);

  return (
    <BasePage
      id={event.id}
      Header={Header}
      Body={<Body body={event.body} />}
    >
      <Fragment>
        {event.contributors.length > 0 &&
          <Contributors contributors={event.contributors} />
        }
        <BookingInfo bookingInformation={event.bookingInformation} interpretations={event.interpretations} />
      </Fragment>
    </BasePage>
  );
};

export default EventPage;
