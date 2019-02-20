// @flow

import CardGrid from '../CardGrid/CardGrid';
import { data as dailyTourPromoData } from '../DailyTourPromo/DailyTourPromo';
import type { UiExhibition } from '../../../model/exhibitions';
import { type UiEvent } from '../../../model/events';
import { type Link } from '../../../model/link';

type Props = {|
  exhibitions: UiExhibition[],
  events: UiEvent[],
  extras?: (UiExhibition | UiEvent)[],
  links?: Link[],
|};

const ExhibitionsAndEvents = ({
  exhibitions,
  events,
  extras = [],
  links,
}: Props) => {
  const permanentExhibitions = exhibitions.filter(
    exhibition => exhibition.isPermanent
  );
  const otherExhibitions = exhibitions.filter(
    exhibition => !exhibition.isPermanent
  );
  const items = otherExhibitions.concat(
    events,
    [dailyTourPromoData],
    permanentExhibitions,
    extras
  );

  return <CardGrid items={items} itemsPerRow={3} links={links} />;
};
export default ExhibitionsAndEvents;
