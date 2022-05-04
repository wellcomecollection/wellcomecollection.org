import { transformTaslFromString } from '.';

describe('transformTaslFromString', () => {
  it('returns an empty tasl if the input is null', () => {
    const result = transformTaslFromString(null);
    expect(result).toEqual({ title: '' });
  });

  it('transforms a valid tasl', () => {
    const result = transformTaslFromString(
      'Mandrake root, England, 1501-1700 | | Science Museum London | https://collection.sciencemuseumgroup.org.uk/objects/co106410/mandrake-root-england-1501-1700-mandrake-root | CC-BY | |'
    );
    expect(result).toEqual({
      author: undefined,
      copyrightHolder: undefined,
      copyrightLink: undefined,
      license: 'CC-BY',
      sourceLink:
        'https://collection.sciencemuseumgroup.org.uk/objects/co106410/mandrake-root-england-1501-1700-mandrake-root',
      sourceName: 'Science Museum London',
      title: 'Mandrake root, England, 1501-1700',
    });
  });
});
