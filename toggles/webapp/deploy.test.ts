import {
  withDefaultPhaseUnmodified,
  withDefaultValuesUnmodified,
} from './deploy';
import {
  FeatureFlagDefinition,
  PhasedFlagDefinition,
  PublishedFeatureFlag,
  PublishedPhasedFlag,
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

describe('withDefaultPhaseUnmodified', () => {
  const phases = [
    { id: 'mvp', label: 'MVP', description: 'mvp phase' },
    { id: 'phase2', label: 'Phase 2', description: 'phase2 phase' },
  ];

  function getPhasedFlagDefinition(id: number): PhasedFlagDefinition {
    return {
      id: `flag-${id}`,
      title: `title-${id}`,
      description: `description-${id}`,
      type: 'permanent',
      phases,
    };
  }

  function getPublishedPhasedFlag(
    id: number,
    defaultPhase: string | null
  ): PublishedPhasedFlag {
    return {
      id: `flag-${id}`,
      title: `title-${id}`,
      description: `description-${id}`,
      type: 'permanent',
      phases,
      defaultPhase,
    };
  }

  it('starts a new phased flag with defaultPhase null', () => {
    const newRemote = withDefaultPhaseUnmodified(
      [],
      [getPhasedFlagDefinition(1)]
    );

    expect(newRemote).toStrictEqual([getPublishedPhasedFlag(1, null)]);
  });

  it('preserves an existing defaultPhase across a redeploy', () => {
    const remote = [getPublishedPhasedFlag(1, 'phase2')];
    const definitions = [
      {
        ...getPhasedFlagDefinition(1),
        title: 'updated title',
        description: 'updated description',
      },
    ];

    const newRemote = withDefaultPhaseUnmodified(remote, definitions);

    expect(newRemote).toStrictEqual([
      {
        ...getPublishedPhasedFlag(1, 'phase2'),
        title: 'updated title',
        description: 'updated description',
      },
    ]);
  });

  it('drops a phased flag no longer in the local definitions', () => {
    const remote = [
      getPublishedPhasedFlag(1, 'mvp'),
      getPublishedPhasedFlag(2, 'mvp'),
    ];
    const definitions = [getPhasedFlagDefinition(1)];

    const newRemote = withDefaultPhaseUnmodified(remote, definitions);

    expect(newRemote).toStrictEqual([getPublishedPhasedFlag(1, 'mvp')]);
  });

  it('keeps a defaultPhase that no longer matches any phase, without crashing', () => {
    const remote = [getPublishedPhasedFlag(1, 'removedPhase')];
    const definitions = [getPhasedFlagDefinition(1)];

    const newRemote = withDefaultPhaseUnmodified(remote, definitions);

    expect(newRemote).toStrictEqual([
      getPublishedPhasedFlag(1, 'removedPhase'),
    ]);
  });

  it('sets dateCreated but omits dateActivated while nothing is public', () => {
    const newRemote = withDefaultPhaseUnmodified(
      [],
      [{ ...getPhasedFlagDefinition(1), type: 'experimental' }]
    );

    expect(newRemote[0].dateCreated).toEqual(expect.any(String));
    expect('dateActivated' in newRemote[0]).toBe(false);
  });

  it('sets dateActivated once a phase becomes the default', () => {
    const remote: PublishedPhasedFlag[] = [
      {
        ...getPublishedPhasedFlag(1, 'mvp'),
        type: 'experimental',
        dateCreated: '2020-01-01T00:00:00.000Z',
      },
    ];
    const definitions: PhasedFlagDefinition[] = [
      { ...getPhasedFlagDefinition(1), type: 'experimental' },
    ];

    const newRemote = withDefaultPhaseUnmodified(remote, definitions);

    expect(newRemote[0].dateCreated).toBe('2020-01-01T00:00:00.000Z');
    expect(newRemote[0].dateActivated).toEqual(expect.any(String));
  });

  it('omits dateCreated and dateActivated entirely for a non-experimental flag', () => {
    const newRemote = withDefaultPhaseUnmodified(
      [],
      [getPhasedFlagDefinition(1)]
    );

    expect('dateCreated' in newRemote[0]).toBe(false);
    expect('dateActivated' in newRemote[0]).toBe(false);
  });
});
