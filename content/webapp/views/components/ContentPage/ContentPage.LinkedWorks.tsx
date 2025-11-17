import { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { ContentApiLinkedWork } from '@weco/content/services/wellcome/content/types/api';
import RelatedWorksCard from '@weco/content/views/components/RelatedWorksCard';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';

const FullWidthRow = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const ListItem = styled.li`
  --container-padding: ${props =>
    props.theme.formatContainerPadding(props.theme.containerPadding.small)};
  flex: 0 0 90%;
  max-width: 420px;

  padding-left: var(--container-padding);

  &:last-child {
    padding-right: var(--container-padding);
  }

  ${props =>
    props.theme.media('medium')(`
      flex: 0 0 50%;
      padding: 0 var(--container-padding) 0 0;
    `)}
`;

type LinkedWorkProps = {
  linkedWorks: ContentApiLinkedWork[];
  gridSizes: SizeMap;
  parentId: string;
};

const LinkedWorks: FunctionComponent<LinkedWorkProps> = ({
  linkedWorks,
  gridSizes,
}: LinkedWorkProps) => {
  const hasLinkedWorks = linkedWorks && linkedWorks.length > 0;

  useEffect(() => {
    // Only do this if there are results to display
    if (hasLinkedWorks) {
      const dataLayerEvent = {
        event: 'featured_works_displayed',
        featuredWorks: linkedWorks.map((work, i) => ({
          workId: work.id,
          positionInList: i + 1,
        })),
      };
      window.dataLayer?.push(dataLayerEvent);
    }
  }, []);

  if (!hasLinkedWorks) return null;

  return (
    <FullWidthRow>
      <ContaineredLayout gridSizes={gridSizes as SizeMap}>
        <h2 className={font('wb', 3)}>Featured in this article</h2>
      </ContaineredLayout>

      <ScrollContainer
        label={`${linkedWorks.length} works from our catalogue`}
        gridSizes={gridSizes}
        useShim
      >
        {linkedWorks.map((work, i) => {
          return (
            <ListItem key={work.id}>
              <RelatedWorksCard
                variant="default"
                work={work}
                gtmData={{
                  trigger: 'work-link-component',
                  id: work.id,
                  'position-in-list': `${i + 1}`,
                }}
              />
            </ListItem>
          );
        })}
      </ScrollContainer>
    </FullWidthRow>
  );
};

export default LinkedWorks;
