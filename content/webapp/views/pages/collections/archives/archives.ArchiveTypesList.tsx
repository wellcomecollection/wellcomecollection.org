import { pluralize } from '@weco/common/utils/grammar';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import ThemeCard from '@weco/common/views/components/ThemeCard';
import type { ConceptImagesArray } from '@weco/content/hooks/useConceptImageUrls';
import type { ArchiveType } from '@weco/content/services/wellcome/catalogue/archiveTypes';

// No images or per-type destination exist for archive types yet, so each
// card renders with placeholder image slots and links to the homepage -
// swap both out once that work exists.
const noImages: ConceptImagesArray = [
  undefined,
  undefined,
  undefined,
  undefined,
];

const ArchiveTypesList = ({
  archiveTypes,
}: {
  archiveTypes: ArchiveType[];
}) => {
  return (
    <Container>
      <Space $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}>
        <Grid>
          {archiveTypes.map(archiveType => (
            <GridCell
              key={archiveType.id}
              $sizeMap={{ s: [12], m: [6], l: [4], xl: [3] }}
            >
              <ThemeCard
                images={noImages}
                title={`${archiveType.label} (${archiveType.id})`}
                description={`${archiveType.description} ${pluralize(archiveType.count, 'archive')}.`}
                linkProps={{ href: { pathname: '/' } }}
                dataGtmProps={{
                  trigger: 'theme_promo_card',
                  id: archiveType.id,
                  'category-label': 'Archives',
                }}
              />
            </GridCell>
          ))}
        </Grid>
      </Space>
    </Container>
  );
};

export default ArchiveTypesList;
