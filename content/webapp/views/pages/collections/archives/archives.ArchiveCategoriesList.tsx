import { useTheme } from 'styled-components';

import { pluralize } from '@weco/common/utils/grammar';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import ThemeCard from '@weco/common/views/components/ThemeCard';
import { PaletteColor } from '@weco/common/views/themes/config';
import type { ConceptImagesArray } from '@weco/content/hooks/useConceptImageUrls';
import type { ArchiveCategory } from '@weco/content/services/wellcome/catalogue/archiveCategories';

// Cycled through, by index, for archive categories with no real image yet
// (see ARCHIVE_CATEGORY_IMAGES in archiveCategories.ts)
const PLACEHOLDER_COLOURS: PaletteColor[] = [
  'accent.green',
  'accent.blue',
  'accent.salmon',
  'accent.purple',
  'accent.turquoise',
  'accent.lightGreen',
  'accent.lightBlue',
  'accent.lightSalmon',
  'accent.lightPurple',
  'accent.lightTurquoise',
];

// Matching bg/fg colours hide placehold.co's default size-label text,
// leaving a plain solid block.
const placeholderImageUrl = (hexColour: string): string => {
  const hex = hexColour.replace('#', '');
  return `https://placehold.co/400x600/${hex}/${hex}.svg`;
};

const ArchiveCategoriesList = ({
  archiveCategories,
}: {
  archiveCategories: ArchiveCategory[];
}) => {
  const theme = useTheme();

  return (
    <Container>
      <Space $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}>
        <Grid>
          {archiveCategories.map((archiveCategory, index) => {
            // The eventual real image will be a composite made of 4 combined
            // photos, so match that shape with 4 placeholder colours
            const images: ConceptImagesArray = archiveCategory.image
              ? [archiveCategory.image, undefined, undefined, undefined]
              : (Array.from({ length: 4 }, (_, slot) =>
                  placeholderImageUrl(
                    theme.color(
                      PLACEHOLDER_COLOURS[
                        (index * 4 + slot) % PLACEHOLDER_COLOURS.length
                      ]
                    )
                  )
                ) as ConceptImagesArray);

            return (
              <GridCell
                key={archiveCategory.id}
                $sizeMap={{ s: [12], m: [6], l: [4], xl: [3] }}
              >
                <ThemeCard
                  images={images}
                  title={`${archiveCategory.label} (${archiveCategory.id})`}
                  description={`${archiveCategory.description} ${pluralize(archiveCategory.count, 'archive')}.`}
                  linkProps={{ href: { pathname: '/' } }}
                  dataGtmProps={{
                    trigger: 'theme_promo_card',
                    id: archiveCategory.id,
                    'category-label': 'Archives',
                  }}
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
