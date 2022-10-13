import { createScreenreaderLabel } from './telephone-numbers';

describe('createAriaLabel', () => {
  it('adds spaces between numbers', () => {
    const result = createScreenreaderLabel('+4420 7611 2222');
    expect(result).toBe('+ 4 4 2 0. 7 6 1 1. 2 2 2 2');
  });

  it('removes parentheses from numbers', () => {
    const result = createScreenreaderLabel('+44 (0)20 7611 2222');
    expect(result).toBe('+ 4 4. 0 2 0. 7 6 1 1. 2 2 2 2');
  });
});
