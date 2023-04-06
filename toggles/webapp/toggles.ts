import { CloudFrontRequest } from 'aws-lambda';

type ToggleBase = {
  id: string;
  title: string;
  description: string;
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
    },
    {
      id: 'stagingApi',
      title: 'Staging API',
      initialValue: false,
      description: 'Use the staging catalogue API',
    },
    {
      id: 'apiToolbar',
      title: 'API toolbar',
      initialValue: false,
      description: 'A toolbar to help us navigate the secret depths of the API',
    },
    {
      id: 'worksTabbedNav',
      title: 'Works page: Tabbed navigation',
      initialValue: false,
      description:
        'Adds tabbed navigation to the works page, for switching between work, item and related content',
    },
    {
      id: 'contentApi',
      title: 'Stories search: Content API',
      initialValue: false,
      description:
        "Has stories search use the Content API instead of Prismic's API.",
    },
  ] as const,
  tests: [
    {
      id: 'comicTest1',
      title:
        'A/B test linking to series pages or individual comics from last three series',
      range: [0, 99],
      when: () => true,
    },
  ] as ABTest[],
};

export default toggles;
