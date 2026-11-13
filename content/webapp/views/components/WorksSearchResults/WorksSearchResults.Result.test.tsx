import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import theme from '@weco/common/views/themes/default';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';

import WorkSearchResult from './WorksSearchResults.Result';

const baseWork: WorkBasic = {
  id: 'abcd1234',
  title: 'A test work',
  workTypeId: undefined,
  languageId: undefined,
  thumbnail: undefined,
  referenceNumber: undefined,
  shortDescription: undefined,
  productionDates: [],
  archiveLabels: undefined,
  cardLabels: [],
  primaryContributorLabel: undefined,
  notes: [],
  physicalDescription: '',
  isArchiveCollectionRoot: false,
};

const renderResult = (work: WorkBasic) =>
  render(
    <ThemeProvider theme={theme}>
      <WorkSearchResult work={work} resultPosition={0} />
    </ThemeProvider>
  );

describe('WorkSearchResult', () => {
  it('does not show "Archive Collection" for an ordinary work', () => {
    renderResult(baseWork);
    expect(screen.queryByText('Archive Collection')).not.toBeInTheDocument();
  });

  // The "is this actually an archive collection root" decision lives in
  // `isArchiveCollectionRoot` - see its tests in utils/works.test.ts for the
  // cases (a manuscript, a non-archive format, a childless root) that get
  // `false` here.
  it('does not show "Archive Collection" for a collection root that is not itself an archive', () => {
    renderResult({ ...baseWork, isArchiveCollectionRoot: false });
    expect(screen.queryByText('Archive Collection')).not.toBeInTheDocument();
  });

  it('shows "Archive Collection" for an archive collection root', () => {
    renderResult({ ...baseWork, isArchiveCollectionRoot: true });
    expect(screen.getByText('Archive Collection')).toBeInTheDocument();
  });

  it('shows the short description for an archive collection root', () => {
    renderResult({
      ...baseWork,
      isArchiveCollectionRoot: true,
      shortDescription: 'A short description of this collection.',
    });
    expect(
      screen.getByText('A short description of this collection.')
    ).toBeInTheDocument();
  });
});
