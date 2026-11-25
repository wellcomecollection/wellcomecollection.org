import { ModeDefinition, PublishedPhasedFlag } from '@weco/toggles';

import { AbTest } from '../toggles.ABTests';
import { FeatureFlag } from '../toggles.helpers';

// Permanent flags useful to everyone, listed before the Digital team ones.
const GENERAL_FEATURE_FLAG_IDS = [
  'apiToolbar',
  'toggleWidget',
  'conceptsSearch',
];

type Toggles = {
  featureFlags: FeatureFlag[];
  phasedFlags: PublishedPhasedFlag[];
  abTests: AbTest[];
  modes: ModeDefinition[];
};

/** The toggles that match the search, grouped as the page lists them. */
export const filterToggles = (
  { featureFlags, phasedFlags, abTests, modes }: Toggles,
  searchQuery: string
) => {
  const filterFeatureFlags = (flagList: FeatureFlag[]) => {
    if (!searchQuery) return flagList;
    const query = searchQuery.toLowerCase();
    return flagList.filter(
      t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query)
    );
  };

  const generalFeatureFlags = filterFeatureFlags(
    featureFlags
      .filter(t => GENERAL_FEATURE_FLAG_IDS.includes(t.id))
      // Order by this list rather than by toggles.json's own feature flag
      // order, so it doesn't depend on that order matching too (and isn't
      // at the mercy of toggles.json actually being deployed up to date).
      .sort(
        (a, b) =>
          GENERAL_FEATURE_FLAG_IDS.indexOf(a.id) -
          GENERAL_FEATURE_FLAG_IDS.indexOf(b.id)
      )
  );
  const permanentFeatureFlags = filterFeatureFlags(
    featureFlags
      .filter(t => t.type === 'permanent')
      .filter(t => !GENERAL_FEATURE_FLAG_IDS.includes(t.id))
  );
  const experimentalFeatureFlags = filterFeatureFlags(
    featureFlags.filter(t => t.type === 'experimental')
  );
  const stageFeatureFlags = filterFeatureFlags(
    featureFlags.filter(t => t.type === 'stage')
  );
  const filteredPhasedFlags: PublishedPhasedFlag[] = searchQuery
    ? phasedFlags.filter(flag => {
        const query = searchQuery.toLowerCase();
        return (
          flag.title.toLowerCase().includes(query) ||
          flag.description.toLowerCase().includes(query) ||
          flag.id.toLowerCase().includes(query) ||
          flag.phases.some(
            phase =>
              phase.label.toLowerCase().includes(query) ||
              phase.description.toLowerCase().includes(query)
          )
        );
      })
    : phasedFlags;
  const filteredAbTests: AbTest[] = searchQuery
    ? abTests.filter(
        t =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : abTests;

  const filteredModes: ModeDefinition[] = searchQuery
    ? modes.filter(m => {
        const query = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query) ||
          m.options.some(opt => opt.label.toLowerCase().includes(query))
        );
      })
    : modes;

  const hasPermanent =
    generalFeatureFlags.length > 0 || permanentFeatureFlags.length > 0;
  const hasWorkInProgress =
    experimentalFeatureFlags.length > 0 ||
    stageFeatureFlags.length > 0 ||
    filteredPhasedFlags.length > 0 ||
    filteredAbTests.length > 0;

  const totalResults =
    generalFeatureFlags.length +
    permanentFeatureFlags.length +
    experimentalFeatureFlags.length +
    stageFeatureFlags.length +
    filteredPhasedFlags.length +
    filteredAbTests.length +
    filteredModes.length;

  return {
    generalFeatureFlags,
    permanentFeatureFlags,
    experimentalFeatureFlags,
    stageFeatureFlags,
    filteredPhasedFlags,
    filteredAbTests,
    filteredModes,
    hasPermanent,
    hasWorkInProgress,
    totalResults,
  };
};
