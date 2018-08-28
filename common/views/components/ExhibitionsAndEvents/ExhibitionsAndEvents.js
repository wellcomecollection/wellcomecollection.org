// @flow
import CardGrid from '../CardGrid/CardGrid';
import {data as dailyTourPromoData} from '../DailyTourPromo/DailyTourPromo';
import type {UiExhibition} from '../../../model/exhibitions';
import type {UiEvent} from '../../../model/events';

type Props = {|
  exhibitions: UiExhibition[],
  events: UiEvent[]
|}

const ExhibitionsAndEvents = ({exhibitions, events}: Props) => {
  const permanentExhibitions = exhibitions.filter(exhibition => exhibition.isPermanent);
  const otherExhibitions = exhibitions.filter(exhibition => !exhibition.isPermanent);
  const items = otherExhibitions.concat(events, [dailyTourPromoData], permanentExhibitions);

  return (
    // $FlowFixMe TODO: this is because of the daily tour
    <CardGrid items={items} />
  );
};
export default ExhibitionsAndEvents;
