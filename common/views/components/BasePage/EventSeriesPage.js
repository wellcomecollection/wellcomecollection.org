// @flow
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import WobblyBackground from '../BaseHeader/WobblyBackground';
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
  const Header = (<BaseHeader
    title={series.title}
    Background={<WobblyBackground />}
    TagBar={null}
    DateInfo={null}
    InfoBar={null}
    Description={null}
    FeaturedMedia={null}
  />);

  return (
    <BasePage
      id={series.id}
      Header={Header}
      Body={<Body body={[]} />}
    >
    </BasePage>
  );
};

export default Page;
