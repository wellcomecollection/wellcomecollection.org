const isServer = () => typeof window === 'undefined';

const getServerAppPathPrefix = () =>
  process.env.CONTEXT_PATH ? `/${process.env.CONTEXT_PATH}` : undefined;

const getClientAppPathPrefix = () => {
  const contextPath = document
    ?.getElementById('root')
    ?.getAttribute('data-context-path');
  return contextPath ? `/${contextPath}` : undefined;
};

export const getAppPathPrefix = (): string | undefined =>
  isServer() ? getServerAppPathPrefix() : getClientAppPathPrefix();

export const withAppPathPrefix = (path: string): string => {
  const prefix = getAppPathPrefix();
  return prefix ? prefix + path : path;
};
