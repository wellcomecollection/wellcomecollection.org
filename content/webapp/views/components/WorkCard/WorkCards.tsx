// Make default when newOnlineListingPage becomes default
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import WorkCardAPI from '@weco/content/views/components/WorkCard/WorkCard.API';

const Works = styled.div`
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

const WorkContainer = styled.div`
  flex: 0 0 calc(100% - var(--gap));

  ${props =>
    props.theme.media('sm')(`
    flex: 0 0 calc(50% - var(--gap));
  `)}

  ${props =>
    props.theme.media('md')(`
    flex: 0 0 calc(25% - var(--gap));
  `)}
`;

type Props = {
  works: WorkBasic[];
};

const WorkCards: FunctionComponent<Props> = ({ works }) => {
  if (works.length === 0) return null;
  if (works.length === 1) return <WorkCardAPI item={works[0]} />;

  return (
    <Works>
      {works.map(item => (
        <WorkContainer key={item.id}>
          <WorkCardAPI item={item} />
        </WorkContainer>
      ))}
    </Works>
  );
};

export default WorkCards;
