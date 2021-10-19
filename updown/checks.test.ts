import { CheckInterval } from 'node-updown/lib/types/Check';
import { getDeltas } from './utils';

it('flags additions, deletions and updates based on URLs', () => {
  const currentChecks = [
    {
      token: '1',
      url: 'https://wellcomecollection.org',
      alias: 'Wellcome Collection homepage',
      period: 60 as CheckInterval,
    },
    {
      token: '2',
      url: 'https://wellcomecollection.org/stories',
      alias: 'Wellcome Collection articles',
      period: 60 as CheckInterval,
    },
    {
      token: '3',
      url: 'https://wellcomecollection.org/visit-us',
      alias: 'Wellcome Collection visit us',
      period: 60 as CheckInterval,
    },
    {
      token: '4',
      url: 'https://wellcomecollection.org/what-on',
      alias: 'Wellcome Collection whats on',
      period: 60 as CheckInterval,
    },
    // This should be flagged as a deletion
    {
      token: '5',
      url: 'https://wellcomecollection.org/no-longer-needed',
      alias: 'Wellcome Collection no longer needed',
      period: 60 as CheckInterval,
    },
  ];
  const expectedChecks = [
    // Doesn't get flagged if nothing has changed
    {
      url: 'https://wellcomecollection.org',
      alias: 'Wellcome Collection homepage',
      period: 60 as CheckInterval,
    },
    // updates on alias change
    {
      url: 'https://wellcomecollection.org/stories',
      alias: 'Wellcome Collection stories',
      period: 60 as CheckInterval,
    },
    // updates on a period change
    {
      url: 'https://wellcomecollection.org/visit-us',
      alias: 'Wellcome Collection visit us',
      period: 120 as CheckInterval,
    },
    // creates and addition and deletion when a URL changes
    {
      url: 'https://wellcomecollection.org/whats-on',
      alias: 'Wellcome Collection whats on',
      period: 60 as CheckInterval,
    },
    // creates and addition
    {
      url: 'https://wellcomecollection.org/collections',
      alias: 'Wellcome Collection collections',
      period: 60 as CheckInterval,
    },
  ];

  const expectedDeltas = {
    deletions: [
      {
        token: '4',
        url: 'https://wellcomecollection.org/what-on',
        alias: 'Wellcome Collection whats on',
        period: 60 as CheckInterval,
      },
      {
        token: '5',
        url: 'https://wellcomecollection.org/no-longer-needed',
        alias: 'Wellcome Collection no longer needed',
        period: 60 as CheckInterval,
      },
    ],
    updates: [
      {
        token: '2',
        url: 'https://wellcomecollection.org/stories',
        alias: 'Wellcome Collection stories',
        period: 60 as CheckInterval,
      },
      {
        token: '3',
        url: 'https://wellcomecollection.org/visit-us',
        alias: 'Wellcome Collection visit us',
        period: 120 as CheckInterval,
      },
    ],
    additions: [
      {
        url: 'https://wellcomecollection.org/whats-on',
        alias: 'Wellcome Collection whats on',
        period: 60 as CheckInterval,
      },
      {
        url: 'https://wellcomecollection.org/collections',
        alias: 'Wellcome Collection collections',
        period: 60 as CheckInterval,
      },
    ],
  };

  const deltas = getDeltas(currentChecks, expectedChecks);
  expect(deltas).toStrictEqual(expectedDeltas);
});
