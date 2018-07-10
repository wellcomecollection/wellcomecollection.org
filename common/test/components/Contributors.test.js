import {getContributorsTitle} from '../../views/components/Contributors/Contributors';

const facilitator = {
  role: {
    title: 'Facilitator'
  }
};

const guide = {
  role: {
    title: 'Guide'
  }
};

const speaker = {
  role: {
    title: 'Speaker'
  }
};

test('1 contributor, 1 role', async () => {
  const title = getContributorsTitle([facilitator], 'About the', false);

  expect(title).toBe('About the facilitator');
});

test('multi contributor, 1 role', async () => {
  const title = getContributorsTitle([
    facilitator,
    facilitator
  ], 'About the', false);

  expect(title).toBe('About the facilitators');
});

test('multi contributor, multi role', async () => {
  const title = getContributorsTitle([
    facilitator,
    guide,
    speaker
  ], 'About the', false);

  expect(title).toBe('About the facilitator, guide and speaker');
});

test('multi contributor, multi role, roles matching', async () => {
  const title = getContributorsTitle([
    facilitator,
    guide,
    guide,
    speaker
  ], 'About the', false);

  expect(title).toBe('About the facilitator, guides and speaker');
});

test('multi contributor, multi roles, flattened', async () => {
  const title = getContributorsTitle([
    facilitator,
    guide,
    guide,
    speaker
  ], 'About the', true);

  expect(title).toBe('About the contributors');
});

test('multi contributor, single roles, flattened', async () => {
  const title = getContributorsTitle([
    guide,
    guide
  ], 'About your', true);

  expect(title).toBe('About your guides');
});
