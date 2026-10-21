import * as icons from '@weco/common/icons';

import { brandIcons } from './Icon.brandIcons';

// Legacy icons that deliberately have no brand match, so they keep rendering
// the legacy drawing with brandUpdate on. Keep this list when the flag comes
// out: these are the legacy icons that still need to exist afterwards.
const intentionallyUnmapped: Record<string, string> = {
  clock: 'waiting to be added to the shared icon set',
  check: 'waiting to be added to the shared icon set',
  chevrons: 'only rendered with brandUpdate off',
  indicator: 'only rendered with brandUpdate off (CheckboxRadio has its own)',
};

const legacyIcons = Object.entries(icons);

describe('brandIcons', () => {
  it.each(legacyIcons)(
    '%s is either mapped to a brand icon or listed as intentionally unmapped',
    (name, icon) => {
      const isMapped = brandIcons.has(icon);
      const isListed = name in intentionallyUnmapped;

      // Exactly one: a new legacy icon needs a decision, and a listed icon
      // that gains a mapping should come off the list
      expect({ name, isMapped, isListed }).toEqual({
        name,
        isMapped: !isListed,
        isListed: !isMapped,
      });
    }
  );

  it('only lists icons that still exist', () => {
    const legacyNames = legacyIcons.map(([name]) => name);

    expect(legacyNames).toEqual(
      expect.arrayContaining(Object.keys(intentionallyUnmapped))
    );
  });
});
