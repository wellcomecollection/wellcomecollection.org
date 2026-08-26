import { pluralize } from '@weco/common/utils/grammar';
import ImageGridCard from '@weco/common/views/components/ImageGridCard';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import type { ConceptImagesArray } from '@weco/content/hooks/useConceptImageUrls';
import type { ArchiveCategory } from '@weco/content/services/wellcome/catalogue/archiveCategories';

const ArchiveCategoriesList = ({
  archiveCategories,
}: {
  archiveCategories: ArchiveCategory[];
}) => {
  return (
    <Container>
      <Space $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}>
        <Grid>
          {archiveCategories.map(archiveCategory => {
            // The eventual real image will be a composite made of 4 combined
            // photos. Until then, ImageGridCard fills any empty slot with a
            // placeholder colour block itself.
            const images: ConceptImagesArray = [
              archiveCategory.image,
              undefined,
              undefined,
              undefined,
            ];

            return (
              <GridCell
                key={archiveCategory.id}
                $sizeMap={{ s: [12], m: [6], l: [4], xl: [3] }}
              >
                <ImageGridCard
                  images={images}
                  title={`${archiveCategory.label} (${archiveCategory.id})`}
                  description={`${archiveCategory.description} ${pluralize(archiveCategory.count, 'archive')}.`}
                  linkProps={{ href: { pathname: '/' } }}
                />
              </GridCell>
            );
          })}
        </Grid>
      </Space>
    </Container>
  );
};

export default ArchiveCategoriesList;
