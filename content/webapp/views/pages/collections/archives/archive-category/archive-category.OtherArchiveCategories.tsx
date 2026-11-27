import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import type { ArchiveCategory } from '@weco/content/services/wellcome/catalogue/archiveCategories';
import ArchiveCategoryCard from '@weco/content/views/components/ArchiveCategoryCard';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import { ListItem } from '@weco/content/views/components/ScrollContainer/ScrollContainer.styles';

const Title = styled(Space).attrs({
  as: 'h2',
  className: typography('heading', 'xl', 'strong', 'brand'),
  $v: { size: 'sm', properties: ['margin-bottom'] },
})``;

const OtherArchiveCategories: FunctionComponent<{
  archiveCategories: ArchiveCategory[];
}> = ({ archiveCategories }) => {
  if (archiveCategories.length === 0) return null;

  return (
    <Space
      as="section"
      aria-labelledby="other-archive-categories"
      $v={{ size: 'xl', properties: ['padding-bottom'] }}
    >
      <ContaineredLayout gridSizes={gridSize12()}>
        <Title id="other-archive-categories">Other types of archives</Title>
      </ContaineredLayout>
      <ScrollContainer gridSizes={gridSize12()} useShim>
        {archiveCategories.map((archiveCategory, i) => (
          <ListItem key={archiveCategory.id} $cols={3} $usesShim>
            <ArchiveCategoryCard
              archiveCategory={archiveCategory}
              dataGtmProps={{
                'category-label': 'Other types of archives',
                'position-in-list': `${i + 1}`,
              }}
            />
          </ListItem>
        ))}
      </ScrollContainer>
    </Space>
  );
};

export default OtherArchiveCategories;
