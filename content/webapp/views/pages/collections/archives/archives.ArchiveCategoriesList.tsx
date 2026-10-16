import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import { pluralize } from '@weco/common/utils/grammar';
import ImageGridCard from '@weco/common/views/components/ImageGridCard';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import type { ArchiveCategory } from '@weco/content/services/wellcome/catalogue/archiveCategories';
import MoreLink from '@weco/content/views/components/MoreLink';
import { toSearchWorksLink } from '@weco/content/views/components/SearchPagesLink/Works';

const Title = styled.h2.attrs({
  className: typography('heading', 'xl', 'strong', 'sans'),
})`
  margin-bottom: 0;
`;

const Total = styled(Space).attrs({
  as: 'p',
  className: typography('body', 'sm', 'regular'),
  $v: { size: 'xs', properties: ['margin-top'] },
})`
  margin-bottom: 0;
  color: ${props => props.theme.color('neutral.600')};
`;

const ArchiveCategoriesList = ({
  archiveCategories,
}: {
  archiveCategories: ArchiveCategory[];
}) => {
  const total = archiveCategories.reduce(
    (sum, archiveCategory) => sum + archiveCategory.count,
    0
  );

  return (
    <Container>
      <Space $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}>
        <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
          <Title>Types of archives</Title>
          <Total>{pluralize(total, 'archive collection')}</Total>
        </Space>
        <Grid>
          {archiveCategories.map(archiveCategory => (
            <GridCell
              key={archiveCategory.id}
              $sizeMap={{ s: [12], m: [6], l: [4], xl: [3] }}
            >
              <ImageGridCard
                images={[archiveCategory.image]}
                title={`${archiveCategory.label} (${archiveCategory.id})`}
                description={archiveCategory.shortDescription}
                meta={pluralize(archiveCategory.count, 'archive collection')}
                linkProps={{
                  href: {
                    pathname: `/collections/archives/${archiveCategory.slug}`,
                  },
                }}
                dataGtmProps={{
                  trigger: 'theme_promo_card',
                  id: archiveCategory.id,
                  'category-label': 'Archives',
                }}
                hasPlainPlaceholder
              />
            </GridCell>
          ))}
        </Grid>
        <Space $v={{ size: 'md', properties: ['margin-top'] }}>
          <MoreLink
            name="Browse all archives"
            url={toSearchWorksLink({ workType: ['h', 'b', 'hdig'] })}
          />
        </Space>
      </Space>
    </Container>
  );
};

export default ArchiveCategoriesList;
