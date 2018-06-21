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
  const title = getContributorsTitle([facilitator]);

  expect(title).toBe('facilitator');
});

test('multi contributor, 1 role', async () => {
  const title = getContributorsTitle([
    facilitator,
    facilitator
  ]);

  expect(title).toBe('facilitators');
});

test('multi contributor, multi role', async () => {
  const title = getContributorsTitle([
    facilitator,
    guide,
    speaker
  ]);

  expect(title).toBe('facilitator, guide and speaker');
});

test('multi contributor, multi role, roles matching', async () => {
  const title = getContributorsTitle([
    facilitator,
    guide,
    guide,
    speaker
  ]);

  expect(title).toBe('facilitator, guides and speaker');
});
