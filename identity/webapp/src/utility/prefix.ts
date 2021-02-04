export const withPrefix = (path: string): string => {
  const leadingSlash = process.env.CONTEXT_PATH ? '/' : '';
  const prefix = process.env.CONTEXT_PATH || '';
  return `${leadingSlash}${prefix}${path}`;
};

export const prefix = process.env.CONTEXT_PATH ? `/${process.env.CONTEXT_PATH}` : undefined;
