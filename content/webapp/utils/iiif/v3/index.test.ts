import { Manifest } from '@iiif/presentation-3';

import { ServiceWithMetadata } from '@weco/content/types/manifest';

import { getManifestAccessRequirements, transformLabel } from '.';

function createTestManifest(overrides: Partial<Manifest> = {}): Manifest {
  return {
    '@context': 'http://iiif.io/api/presentation/3/context.json',
    id: 'https://example.com/manifest',
    type: 'Manifest',
    label: {},
    summary: {},
    homepage: [],
    metadata: [],
    provider: [],
    seeAlso: [],
    services: [],
    items: [],
    partOf: [],
    ...overrides,
  };
}

describe('transformLabel', () => {
  test.each([
    {
      label: { en: ['Foundations for moral relativism / J. David Velleman.'] },
      expected: 'Foundations for moral relativism / J. David Velleman.',
    },
    { label: { none: ['-'] }, expected: undefined },
    { label: undefined, expected: undefined },
    {
      label: 'Foundations for moral relativism / J. David Velleman.',
      expected: 'Foundations for moral relativism / J. David Velleman.',
    },
  ])('the transformed label from $label is $expected', ({ label, expected }) =>
    expect(transformLabel(label)).toBe(expected)
  );
});

describe('getManifestAccessRequirements', () => {
  it('returns ["Restricted files"] for manifest with restricted access', () => {
    const manifest = createTestManifest({
      services: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/PPDBL/B/14#accesscontrolhints',
          type: 'Text',
          profile:
            'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
          label: {
            en: ['credentials'],
          },
          metadata: [
            {
              label: {
                en: ['Restricted files'],
              },
              value: {
                none: ['6'],
              },
            },
          ],
        } as unknown as ServiceWithMetadata,
      ],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Restricted files']);
  });

  it('returns ["Open"] for manifest with open access', () => {
    const manifest = createTestManifest({
      services: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/SASRH/B/41/2#accesscontrolhints',
          type: 'Text',
          profile:
            'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
          label: {
            en: ['open'],
          },
          metadata: [
            {
              label: {
                en: ['Open'],
              },
              value: {
                none: ['67'],
              },
            },
          ],
        } as unknown as ServiceWithMetadata,
      ],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Open']);
  });

  it('returns ["Open"] for manifest with no access control metadata', () => {
    const manifest = createTestManifest({
      services: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b29823547#accesscontrolhints',
          type: 'Text',
          profile:
            'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
          label: {
            en: ['open'],
          },
        } as unknown as ServiceWithMetadata,
      ],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Open']);
  });

  it('returns ["Open"] for manifest with no services', () => {
    const manifest = createTestManifest({
      services: [],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Open']);
  });

  it('returns ["Open with advisory"] for manifest with advisory access', () => {
    const manifest = createTestManifest({
      services: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/example#accesscontrolhints',
          type: 'Text',
          profile:
            'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
          label: {
            en: ['clickthrough'],
          },
          metadata: [
            {
              label: {
                en: ['Open with advisory'],
              },
              value: {
                none: ['123'],
              },
            },
          ],
        } as unknown as ServiceWithMetadata,
      ],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Open with advisory']);
  });

  it('returns all access requirements when multiple are present', () => {
    const manifest = createTestManifest({
      services: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/example1#accesscontrolhints',
          type: 'Text',
          profile:
            'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
          label: {
            en: ['credentials'],
          },
          metadata: [
            {
              label: {
                en: ['Restricted files'],
              },
              value: {
                none: ['6'],
              },
            },
            {
              label: {
                en: ['Open with advisory'],
              },
              value: {
                none: ['123'],
              },
            },
            {
              label: {
                en: ['Open'],
              },
              value: {
                none: ['67'],
              },
            },
          ],
        } as unknown as ServiceWithMetadata,
      ],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Restricted files', 'Open with advisory', 'Open']);
  });
});
