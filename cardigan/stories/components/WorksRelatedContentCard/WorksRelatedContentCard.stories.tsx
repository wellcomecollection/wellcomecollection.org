import { Meta, StoryObj } from '@storybook/react';

import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import WorksRelatedContentCard from '@weco/content/components/WorksRelatedContentCard';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';

// Mock WorkBasic data
const mockWorkBasic: WorkBasic = {
  id: 'abc123def',
  title: 'The organization of DNA in chromatin',
  languageId: undefined,
  referenceNumber: 'PP/CRI/D/2/40/1',
  productionDates: ['1976'],
  cardLabels: [
    { text: 'Archives and manuscripts' },
    { text: 'Online', labelColor: 'white' },
  ],
  primaryContributorLabel: 'Francis Crick',
  notes: [
    {
      contents: [
        'A digitised copy is held by Wellcome Collection as part of Codebreakers: Makers of Modern Genetics.',
      ],
      noteType: {
        id: 'location-of-duplicates',
        label: 'Location of duplicates',
        type: 'NoteType',
      },
      type: 'Note',
    },
  ],
  thumbnail: {
    url: 'https://iiif.wellcomecollection.org/thumbs/b21538906_0007.jp2/full/63,100/0/default.jpg',
    license: {
      id: 'cc-by',
      label: 'Attribution 4.0 International (CC BY 4.0)',
      url: 'https://creativecommons.org/licenses/by/4.0/',
      type: 'License',
    },
    accessConditions: [],
    locationType: {
      id: 'thumbnail-image',
      label: 'Thumbnail Image',
      type: 'LocationType',
    },
    type: 'DigitalLocation',
  },
  archiveLabels: {
    reference: 'PP/CRI/D/2/40/1',
    partOf: 'Francis Crick (1916-2004): archives',
  },
};

const meta: Meta<typeof WorksRelatedContentCard> = {
  title: 'Components/WorksRelatedContentCard',
  component: () => {
    return (
      <Grid>
        <GridCell $sizeMap={{ s: [12], m: [6], l: [6], xl: [4] }}>
          <WorksRelatedContentCard work={mockWorkBasic} resultIndex={0} />
        </GridCell>
        <GridCell $sizeMap={{ s: [12], m: [6], l: [6], xl: [4] }}>
          <WorksRelatedContentCard work={mockWorkBasic} resultIndex={1} />
        </GridCell>
        <GridCell $sizeMap={{ s: [12], m: [6], l: [6], xl: [4] }}>
          <WorksRelatedContentCard work={mockWorkBasic} resultIndex={2} />
        </GridCell>
      </Grid>
    );
  },
  args: {
    work: mockWorkBasic,
    resultIndex: 0,
  },
};

export default meta;

type Story = StoryObj<typeof WorksRelatedContentCard>;

export const Basic: Story = {
  name: 'WorksRelatedContentCard',
  args: {
    work: mockWorkBasic,
    resultIndex: 0,
  },
};
