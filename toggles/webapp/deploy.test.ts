import { withDefaultValuesUnmodified } from './deploy';
import { PublishedToggle, ToggleDefinition } from './toggles';

function getPublishedToggle(id: number): PublishedToggle {
  return {
    id: `toggle-${id}`,
    title: `title-${id}`,
    description: `description-${id}`,
    defaultValue: true,
    type: 'permanent',
  };
}

function getToggleDefinition(id: number): ToggleDefinition {
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

it('removes tests', () => {
  const remote = [getPublishedToggle(1)];
  const definitions = [getToggleDefinition(1), getToggleDefinition(3)];

  const newRemote = withDefaultValuesUnmodified(remote, definitions);

  const expected = [getPublishedToggle(1), getPublishedToggle(3)];

  expect(newRemote).toStrictEqual(expected);
});

it('updates existing toggles leaving defaultValue unmodified', () => {
  const remote: PublishedToggle[] = [
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

  const definitions: ToggleDefinition[] = [
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

  const expected = [
    {
      id: 'id-1',
      title: 'updated title1',
      description: 'updated description1',
      defaultValue: true,
    },
    {
      id: 'id-2',
      title: 'updated title2',
      description: 'updated description2',
      defaultValue: true,
    },
    {
      id: 'id-3',
      title: 'title3',
      description: 'description3',
      defaultValue: true,
    },
  ];

  expect(newRemote).toStrictEqual(expected);
});
