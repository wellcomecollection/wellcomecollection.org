import { format } from 'util';

const ACCESS_TOKEN = /access_token=[^&'"\s]+/g;

export const redactAccessTokens = (text: string): string =>
  text.replace(ACCESS_TOKEN, 'access_token=[redacted]');

// For an APM error filter: APM sends an error's own fields too
export const redactAccessTokensFromPayload = <Payload>(
  payload: Payload
): Payload => JSON.parse(redactAccessTokens(JSON.stringify(payload)));

/**
 * Prismic's client puts our access token in the URL of every request, and its
 * errors keep that URL. Next prints any error a page throws, so without this
 * the token would end up in our logs. Call it once when the server starts.
 */
export function redactAccessTokensFromConsole(): void {
  for (const method of ['debug', 'info', 'log', 'warn', 'error'] as const) {
    const print = console[method];
    console[method] = (...args: unknown[]) =>
      print(redactAccessTokens(format(...args)));
  }
}
