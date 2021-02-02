import { withPrefix } from './prefix';

describe('withPrefix', () => {
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
    expect(withPrefix('/home')).toBe('/home');
  });

  it('adds the context_path prefix when set in env', () => {
    process.env.CONTEXT_PATH = 'myApp';
    expect(withPrefix('/home')).toBe('/myApp/home');
  });
});
