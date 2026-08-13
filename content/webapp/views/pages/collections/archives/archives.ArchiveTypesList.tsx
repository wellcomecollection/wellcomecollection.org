import { useTheme } from 'styled-components';

import { pluralize } from '@weco/common/utils/grammar';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import ThemeCard from '@weco/common/views/components/ThemeCard';
import { PaletteColor } from '@weco/common/views/themes/config';
import type { ConceptImagesArray } from '@weco/content/hooks/useConceptImageUrls';
import type { ArchiveType } from '@weco/content/services/wellcome/catalogue/archiveTypes';

// Cycled through, by index, for archive types with no real image yet (see
// ARCHIVE_TYPE_IMAGES in archiveTypes.ts)
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

const solidColourImage = (hexColour: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="${hexColour}"/></svg>`
  )}`;

const ArchiveTypesList = ({
  archiveTypes,
}: {
  archiveTypes: ArchiveType[];
}) => {
  const theme = useTheme();

  return (
    <Container>
      <Space $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}>
        <Grid>
          {archiveTypes.map((archiveType, index) => {
            // The eventual real image will be a composite made of 4 combined
            // photos, so match that shape with 4 placeholder colours
            const images: ConceptImagesArray = archiveType.image
              ? [archiveType.image, undefined, undefined, undefined]
              : (Array.from({ length: 4 }, (_, slot) =>
                  solidColourImage(
                    theme.color(
                      PLACEHOLDER_COLOURS[
                        (index * 4 + slot) % PLACEHOLDER_COLOURS.length
                      ]
                    )
                  )
                ) as ConceptImagesArray);

            return (
              <GridCell
                key={archiveType.id}
                $sizeMap={{ s: [12], m: [6], l: [4], xl: [3] }}
              >
                <ThemeCard
                  images={images}
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
            );
          })}
        </Grid>
      </Space>
    </Container>
  );
};

export default ArchiveTypesList;
