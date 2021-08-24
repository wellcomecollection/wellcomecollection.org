const isServer = () => typeof window === 'undefined';

// In Next.js environments, the context path has to be prefixed with NEXT_PUBLIC_
// in order for it to be "allowed" to be sent to the client.
const getServerContextPath = (): string | undefined =>
  process.env.CONTEXT_PATH || process.env.NEXT_PUBLIC_CONTEXT_PATH;

const getClientContextPath = (): string | undefined => {
  const maybeNullish = document
    ?.getElementById('root')
    ?.getAttribute('data-context-path');
  return maybeNullish || undefined;
};

export const getContextPath = (): string | undefined =>
  isServer() ? getServerContextPath() : getClientContextPath();

export const getAppPathPrefix = (): string | undefined => {
  const contextPath = getContextPath();
  return contextPath ? `/${contextPath}` : undefined;
};

export const withAppPathPrefix = (path: string): string => {
  const prefix = getAppPathPrefix();
  return prefix ? prefix + path : path;
};
