import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ArchiveCardListSlice as RawArchiveCardListSlice } from '@weco/common/prismicio-types';
import { font } from '@weco/common/utils/classnames';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import ArchiveCard from '@weco/content/views/components/ArchiveCard';
import { SliceZoneContext } from '@weco/content/views/components/Body';

type ArchiveCardListSliceProps = SliceComponentProps<
  RawArchiveCardListSlice,
  SliceZoneContext
>;

const ArchiveCardListSlice: FunctionComponent<ArchiveCardListSliceProps> = ({
  slice,
  context,
}) => {
  const { title, items } = slice.primary;
  const archiveWorks = context?.archiveWorks ?? {};

  const cards = items
    .map(item => {
      const id = item.id;
      if (!id) return undefined;
      const work = archiveWorks[id];
      return {
        id,
        label: item.label || '',
        description: item.archive_description || '',
        isOrganisation: item.is_organisation ?? false,
        title: work?.title,
        contributor: work?.primaryContributorLabel,
        date: work?.productionDates[0],
        extent: work?.physicalDescription,
      };
    })
    .filter(isNotUndefined);

  if (cards.length === 0) return null;

  const colsToSpan: [number] = cards.length >= 4 ? [3] : [4];

  return (
    <SpacingComponent $sliceType={slice.slice_type}>
      <Container>
        {title && (
          <Space $v={{ size: 'lg', properties: ['margin-bottom'] }}>
            <h2 className={font('sans-bold', 2)}>{title}</h2>
          </Space>
        )}
        <Grid>
          {cards.map(card => (
            <GridCell
              key={card.id}
              $sizeMap={{ s: [12], m: [6], l: colsToSpan, xl: colsToSpan }}
            >
              <ArchiveCard {...card} />
            </GridCell>
          ))}
        </Grid>
      </Container>
    </SpacingComponent>
  );
};

export default ArchiveCardListSlice;
