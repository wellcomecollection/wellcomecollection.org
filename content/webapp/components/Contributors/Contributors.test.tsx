import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import Contributors, {
  Props as ContributorProps,
  dedupeAndPluraliseRoles,
} from '.';

const facilitator = 'Facilitator';
const guide = 'Guide';
const speaker = 'Speaker';

test('multi contributor, 1 role', async () => {
  const title = dedupeAndPluraliseRoles([facilitator, facilitator]);

  expect(title).toEqual(['Facilitators']);
});

test('multi contributor, multi role', async () => {
  const title = dedupeAndPluraliseRoles([facilitator, guide, speaker]);

  expect(title).toEqual(['Facilitator', 'Guide', 'Speaker']);
});

test('multi contributor, multi role, roles matching', async () => {
  const title = dedupeAndPluraliseRoles([facilitator, guide, guide, speaker]);

  expect(title).toEqual(['Facilitator', 'Guides', 'Speaker']);
});

test('multi contributor, single roles, flattened', async () => {
  const title = dedupeAndPluraliseRoles([guide, guide]);

  expect(title).toEqual(['Guides']);
});

describe('Contributors', () => {
  it('returns nothing if there are no visible contributors', () => {
    // e.g. https://wellcomecollection.org/collections
    const props: ContributorProps = {
      contributors: [],
    };

    const { container } = renderWithTheme(<Contributors {...props} />);

    expect(container.innerHTML).toBe('');
  });
});
