import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import IsArchiveContext from '@weco/content/contexts/IsArchiveContext';
import { Work } from '@weco/content/services/wellcome/catalogue/types';

import ArchiveBreadcrumb from './work.ArchiveBreadcrumb';

describe('ArchiveBreadcrumb', () => {
  it("includes the reference number in the last crumb if there isn't one", () => {
    const w: Work = {
      id: 'atxs4tb9',
      title: 'Archives 1972',
      alternativeTitles: [],
      referenceNumber: 'SA/GMR/A/16',
      workType: {
        id: 'h',
        label: 'Archives and manuscripts',
        type: 'Format',
      },
      parts: [],
      partOf: [],
      physicalDescription: '1 file',
      contributors: [],
      subjects: [],
      genres: [],
      identifiers: [],
      production: [],
      languages: [],
      notes: [],
      holdings: [],
      availabilities: [],
      availableOnline: false,
      type: 'Work',
      formerFrequency: [],
      designation: [],
    };
    const { getByText } = renderWithTheme(
      <IsArchiveContext.Provider value={true}>
        <ArchiveBreadcrumb work={w} />
      </IsArchiveContext.Provider>
    );
    expect(getByText('Archives 1972 SA/GMR/A/16'));
  });

  it("omits the reference number in a middle crumb if there isn't one", async () => {
    const w: Work = {
      id: 'x56u8dnf',
      title: 'Cĕrita hantu setan',
      alternativeTitles: [],
      workType: {
        id: 'h',
        label: 'Archives and manuscripts',
        type: 'Format',
      },
      parts: [],
      partOf: [
        {
          id: 'wz7z8468',
          title: 'Wellcome Malay 3 part 2',
          partOf: [
            {
              id: 'v495u8s2',
              title: 'Wellcome Malay 3',
              referenceNumber: 'Wellcome Malay 3',
              partOf: [],
              totalParts: 6,
              totalDescendentParts: 15,
              type: 'Work',
              alternativeTitles: [],
              availableOnline: true,
              availabilities: [],
            },
          ],
          alternativeTitles: [],
          availableOnline: true,
          availabilities: [],
          totalParts: 1,
          totalDescendentParts: 1,
          type: 'Work',
        },
      ],
      physicalDescription: '1 file',
      contributors: [],
      subjects: [],
      genres: [],
      identifiers: [],
      production: [],
      languages: [],
      notes: [],
      holdings: [],
      availabilities: [],
      availableOnline: false,
      type: 'Work',
      formerFrequency: [],
      designation: [],
    };

    const { container } = renderWithTheme(
      <IsArchiveContext.Provider value={true}>
        <ArchiveBreadcrumb work={w} />
      </IsArchiveContext.Provider>
    );

    expect(container.outerHTML.includes('undefined')).toBe(false);
  });

  it("omits the reference number in the last crumb if there isn't one", () => {
    const w: Work = {
      id: 'eyfq7xd9',
      title: 'Devīkavaca',
      alternativeTitles: [],
      workType: {
        id: 'h',
        label: 'Archives and manuscripts',
        type: 'Format',
      },
      parts: [],
      partOf: [],
      physicalDescription: '1 file',
      contributors: [],
      subjects: [],
      genres: [],
      identifiers: [],
      production: [],
      languages: [],
      notes: [],
      holdings: [],
      availabilities: [],
      availableOnline: false,
      type: 'Work',
      formerFrequency: [],
      designation: [],
    };

    const { container } = renderWithTheme(
      <IsArchiveContext.Provider value={true}>
        <ArchiveBreadcrumb work={w} />
      </IsArchiveContext.Provider>
    );

    expect(container.outerHTML.includes('undefined')).toBe(false);
  });
});
