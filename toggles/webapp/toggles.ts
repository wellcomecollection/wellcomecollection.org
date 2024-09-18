import { CloudFrontRequest } from 'aws-lambda';

export type ToggleTypes = 'permanent' | 'experimental' | 'test' | 'stage';

type ToggleBase = {
  id: string;
  title: string;
  description: string;
  type: ToggleTypes;
  documentationLink?: string;
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
      id: 'apiToolbar',
      title: 'API toolbar',
      initialValue: false,
      description: 'A toolbar to help us navigate the secret depths of the API',
      type: 'permanent',
    },
    {
      id: 'disableRequesting',
      title: 'Disables requesting functionality',
      description:
        'Replaces the "sign into your library account to request items" message, with "requesting is currently unavailable". Adds a note to say when requesting will be available again.',
      documentationLink:
        'https://app.gitbook.com/o/-LumfFcEMKx4gYXKAZTQ/s/mNeKBZYcfnVQtLDYvJ5T/turn-off-requesting',
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
      id: 'aggregationsInSearch',
      title: 'Aggregations in search',
      initialValue: true,
      description:
        'Whether to enable aggregations in search. Aggregations are an expensive part of the query, and they can be temporarily disabled if the API is having performance issues.',
      type: 'permanent',
    },
    {
      id: 'issuesBanner',
      title: 'Banner for issues across the website',
      initialValue: false,
      description:
        "Banner to display publicly when we're experiencing issues across the website that will take longer to fix or are out of our control.",
      type: 'permanent',
    },
    {
      id: 'prismicStage',
      title: 'Use Prismic stage environment content',
      initialValue: false,
      description:
        "Makes all content queries to the Prismic stage environment instead of production. Useful for testing model changes or previewing landing page changes that wouldn't be possible with standard Prismic preview.",
      type: 'permanent',
    },
    {
      id: 'showBornDigital',
      title: 'Display born digital files',
      initialValue: false,
      description:
        'If there are born digital items in the iiif-manifest, then links to all the files in the manifest are shown on the works page.',
      type: 'experimental',
    },
    {
      id: 'egWork',
      title: 'Exhibition Guides redesign/restructure work',
      initialValue: false,
      description:
        'With this activated, you will be able to see the new (and work in progress) versions of exhibition guides',
      type: 'experimental',
    },
    {
      id: 'authV2',
      title: 'IIIF Auth V2',
      initialValue: false,
      description:
        'Will make use of the V2 auth services in the IIIF Presentation manifest, if they are available',
      type: 'experimental',
    },
  ] as const,
  tests: [] as ABTest[],
};

export default toggles;
