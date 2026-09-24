import {
  withDefaultValuesUnmodified,
  withModeDefaultsUnmodified,
} from './deploy';
import {
  FeatureFlagDefinition,
  ModeDefinition,
  PhasedModeDefinition,
  PublishedFeatureFlag,
  PublishedMode,
  PublishedPhasedMode,
} from './toggles';

function getPublishedToggle(id: number): PublishedFeatureFlag {
  return {
    id: `toggle-${id}`,
    title: `title-${id}`,
    description: `description-${id}`,
    defaultValue: true,
    type: 'permanent',
  };
}

function getToggleDefinition(id: number): FeatureFlagDefinition {
  return {
    id: `toggle-${id}`,
    title: `title-${id}`,
    description: `description-${id}`,
    initialValue: true,
    type: 'permanent',
  };
}

it('adds a new toggle definition', () => {
  const remote = [getPublishedToggle(1), getPublishedToggle(2)];
  const definitions = [
    getToggleDefinition(1),
    getToggleDefinition(2),
    getToggleDefinition(3),
  ];
  const newRemote = withDefaultValuesUnmodified(remote, definitions);

  const expected = [
    getPublishedToggle(1),
    getPublishedToggle(2),
    getPublishedToggle(3),
  ];

  expect(newRemote).toStrictEqual(expected);
});

it('drops a toggle no longer in the local definitions', () => {
  const remote = [getPublishedToggle(1)];
  const definitions = [getToggleDefinition(1), getToggleDefinition(3)];

  const newRemote = withDefaultValuesUnmodified(remote, definitions);

  const expected = [getPublishedToggle(1), getPublishedToggle(3)];

  expect(newRemote).toStrictEqual(expected);
});

it('updates existing toggles leaving defaultValue unmodified', () => {
  const remote: PublishedFeatureFlag[] = [
    {
      id: 'id-1',
      title: 'title1',
      description: 'description1',
      defaultValue: true,
      type: 'permanent',
    },
    {
      id: 'id-2',
      title: 'title2',
      description: 'description2',
      defaultValue: true,
      type: 'permanent',
    },
    {
      id: 'id-3',
      title: 'title3',
      description: 'description3',
      defaultValue: true,
      type: 'permanent',
    },
  ];

  const definitions: FeatureFlagDefinition[] = [
    {
      id: 'id-1',
      title: 'updated title1',
      description: 'updated description1',
      initialValue: false,
      type: 'permanent',
    },
    {
      id: 'id-2',
      title: 'updated title2',
      description: 'updated description2',
      initialValue: false,
      type: 'permanent',
    },
    {
      id: 'id-3',
      title: 'title3',
      description: 'description3',
      initialValue: true,
      type: 'permanent',
    },
  ];

  const newRemote = withDefaultValuesUnmodified(remote, definitions);

  const expected: PublishedFeatureFlag[] = [
    {
      id: 'id-1',
      title: 'updated title1',
      description: 'updated description1',
      defaultValue: true,
      type: 'permanent',
    },
    {
      id: 'id-2',
      title: 'updated title2',
      description: 'updated description2',
      defaultValue: true,
      type: 'permanent',
    },
    {
      id: 'id-3',
      title: 'title3',
      description: 'description3',
      defaultValue: true,
      type: 'permanent',
    },
  ];

  expect(newRemote).toStrictEqual(expected);
});

describe('withModeDefaultsUnmodified', () => {
  const phasedMode: PhasedModeDefinition = {
    id: 'phased',
    title: 'Phased',
    description: 'A phased mode',
    type: 'experimental',
    phased: true,
    options: [
      { id: 'mvp', label: 'MVP', description: 'MVP phase' },
      { id: 'phase2', label: 'Phase 2', description: 'Phase 2' },
    ],
  };
  const kioskMode: ModeDefinition = {
    id: 'kiosk',
    title: 'Kiosk',
    description: 'Not phased',
    options: [{ id: 'ipad', label: 'iPad' }],
  };
  const deployPhased = (
    published: PublishedPhasedMode[],
    definition: PhasedModeDefinition = phasedMode
  ) =>
    withModeDefaultsUnmodified(published, [
      definition,
    ])[0] as PublishedPhasedMode;

  it('starts a new phased mode with dateCreated and nothing public', () => {
    const mode = deployPhased([]);

    expect(mode.defaultValue).toBeNull();
    expect(mode.dateCreated).toEqual(expect.any(String));
    expect('dateActivated' in mode).toBe(false);
  });

  it('keeps a published default and its dates across a redeploy', () => {
    const published: PublishedPhasedMode = {
      ...phasedMode,
      defaultValue: 'phase2',
      dateCreated: '2020-01-01T00:00:00.000Z',
      dateActivated: '2020-02-01T00:00:00.000Z',
    };

    expect(
      deployPhased([published], { ...phasedMode, title: 'Updated' })
    ).toStrictEqual({ ...published, title: 'Updated' });
  });

  it('sets dateActivated for a default published without one', () => {
    const mode = deployPhased([{ ...phasedMode, defaultValue: 'mvp' }]);

    expect(mode.dateActivated).toEqual(expect.any(String));
  });

  it('keeps the default but tracks no dates for a non-experimental phased mode', () => {
    const permanent: PhasedModeDefinition = {
      ...phasedMode,
      type: 'permanent',
    };

    expect(
      deployPhased([{ ...permanent, defaultValue: 'mvp' }], permanent)
    ).toStrictEqual({ ...permanent, defaultValue: 'mvp' });
  });

  it('publishes a basic mode as defined, ignoring any stale published fields', () => {
    const stale = {
      ...kioskMode,
      defaultValue: 'ipad',
    } as unknown as PublishedMode;

    expect(withModeDefaultsUnmodified([stale], [kioskMode])).toStrictEqual([
      kioskMode,
    ]);
  });
});
