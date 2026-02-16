import { FunctionComponent } from 'react';
import styled from 'styled-components';

import PlainList from '@weco/common/views/components/styled/PlainList';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import WorkCard from '@weco/content/views/components/WorkCards/WorkCards.Card';

const WorksList = styled(PlainList)`
  ${props => `
    --gap: ${props.theme.gutter.small};
  `}

  ${props =>
    props.theme.media('sm')(`
    --gap: ${props.theme.gutter.medium};
  `)}

  ${props =>
    props.theme.media('md')(`
    --gap: ${props.theme.gutter.large};
  `)}

  ${props =>
    props.theme.media('lg')(`
    --gap: ${props.theme.gutter.xlarge};
  `)}

  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--gap);
`;

const WorkContainer = styled.li<{ $columns: 3 | 4 }>`
  flex: 0 0 calc(100% - var(--gap));

  ${props =>
    props.theme.media('sm')(`
    flex: 0 0 calc(50% - var(--gap));
  `)}

  ${props =>
    props.theme.media('md')(`
    flex: 0 0 calc(100% / ${props.$columns} - var(--gap));
  `)}
`;

type Props = {
  works: WorkBasic[];
  columns?: 3 | 4;
};

const WorkCards: FunctionComponent<Props> = ({ works, columns = 4 }) => {
  if (works.length === 0) return null;
  if (works.length === 1) return <WorkCard item={works[0]} />;

  return (
    <WorksList data-component="work-cards">
      {works.map(item => (
        <WorkContainer key={item.id} $columns={columns}>
          <WorkCard item={item} />
        </WorkContainer>
      ))}
    </WorksList>
  );
};

export default WorkCards;
