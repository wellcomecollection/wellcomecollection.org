// @flow
import CardGrid from '../CardGrid/CardGrid';
import {data as dailyTourPromoData} from '../DailyTourPromo/DailyTourPromo';
import type {UiExhibition} from '../../../model/exhibitions';
import type {UiEvent} from '../../../model/events';
import type {Installation} from '../../../model/installations';

type Props = {|
  exhibitions: UiExhibition[],
  events: UiEvent[],
  extras: (UiExhibition | UiEvent | Installation)[]
|}

const ExhibitionsAndEvents = ({exhibitions, events, extras}: Props) => {
  const permanentExhibitions = exhibitions.filter(exhibition => exhibition.isPermanent);
  const otherExhibitions = exhibitions.filter(exhibition => !exhibition.isPermanent);
  const items = otherExhibitions.concat(events, [dailyTourPromoData], permanentExhibitions, extras);

  return (
    // $FlowFixMe TODO: this is because of the daily tour
    <CardGrid items={items} />
  );
};
export default ExhibitionsAndEvents;
