import { FunctionComponent } from 'react';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { EventBasic } from '@weco/content/types/events';
import { Link } from '@weco/content/types/link';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';

type Props = {
  exhibitions: ExhibitionBasic[];
  events: EventBasic[];
  extras?: (ExhibitionBasic | EventBasic)[];
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

  const items = [
    ...otherExhibitions,
    ...events,
    ...permanentExhibitions,
    ...extras,
  ];

  return <CardGrid items={items} itemsPerRow={3} links={links} />;
};

export default ExhibitionsAndEvents;
