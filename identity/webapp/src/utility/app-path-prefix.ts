const isServer = () => typeof window === 'undefined';

const getServerAppPathPrefix = () =>
  process.env.CONTEXT_PATH ? `/${process.env.CONTEXT_PATH}` : undefined;

const getClientAppPathPrefix = () =>
  document?.getElementById('root')?.getAttribute('data-context-path') || '';

export const getAppPathPrefix = () =>
  isServer() ? getServerAppPathPrefix() : getClientAppPathPrefix();

export const withAppPathPrefix = (path: string): string => {
  const prefix = getAppPathPrefix();
  return prefix ? prefix + path : path;
};
