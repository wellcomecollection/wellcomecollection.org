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
  // FIXME: remove this hack when Being Human no longer deserves the top spot on the homepage
  const permanentExhibitionsWithoutBeingHuman = exhibitions.filter(
    exhibition => exhibition.isPermanent && exhibition.id !== 'XNFfsxAAANwqbNWD'
  );
  const beingHuman = exhibitions.filter(
    exhibition => exhibition.id === 'XNFfsxAAANwqbNWD'
  );
  const otherExhibitions = exhibitions.filter(
    exhibition => !exhibition.isPermanent
  );
  const items = [
    ...beingHuman,
    ...otherExhibitions,
    ...events,
    ...[dailyTourPromoData],
    ...permanentExhibitionsWithoutBeingHuman,
    ...extras,
  ];

  return <CardGrid items={items} itemsPerRow={3} links={links} />;
};
export default ExhibitionsAndEvents;
