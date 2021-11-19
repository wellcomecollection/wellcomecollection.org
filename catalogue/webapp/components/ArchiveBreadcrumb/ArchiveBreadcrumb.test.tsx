import ArchiveBreadcrumb from './ArchiveBreadcrumb';
import IsArchiveContext from '../IsArchiveContext/IsArchiveContext';
import { Work } from '@weco/common/model/catalogue';
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
