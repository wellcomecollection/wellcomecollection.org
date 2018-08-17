// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import {default as BaseHeader, getFeaturedMedia} from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import HeaderBackground from '../BaseHeader/HeaderBackground';
import Contributors from '../Contributors/Contributors';
import SearchResults from '../SearchResults/SearchResults';
import { spacing } from '../../../utils/classnames';
import Tags from '../Tags/Tags';
import type {EventSeries} from '../../../model/event-series';
import type {UiEvent} from '../../../model/events';

type Props = {|
  events: UiEvent[],
  series: EventSeries,
  showContributorsTitle: boolean
|}

const Page = ({
  events,
  series
}: Props) => {
  const FeaturedMedia = getFeaturedMedia({
    id: series.id,
    title: series.title,
    contributors: series.contributors,
    contributorsTitle: series.contributorsTitle,
    promo: series.promo,
    body: series.body,
    promoImage: series.promoImage,
    promoText: series.promoText
  });
  const TagBar = <Tags tags={[{
    text: 'Event series'
  }]} />;
  const Header = (<BaseHeader
    title={series.title}
    Background={<HeaderBackground hasWobblyEdge={true} />}
    TagBar={TagBar}
    DateInfo={null}
    InfoBar={null}
    Description={null}
    FeaturedMedia={FeaturedMedia}
    LabelBar={null}
    isFree={false}
    topLink={null}
  />);

  const upcomingEvents = events.filter(event => {
    const lastStartTime = event.times.length > 0 ? event.times[event.times.length - 1].range.startDateTime : null;
    const inTheFuture = lastStartTime ? new Date(lastStartTime) > new Date() : false;
    return inTheFuture;
  });
  const upcomingEventsIds = upcomingEvents.map(event => event.id);
  const pastEvents = events.filter(event => upcomingEventsIds.indexOf(event.id) === -1);

  return (
    <BasePage
      id={series.id}
      Header={Header}
      Body={<Body body={series.body} />}
    >
      <Fragment>
        {series.contributors.length > 0 &&
          <Contributors
            titleOverride={series.contributorsTitle}
            contributors={series.contributors} />
        }
        {upcomingEvents.length > 0 &&
          <SearchResults items={upcomingEvents} title={`What's next`} />
        }

        {pastEvents.length > 0 &&
          <div className={spacing({s: 8}, {margin: ['top']})}>
            <SearchResults items={pastEvents} title={`What we've done before`} />
          </div>
        }
      </Fragment>
    </BasePage>
  );
};

export default Page;
