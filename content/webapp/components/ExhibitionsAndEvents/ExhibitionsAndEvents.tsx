import { UiExhibition } from '@weco/common/model/exhibitions';
import { UiEvent } from '@weco/common/model/events';
import { Link } from '@weco/common/model/link';
import CardGrid from '../CardGrid/CardGrid';

type Props = {
  exhibitions: UiExhibition[];
  events: UiEvent[];
  extras?: (UiExhibition | UiEvent)[];
  links?: Link[];
};

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

  const items: (UiExhibition | UiEvent)[] = [
    ...otherExhibitions,
    ...events,
    ...permanentExhibitions,
    ...extras,
  ];

  return <CardGrid items={items} itemsPerRow={3} links={links} />;
};

export default ExhibitionsAndEvents;
