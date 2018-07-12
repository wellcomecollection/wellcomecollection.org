import {
  dedupeAndPluraliseRoles
} from '../../views/components/Contributors/Contributors';

const facilitator = 'Facilitator';
const guide = 'Guide';
const speaker = 'Speaker';

// test('dedupe and pluralise', () => {
//   // console.info(dedupeAndPluraliseRoles(['Guide', 'Guide', 'Facilitator']));
// });

// test('1 contributor, 1 role', async () => {
//   const title = dedupeAndPluraliseRoles([facilitator], 'About the', false);

//   expect(title).toBe('About the facilitator');
// });

test('multi contributor, 1 role', async () => {
  const title = dedupeAndPluraliseRoles([
    facilitator,
    facilitator
  ]);

  expect(title).toEqual(['Facilitators']);
});

test('multi contributor, multi role', async () => {
  const title = dedupeAndPluraliseRoles([
    facilitator,
    guide,
    speaker
  ]);

  expect(title).toEqual(['Facilitator', 'Guide', 'Speaker']);
});

test('multi contributor, multi role, roles matching', async () => {
  const title = dedupeAndPluraliseRoles([
    facilitator,
    guide,
    guide,
    speaker
  ], 'About the', false);

  expect(title).toEqual(['Facilitator', 'Guides', 'Speaker']);
});

test('multi contributor, single roles, flattened', async () => {
  const title = dedupeAndPluraliseRoles([
    guide,
    guide
  ]);

  expect(title).toEqual(['Guides']);
});
