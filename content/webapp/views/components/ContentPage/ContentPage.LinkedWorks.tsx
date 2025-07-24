import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import { ContentAPILinkedWork } from '@weco/content/views/pages/stories/story/tempMockData';

import LinkedWorkCard from './ContentPage.LinkedWorks.Card';

const FullWidthRow = styled(Space).attrs({
  $v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
})`
  background-color: ${props => props.theme.color('warmNeutral.300')};
`;

const ListItem = styled.li`
  flex: 0 0 33%;
  max-width: 420px;
  margin-right: 20px;
`;

const Shim = styled.li<{ $gridValues: number[] }>`
  --container-padding: ${props => props.theme.containerPadding.small}px;
  --number-of-columns: ${props => (12 - props.$gridValues[0]) / 2};
  --gap-value: ${props => props.theme.gutter.small}px;
  --container-width: calc(100% - (var(--container-padding) * 2));
  --container-width-without-gaps: calc(
    (var(--container-width) - (var(--gap-value) * 11))
  );
  min-width: calc(
    var(--container-padding) +
      (
        var(--number-of-columns) *
          ((var(--container-width-without-gaps) / 12) + var(--gap-value))
      )
  );

  ${props =>
    props.theme.media('medium')(`
      --container-padding: ${props.theme.containerPadding.medium}px;
      --number-of-columns: ${(12 - props.$gridValues[1]) / 2};
      --gap-value: ${props.theme.gutter.medium}px;
  `)}

  ${props =>
    props.theme.media('large')(`
      --container-padding: ${props.theme.containerPadding.large}px;
      --number-of-columns: ${(12 - props.$gridValues[2]) / 2};
      --gap-value: ${props.theme.gutter.large}px;
  `)}


  ${props =>
    props.theme.media('xlarge')(`
      /* Considers margin: 0 auto at the largest side */ 
      --container-padding: ${props.theme.containerPadding.xlarge}px;
      --container-width: calc(${props.theme.sizes.xlarge}px - (var(--container-padding) * 2));
      --left-margin-width: calc((100% - ${props.theme.sizes.xlarge}px) / 2);
      --number-of-columns: ${(12 - props.$gridValues[3]) / 2};
      --gap-value: ${props.theme.gutter.xlarge}px;

      min-width: calc(
        var(--left-margin-width) + var(--container-padding) +
          (
            var(--number-of-columns) *
              ((var(--container-width-without-gaps) / 12) + var(--gap-value))
          )
      );
  `)}
`;

type LinkedWorkProps = {
  linkedWorks: ContentAPILinkedWork[];
  gridSizes: SizeMap;
};

const ScrollableLinkedWorks: FunctionComponent<LinkedWorkProps> = ({
  linkedWorks,
  gridSizes,
}: LinkedWorkProps) => {
  if (!linkedWorks || linkedWorks.length === 0) return null;
  const gridValues = Object.values(gridSizes).map(v => v[0]);

  return (
    // TODO remove this id
    <FullWidthRow id="featured-works">
      <ContaineredLayout gridSizes={gridSizes as SizeMap}>
        <h2 className={font('wb', 3)}>Featured in this article</h2>
      </ContaineredLayout>

      <ScrollContainer
        label={`${linkedWorks.length} works from our catalogue`}
        gridSizes={gridSizes}
      >
        <Shim $gridValues={gridValues}></Shim>
        {linkedWorks.map(work => (
          <ListItem key={work.id}>
            <LinkedWorkCard work={work} />
          </ListItem>
        ))}
      </ScrollContainer>
    </FullWidthRow>
  );
};

export default ScrollableLinkedWorks;
