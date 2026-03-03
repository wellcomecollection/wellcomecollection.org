import { commissioningEditorRoleId } from '@weco/common/data/hardcoded-ids';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { Contributor } from '@weco/content/types/contributors';

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

const defaultImage = {
  width: 64,
  height: 64,
  contentUrl: 'https://example.com/image.png',
  alt: '',
};

function makePerson(name: string): Contributor['contributor'] {
  return {
    type: 'people',
    id: name,
    name,
    image: defaultImage,
    sameAs: [],
  };
}

describe('Contributors', () => {
  it('returns nothing if there are no visible contributors', () => {
    // e.g. https://wellcomecollection.org/collections
    const props: ContributorProps = {
      contributors: [],
    };

    const { container } = renderWithTheme(<Contributors {...props} />);

    expect(container.innerHTML).toBe('');
  });

  it('renders a commissioning editor when passed in the contributors list', () => {
    // Commissioning editors are filtered/sorted by the parent component (ContentPage)
    // before being passed here. This test verifies they render correctly when included.
    const commissioningEditor: Contributor = {
      contributor: makePerson('Jane Smith'),
      role: {
        id: commissioningEditorRoleId,
        title: 'Commissioning editor',
      },
    };

    const props: ContributorProps = {
      contributors: [commissioningEditor],
    };

    const { getByText } = renderWithTheme(<Contributors {...props} />);

    expect(getByText('Jane Smith')).toBeTruthy();
  });
});
