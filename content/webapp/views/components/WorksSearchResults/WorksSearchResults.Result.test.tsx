import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import * as Context from '@weco/common/server-data/Context';
import theme from '@weco/common/views/themes/default';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { PhaseValue } from '@weco/toggles';

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

const phases = [
  { id: 'mvp', label: 'MVP', description: '' },
  { id: 'phase2', label: 'Phase 2', description: '' },
];

const mockArchiveCollectionPhase = (current: PhaseValue) =>
  jest.spyOn(Context, 'usePhasedFlags').mockImplementation(
    () =>
      ({
        archiveCollectionPhases: { current, phases },
      }) as unknown as ReturnType<typeof Context.usePhasedFlags>
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

  it('does not show "Archive Collection" for an ordinary work, even at MVP', () => {
    mockArchiveCollectionPhase('mvp');
    renderResult(baseWork);
    expect(screen.queryByText('Archive Collection')).not.toBeInTheDocument();
  });

  // The "is this actually an archive collection root" decision lives in
  // `isArchiveCollectionRoot` - see its tests in utils/works.test.ts for the
  // cases (a manuscript, a non-archive format, a childless root) that get
  // `false` here.
  it('does not show "Archive Collection" for a collection root that is not itself an archive', () => {
    mockArchiveCollectionPhase('mvp');
    renderResult({ ...baseWork, isArchiveCollectionRoot: false });
    expect(screen.queryByText('Archive Collection')).not.toBeInTheDocument();
  });

  it('shows "Archive Collection" for an archive collection root at MVP', () => {
    mockArchiveCollectionPhase('mvp');
    renderResult({ ...baseWork, isArchiveCollectionRoot: true });
    expect(screen.getByText('Archive Collection')).toBeInTheDocument();
  });

  it('does not show "Archive Collection" for an archive collection root when no phase is public', () => {
    mockArchiveCollectionPhase(null);
    renderResult({ ...baseWork, isArchiveCollectionRoot: true });
    expect(screen.queryByText('Archive Collection')).not.toBeInTheDocument();
  });

  const workWithShortDescription = {
    ...baseWork,
    isArchiveCollectionRoot: true,
    shortDescription: 'A short description of this collection.',
  };

  it('shows the short description at phase 2', () => {
    mockArchiveCollectionPhase('phase2');
    renderResult(workWithShortDescription);
    expect(
      screen.getByText('A short description of this collection.')
    ).toBeInTheDocument();
  });

  it('does not show the short description at MVP', () => {
    mockArchiveCollectionPhase('mvp');
    renderResult(workWithShortDescription);
    expect(screen.getByText('Archive Collection')).toBeInTheDocument();
    expect(
      screen.queryByText('A short description of this collection.')
    ).not.toBeInTheDocument();
  });
});
