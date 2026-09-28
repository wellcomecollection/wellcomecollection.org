import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import * as Context from '@weco/common/server-data/Context';
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

const mockFeatureFlags = (flags: {
  archiveCollection?: boolean;
  archiveShortDescriptions?: boolean;
}) =>
  jest
    .spyOn(Context, 'useFeatureFlags')
    .mockImplementation(
      () => flags as unknown as ReturnType<typeof Context.useFeatureFlags>
    );

const renderResult = (work: WorkBasic) =>
  render(
    <ThemeProvider theme={theme}>
      <WorkSearchResult work={work} resultPosition={0} />
    </ThemeProvider>
  );

describe('WorkSearchResult', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not show "Archive Collection" for an ordinary work, even with the flag on', () => {
    mockFeatureFlags({ archiveCollection: true });
    renderResult(baseWork);
    expect(screen.queryByText('Archive Collection')).not.toBeInTheDocument();
  });

  // The "is this actually an archive collection root" decision lives in
  // `isArchiveCollectionRoot` - see its tests in utils/works.test.ts for the
  // cases (a manuscript, a non-archive format, a childless root) that get
  // `false` here.
  it('does not show "Archive Collection" for a collection root that is not itself an archive', () => {
    mockFeatureFlags({ archiveCollection: true });
    renderResult({ ...baseWork, isArchiveCollectionRoot: false });
    expect(screen.queryByText('Archive Collection')).not.toBeInTheDocument();
  });

  it('shows "Archive Collection" for an archive collection root when the flag is on', () => {
    mockFeatureFlags({ archiveCollection: true });
    renderResult({ ...baseWork, isArchiveCollectionRoot: true });
    expect(screen.getByText('Archive Collection')).toBeInTheDocument();
  });

  it('does not show "Archive Collection" for an archive collection root when the flag is off', () => {
    mockFeatureFlags({ archiveCollection: false });
    renderResult({ ...baseWork, isArchiveCollectionRoot: true });
    expect(screen.queryByText('Archive Collection')).not.toBeInTheDocument();
  });

  // The short description has its own flag, independent of archiveCollection.
  const workWithShortDescription = {
    ...baseWork,
    isArchiveCollectionRoot: true,
    shortDescription: 'A short description of this collection.',
  };

  it('shows the short description when archiveShortDescriptions is on, even with archiveCollection off', () => {
    mockFeatureFlags({
      archiveCollection: false,
      archiveShortDescriptions: true,
    });
    renderResult(workWithShortDescription);
    expect(
      screen.getByText('A short description of this collection.')
    ).toBeInTheDocument();
  });

  it('does not show the short description when archiveShortDescriptions is off, even with archiveCollection on', () => {
    mockFeatureFlags({
      archiveCollection: true,
      archiveShortDescriptions: false,
    });
    renderResult(workWithShortDescription);
    expect(
      screen.queryByText('A short description of this collection.')
    ).not.toBeInTheDocument();
  });
});
