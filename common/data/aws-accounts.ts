export const awsAccounts = {
  platform: { account: '760097843905' },
  workflow: { account: '299497370133' },
  storage: { account: '975596993436' },
  experience: { account: '130871440101' },
  data: { account: '964279923020' },
  digitisation: { account: '404315009621' },
  reporting: { account: '269807742353' },
  catalogue: { account: '756629837203' },
  identity: { account: '770700576653' },
} as const;

export type AccountName = keyof typeof awsAccounts;

export type AwsAccess = 'read_only' | 'developer' | 'admin';
