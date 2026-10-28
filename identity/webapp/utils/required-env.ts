// config.js and utils/auth0.ts fall back to placeholders so `next build` works
// without secrets; a deployed server must never run on those placeholders.
const requiredEnvVars = [
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_ACTION_SECRET',
  'SESSION_KEYS',
  'IDENTITY_API_HOST',
  'IDENTITY_API_KEY',
] as const;

export function missingRequiredEnvVars(
  env: Record<string, string | undefined>
): string[] {
  return requiredEnvVars.filter(name => !env[name]);
}
