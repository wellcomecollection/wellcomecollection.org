// @flow
import { type Node } from 'react';
import CardGrid from '../CardGrid/CardGrid';
import { data as dailyTourPromoData } from '../DailyTourPromo/DailyTourPromo';
import type { UiExhibition } from '../../../model/exhibitions';
import type { UiEvent } from '../../../model/events';

type Props = {|
  exhibitions: UiExhibition[],
  events: UiEvent[],
  extras?: (UiExhibition | UiEvent)[],
  children: Node,
|};

const ExhibitionsAndEvents = ({
  exhibitions,
  events,
  extras = [],
  children,
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

  return <CardGrid items={items}>{children}</CardGrid>;
};
export default ExhibitionsAndEvents;
