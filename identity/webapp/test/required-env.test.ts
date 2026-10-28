import { missingRequiredEnvVars } from '@weco/identity/utils/required-env';

const completeEnv = {
  AUTH0_DOMAIN: 'auth.example.com',
  AUTH0_CLIENT_ID: 'test-client-id',
  AUTH0_CLIENT_SECRET: 'test-client-secret',
  AUTH0_ACTION_SECRET: 'test-action-secret',
  SESSION_KEYS: 'test-session-key',
  IDENTITY_API_HOST: 'https://api.example.com',
  IDENTITY_API_KEY: 'test-api-key',
};

describe('missingRequiredEnvVars', () => {
  it('returns nothing when every variable is set', () => {
    expect(missingRequiredEnvVars(completeEnv)).toEqual([]);
  });

  it('names variables that are unset or empty', () => {
    expect(
      missingRequiredEnvVars({
        ...completeEnv,
        SESSION_KEYS: undefined,
        AUTH0_CLIENT_SECRET: '',
      })
    ).toEqual(['AUTH0_CLIENT_SECRET', 'SESSION_KEYS']);
  });
});
