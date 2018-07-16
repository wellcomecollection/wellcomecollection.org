// @flow
import {Fragment} from 'react';
import BasePage from './BasePage';
import {default as BaseHeader, getFeaturedMedia} from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import Contributors from '../Contributors/Contributors';
import SearchResults from '../SearchResults/SearchResults';
import {parseDescription} from '../../../services/prismic/parsers';
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
  const body = series.description ? [{
    type: 'text',
    weight: 'default',
    value: parseDescription(series.description)
  }] : [];
  const FeaturedMedia = getFeaturedMedia({
    id: series.id,
    title: series.title,
    contributors: series.contributors,
    contributorsTitle: series.contributorsTitle,
    promo: series.promo,
    body: body
  });
  const Header = (<BaseHeader
    title={series.title}
    Background={<WobblyBackground />}
    TagBar={null}
    DateInfo={null}
    InfoBar={null}
    Description={null}
    FeaturedMedia={FeaturedMedia}
  />);

  return (
    <BasePage
      id={series.id}
      Header={Header}
      Body={<Body body={body} />}
    >
      <Fragment>
        {series.contributors.length > 0 &&
          <Contributors
            titleOverride={series.contributorsTitle}
            contributors={series.contributors} />
        }
        {events.length > 0 &&
          <SearchResults items={events} />
        }
      </Fragment>
    </BasePage>
  );
};

export default Page;
