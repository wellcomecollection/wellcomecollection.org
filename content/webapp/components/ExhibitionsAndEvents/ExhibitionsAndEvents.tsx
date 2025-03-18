import { FunctionComponent } from 'react';

import AccessibilityProvision from '@weco/content/components/AccessibilityProvision/AccessibilityProvision';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Link } from '@weco/content/types/link';

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

  return (
    <CardGrid
      items={items}
      itemsPerRow={3}
      links={links}
      optionalComponent={<AccessibilityProvision />}
    />
  );
};

export default ExhibitionsAndEvents;
