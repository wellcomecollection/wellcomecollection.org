import { withDefaultValuesUnmodified } from './deploy';
import { Toggle } from './toggles';

const remote: Toggle[] = [
  {
    id: 'toggle1',
    title: 'title1',
    description: 'description1',
    defaultValue: true,
  },
  {
    id: 'toggle2',
    title: 'title2',
    description: 'description2',
    defaultValue: false,
  },
];

it('adds tests', () => {
  const expected = [
    remote[0],
    remote[1],
    {
      id: 'toggle3',
      title: 'title3',
      description: 'description3',
      defaultValue: true,
    },
  ];
  const newRemote = withDefaultValuesUnmodified(remote, expected);

  expect(newRemote).toStrictEqual(expected);
});

it('removes tests', () => {
  const expected = [
    remote[0],
    {
      id: 'toggle3',
      title: 'title3',
      description: 'description3',
      defaultValue: true,
    },
  ];
  const newRemote = withDefaultValuesUnmodified(remote, expected);

  expect(newRemote).toStrictEqual(expected);
});

it('updates existing toggles leaving defaultValue unmodified', () => {
  const updated = [
    {
      id: remote[0].id,
      title: 'updated title1',
      description: 'updated description1',
      defaultValue: !remote[0].defaultValue,
    },
    {
      id: remote[1].id,
      title: 'updated title2',
      description: 'updated description2',
      defaultValue: !remote[1].defaultValue,
    },
    {
      id: 'toggle3',
      title: 'title3',
      description: 'description3',
      defaultValue: true,
    },
  ];

  const expected = [
    {
      ...updated[0],
      defaultValue: remote[0].defaultValue,
    },
    {
      ...updated[1],
      defaultValue: remote[1].defaultValue,
    },
    updated[2],
  ];

  const newRemote = withDefaultValuesUnmodified(remote, updated);

  expect(newRemote).toStrictEqual(expected);
});
