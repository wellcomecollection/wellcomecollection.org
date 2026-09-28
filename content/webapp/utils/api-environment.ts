import { useModes } from '@weco/common/server-data/Context';
import { ApiEnvironmentOverride } from '@weco/content/services/wellcome';
import { Toggles } from '@weco/toggles';

/** Resolves which API environment to use from the `apiEnvironment` mode. */
export function resolveApiEnvironment(
  toggles: Pick<Toggles, 'modes'>
): ApiEnvironmentOverride | undefined {
  const mode = toggles.modes.apiEnvironment;
  return mode === 'stage' || mode === 'dev' ? mode : undefined;
}

/** Client-side equivalent of `resolveApiEnvironment(serverData.toggles)`. */
export function useApiEnvironment(): ApiEnvironmentOverride | undefined {
  const modes = useModes();
  return resolveApiEnvironment({ modes });
}
