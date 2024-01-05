import { CloudFrontRequest } from 'aws-lambda';

export type ToggleTypes = 'permanent' | 'experimental' | 'test' | 'stage';

type ToggleBase = {
  id: string;
  title: string;
  description: string;
  type: ToggleTypes;
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
  type: 'test';
};

const toggles = {
  // This should probably be called `features` as we have feature toggles, and a/b testing toggles.
  // Toggles of type 'stage' will only be applied on stage
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
      description: 'Use the staging Wellcome APIs',
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
      id: 'aggregationsInSearch',
      title: 'Aggregations in search',
      initialValue: true,
      description:
        'Whether to enable aggregations in search. Aggregations are an expensive part of the query, and they can be temporarily disabled if the API is having performance issues.',
      type: 'permanent',
    },
    {
      id: 'eventsSearch',
      title: 'Add Events to Search pages',
      initialValue: false,
      description:
        'Adds an Events section to the Search hub and a new Events tab for more specific searches',
      type: 'experimental',
    },
    {
      id: 'bornDigitalMessage',
      title: 'Displays whether a work has born digital items or not',
      initialValue: false,
      description:
        'Adds some text to the top of a work page stating whether there are born digital items in the iiif-manifest',
      type: 'experimental',
    },
  ] as const,
  tests: [] as ABTest[],
};

export default toggles;
