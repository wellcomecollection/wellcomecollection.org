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
      id: 'aggregationsInSearch',
      title: 'Aggregations in search',
      initialValue: true,
      description: 'Whether to enable aggregations in search. Aggregations are an expensive part of the query, and they can be temporarily disabled if the API is having performance issues.',
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
      id: 'visualStories',
      title: 'Visual Stories Prototype',
      initialValue: false,
      description: 'Allows access to visual stories pages.',
      type: 'experimental',
    },
    {
      id: 'polly',
      title: 'Text-to-speech Amazon Polly',
      initialValue: false,
      description:
        'Displays an audio player with text-to-speech audio on selected articles',
      type: 'experimental',
    },
  ] as const,
  tests: [] as ABTest[],
};

export default toggles;
