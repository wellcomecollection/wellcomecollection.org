import { CloudFrontRequest } from 'aws-lambda';

type ToggleBase = {
  id: string;
  title: string;
  description: string;
  type: 'permanent' | 'experimental';
};

export type ToggleDefinition = ToggleBase & {
  initialValue: boolean;
};

export type PublishedToggle = ToggleBase & {
  defaultValue: boolean;
};

export type ABTest = {
  id: string;
  title: string;
  range: [number, number];
  when: (request: CloudFrontRequest) => boolean;
};

const toggles = {
  // This should probably be called `features` as we have feature toggles, and a/b testing toggles.
  toggles: [
    {
      id: 'disableRequesting',
      title: 'Disables requesting functionality',
      description:
        'Replaces the "sign into your library account to request items" message, with "requesting is currently unavailable". Adds a note to say when requesting will be available again.' +
        'See documentation link (tbc).',
      initialValue: false,
      type: 'permanent',
    },
    {
      id: 'stagingApi',
      title: 'Staging API',
      initialValue: false,
      description: 'Use the staging catalogue API',
      type: 'permanent',
    },
    {
      id: 'apiToolbar',
      title: 'API toolbar',
      initialValue: false,
      description: 'A toolbar to help us navigate the secret depths of the API',
      type: 'permanent',
    },
    {
      id: 'worksTabbedNav',
      title: 'Works page: Tabbed navigation',
      initialValue: false,
      description:
        'Adds tabbed navigation to the works page, for switching between work, item and related content',
      type: 'experimental',
    },
    {
      id: 'useIIIFTest',
      title: 'Use iiif-test.wellcomecollection.org for IIIF URLs',
      initialValue: false,
      description:
        'Fetch IIIF manifests from iiif-test.wellcomecollection.org for new DLCS testing.',
      type: 'experimental',
    },
    {
      id: 'visualStories',
      title: 'Visual Stories Prototype',
      initialValue: false,
      description: 'Allows access to visual stories pages.',
      type: 'experimental',
    },
  ] as const,
  tests: [] as ABTest[],
};

export default toggles;
