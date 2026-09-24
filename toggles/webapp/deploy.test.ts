import {
  withDefaultValuesUnmodified,
  withModeDefaultsUnmodified,
} from './deploy';
import {
  FeatureFlagDefinition,
  ModeDefinition,
  PublishedFeatureFlag,
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
  const phasedMode: ModeDefinition = {
    id: 'phased',
    title: 'Phased',
    description: 'A phased mode',
    phased: true,
    type: 'experimental',
    options: [
      { id: 'mvp', label: 'MVP' },
      { id: 'phase2', label: 'Phase 2' },
    ],
  };
  const kioskMode: ModeDefinition = {
    id: 'kiosk',
    title: 'Kiosk',
    description: 'Not phased',
    options: [{ id: 'ipad', label: 'iPad' }],
  };

  it('starts a new phased mode with dateCreated and nothing public', () => {
    const [mode] = withModeDefaultsUnmodified([], [phasedMode]);

    expect(mode.dateCreated).toEqual(expect.any(String));
    expect('defaultValue' in mode).toBe(false);
    expect('dateActivated' in mode).toBe(false);
  });

  it('keeps a published default and its dates across a redeploy', () => {
    const published = {
      ...phasedMode,
      defaultValue: 'phase2',
      dateCreated: '2020-01-01T00:00:00.000Z',
      dateActivated: '2020-02-01T00:00:00.000Z',
    };

    expect(
      withModeDefaultsUnmodified(
        [published],
        [{ ...phasedMode, title: 'Updated' }]
      )
    ).toStrictEqual([{ ...published, title: 'Updated' }]);
  });

  it('sets dateActivated for a default published without one', () => {
    const [mode] = withModeDefaultsUnmodified(
      [{ ...phasedMode, defaultValue: 'mvp' }],
      [phasedMode]
    );

    expect(mode.dateActivated).toEqual(expect.any(String));
  });

  it('keeps the default but tracks no dates for a non-experimental phased mode', () => {
    const permanent: ModeDefinition = { ...phasedMode, type: 'permanent' };

    expect(
      withModeDefaultsUnmodified(
        [{ ...permanent, defaultValue: 'mvp' }],
        [permanent]
      )
    ).toStrictEqual([{ ...permanent, defaultValue: 'mvp' }]);
  });

  it('never gives a non-phased mode a default or dates', () => {
    expect(
      withModeDefaultsUnmodified(
        [{ ...kioskMode, defaultValue: 'ipad', dateCreated: 'x' }],
        [kioskMode]
      )
    ).toStrictEqual([kioskMode]);
  });
});
