import { serialiseJsonLd } from './json-ld';

describe('serialiseJsonLd', () => {
  it('escapes < so content cannot end the script element', () => {
    const serialised = serialiseJsonLd({
      name: 'Test </script> title',
    });

    expect(serialised).not.toContain('<');
    expect(JSON.parse(serialised)).toEqual({
      name: 'Test </script> title',
    });
  });
});
