import Contributors, { dedupeAndPluraliseRoles } from './Contributors';
import { shallowWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
import { PrismicDocument } from '@prismicio/types';
import { WithContributors } from '../../services/prismic/types';

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
  const title = dedupeAndPluraliseRoles(
    [facilitator, guide, guide, speaker],
    'About the',
    false
  );

  expect(title).toEqual(['Facilitator', 'Guides', 'Speaker']);
});

test('multi contributor, single roles, flattened', async () => {
  const title = dedupeAndPluraliseRoles([guide, guide]);

  expect(title).toEqual(['Guides']);
});

describe('Contributors', () => {
  it('returns nothing if there are no visible contributors', () => {
    // e.g. https://wellcomecollection.org/collections
    const document: PrismicDocument<WithContributors> = {
      id: 'YBfeAhMAACEAqBTx',
      data: {
        contributors: [
          {
            role: { link_type: 'Document' },
            contributor: { link_type: 'Document' },
            description: [],
          },
        ],
        contributorsTitle: [],
      },
    };

    const component = shallowWithTheme(<Contributors document={document} />);

    expect(component.html()).toBe('');
  });
});
