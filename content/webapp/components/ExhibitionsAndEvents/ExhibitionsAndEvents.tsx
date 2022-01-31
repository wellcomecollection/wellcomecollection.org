import { Exhibition } from '@weco/common/model/exhibitions';
import { UiEvent } from '@weco/common/model/events';
import { Link } from '@weco/common/model/link';
import CardGrid from '../CardGrid/CardGrid';
import { FunctionComponent } from 'react';

type Props = {
  exhibitions: Exhibition[];
  events: UiEvent[];
  extras?: (Exhibition | UiEvent)[];
  links?: Link[];
};

const ExhibitionsAndEvents: FunctionComponent<Props> = ({
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

  const items: (Exhibition | UiEvent)[] = [
    ...otherExhibitions,
    ...events,
    ...permanentExhibitions,
    ...extras,
  ];

  return <CardGrid items={items} itemsPerRow={3} links={links} />;
};

export default ExhibitionsAndEvents;
