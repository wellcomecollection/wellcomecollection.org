import ArchiveBreadcrumb from './ArchiveBreadcrumb';
import IsArchiveContext from '../IsArchiveContext/IsArchiveContext';
import { Work } from '@weco/catalogue/services/catalogue/types';
import { shallowWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';

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
      precededBy: [],
      succeededBy: [],
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

    const component = shallowWithTheme(
      <IsArchiveContext.Provider value={true}>
        <ArchiveBreadcrumb work={w} />
      </IsArchiveContext.Provider>
    );
    const componentHtml = component.html();
    expect(
      componentHtml.indexOf('Archives 1972 SA/GMR/A/16') > -1
    ).toBeTruthy();
  });

  it("omits the reference number in a middle crumb if there isn't one", () => {
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
      precededBy: [],
      succeededBy: [],
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

    const component = shallowWithTheme(
      <IsArchiveContext.Provider value={true}>
        <ArchiveBreadcrumb work={w} />
      </IsArchiveContext.Provider>
    );
    const componentHtml = component.html();
    expect(componentHtml.indexOf('undefined')).toBe(-1);
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
      precededBy: [],
      succeededBy: [],
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

    const component = shallowWithTheme(
      <IsArchiveContext.Provider value={true}>
        <ArchiveBreadcrumb work={w} />
      </IsArchiveContext.Provider>
    );
    const componentHtml = component.html();
    expect(componentHtml.indexOf('undefined')).toBe(-1);
  });
});
