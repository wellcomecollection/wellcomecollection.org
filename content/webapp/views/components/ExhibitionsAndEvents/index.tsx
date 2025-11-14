// eslint-data-component: intentionally omitted
import { FunctionComponent } from 'react';

import AccessibilityProvision from '@weco/common/views/components/AccessibilityProvision';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Link } from '@weco/content/types/link';
import CardGrid from '@weco/content/views/components/CardGrid';
import { data as dailyTourPromo } from '@weco/content/views/components/CardGrid/CardGrid.DailyTourCard';

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
    dailyTourPromo,
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
