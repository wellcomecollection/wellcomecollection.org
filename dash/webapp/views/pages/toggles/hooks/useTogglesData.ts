import { getCookie, getCookies } from 'cookies-next';
import { useCallback, useEffect, useState } from 'react';

import { ModeDefinition, PublishedPhasedFlag } from '@weco/toggles';

import { AbTest } from '../toggles.ABTests';
import {
  FeatureFlag,
  MAX_STARRED_TOGGLES,
  parseStarredToggles,
  setStarredToggles,
  STARRED_TOGGLES_COOKIE,
  ToggleStates,
} from '../toggles.helpers';
import { ToggleMessage } from './useFloatingMessage';

/**
 * Loads the published toggles, and this browser's current state for each of
 * them from its cookies.
 */
export const useTogglesData = (
  setMessage: (message: ToggleMessage) => void
) => {
  const [toggleStates, setToggleStates] = useState<ToggleStates>({});
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [phasedFlags, setPhasedFlags] = useState<PublishedPhasedFlag[]>([]);
  const [phasedFlagStates, setPhasedFlagStates] = useState<
    Record<string, string>
  >({});
  const [abTests, setAbTests] = useState<AbTest[]>([]);
  const [modes, setModes] = useState<ModeDefinition[]>([]);
  const [modeStates, setModeStates] = useState<Record<string, string>>({});
  const [starredIds, setStarredIds] = useState<string[]>([]);

  useEffect(() => {
    fetch('https://toggles.wellcomecollection.org/toggles.json')
      .then(resp => resp.json())
      .then(json => {
        const flags: FeatureFlag[] = json.featureFlags ?? [];
        const phasedFlagDefinitions: PublishedPhasedFlag[] =
          json.phasedFlags ?? [];
        const tests: AbTest[] = json.tests ?? [];
        const modeDefinitions: ModeDefinition[] = json.modes ?? [];

        setFeatureFlags(flags);
        setPhasedFlags(phasedFlagDefinitions);
        setAbTests(tests);
        setModes(modeDefinitions);

        const cookies = getCookies();
        const initialStates: ToggleStates = {};

        // Feature flags: cookie value or default
        for (const toggle of flags) {
          const cookieKey = `toggle_${toggle.id}`;
          initialStates[toggle.id] =
            cookieKey in cookies
              ? cookies[cookieKey] === 'true'
              : toggle.defaultValue;
        }

        // Phased flags: only record a state when the cookie is a phase that
        // still exists - same reasoning as modes below, but validated
        // against each flag's own phases list rather than one shared list.
        const initialPhasedFlagStates: Record<string, string> = {};
        for (const flag of phasedFlagDefinitions) {
          const cookieKey = `toggle_${flag.id}`;
          const cookieValue = cookies[cookieKey];
          if (
            cookieValue &&
            flag.phases.some(phase => phase.id === cookieValue)
          ) {
            initialPhasedFlagStates[flag.id] = cookieValue;
          }
        }
        setPhasedFlagStates(initialPhasedFlagStates);

        // AB tests: cookie value or undefined (= randomly allocate)
        for (const test of tests) {
          const cookieKey = `toggle_${test.id}`;
          if (cookieKey in cookies) {
            initialStates[test.id] = cookies[cookieKey] === 'true';
          }
        }

        // Modes: read plain string cookie values
        const initialModeStates: Record<string, string> = {};
        for (const mode of modeDefinitions) {
          const cookieKey = `toggle_${mode.id}`;
          const cookieValue = cookies[cookieKey];
          if (cookieValue && cookieValue.length > 0) {
            initialModeStates[mode.id] = cookieValue;
          }
        }
        setModeStates(initialModeStates);

        // Prune any starred id that no longer matches a real toggle (e.g.
        // one that's since been deleted) - otherwise it lingers in the
        // cookie forever, still counting toward the 6-item cap, with no
        // star button left anywhere to un-star it from.
        const validIds = new Set([
          ...flags.map(f => f.id),
          ...phasedFlagDefinitions.map(f => f.id),
          ...tests.map(t => t.id),
          ...modeDefinitions.map(m => m.id),
        ]);
        // getCookie rather than cookies[...] - client-side getCookies()
        // returns raw values, but setCookie URL-encodes the commas, so a
        // multi-star list would come back as one unrecognised id and get
        // pruned to nothing.
        const parsedStarredIds = parseStarredToggles(
          getCookie(STARRED_TOGGLES_COOKIE)
        );
        const prunedStarredIds = parsedStarredIds.filter(id =>
          validIds.has(id)
        );
        if (prunedStarredIds.length !== parsedStarredIds.length) {
          setStarredToggles(prunedStarredIds);
        }
        setStarredIds(prunedStarredIds);

        setToggleStates(initialStates);
      })
      .catch(() =>
        setMessage({
          text: 'Failed to load toggles. Please try refreshing.',
          isError: true,
        })
      );
  }, [setMessage]);

  const handleToggleStar = useCallback((id: string) => {
    setStarredIds(prev => {
      const isRemoving = prev.includes(id);
      if (!isRemoving && prev.length >= MAX_STARRED_TOGGLES) return prev;

      const next = isRemoving
        ? prev.filter(starredId => starredId !== id)
        : [...prev, id];
      setStarredToggles(next);
      return next;
    });
  }, []);

  return {
    featureFlags,
    phasedFlags,
    abTests,
    modes,
    toggleStates,
    setToggleStates,
    phasedFlagStates,
    setPhasedFlagStates,
    modeStates,
    setModeStates,
    starredIds,
    handleToggleStar,
  };
};
