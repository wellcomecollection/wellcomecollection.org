import { withAppPathPrefix } from './identity-path-prefix';

describe('withAppPathPrefix (server)', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('returns the original path when no context_path is defined', () => {
    process.env.CONTEXT_PATH = undefined;
    expect(withAppPathPrefix('/home')).toBe('/home');
  });

  it('adds the context_path prefix when set in env', () => {
    process.env.CONTEXT_PATH = 'myApp';
    expect(withAppPathPrefix('/home')).toBe('/myApp/home');
  });
});
