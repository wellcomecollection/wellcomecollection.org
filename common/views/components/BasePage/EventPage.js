// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import Contributors from '../Contributors/Contributors';
import WobblyBackground from '../BaseHeader/WobblyBackground';
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
  const Header = (<BaseHeader
    title={event.title}
    Background={WobblyBackground()}
    TagBar={null}
    DateInfo={DateInfo}
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
      <Fragment>
        {event.contributors.length > 0 &&
          <Contributors contributors={event.contributors} />
        }
      </Fragment>
    </BasePage>
  );
};

export default EventPage;
