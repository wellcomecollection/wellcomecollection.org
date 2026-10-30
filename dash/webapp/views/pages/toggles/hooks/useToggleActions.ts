import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import { ModeDefinition, PublishedPhasedFlag } from '@weco/toggles';

import { AbTest } from '../toggles.ABTests';
import {
  deleteCookieCustom,
  FeatureFlag,
  setCookieCustom,
  ToggleStates,
} from '../toggles.helpers';
import { ToggleMessage } from './useFloatingMessage';

type ToggleActionsProps = {
  featureFlags: FeatureFlag[];
  phasedFlags: PublishedPhasedFlag[];
  abTests: AbTest[];
  modes: ModeDefinition[];
  setToggleStates: Dispatch<SetStateAction<ToggleStates>>;
  setPhasedFlagStates: Dispatch<SetStateAction<Record<string, string>>>;
  setModeStates: Dispatch<SetStateAction<Record<string, string>>>;
  setMessage: (message: ToggleMessage) => void;
};

/**
 * Setting and resetting toggles: the resets the page's buttons use, and the
 * query param links documented in toggles/README.md, which are acted on once
 * the toggles have loaded.
 */
export const useToggleActions = ({
  featureFlags,
  phasedFlags,
  abTests,
  modes,
  setToggleStates,
  setPhasedFlagStates,
  setModeStates,
  setMessage,
}: ToggleActionsProps) => {
  const router = useRouter();
  const {
    enableToggle,
    disableToggle,
    resetToggles,
    enableMode,
    disableMode,
    modeValue,
    phaseValue,
  } = router.query;

  const handleFeatureFlag = useCallback(
    (flag: FeatureFlag, action: 'enable' | 'disable') => {
      if (action === 'enable') {
        setCookieCustom(flag.id, 'true');
        setToggleStates(prev => ({ ...prev, [flag.id]: true }));
        setMessage({
          text: `Feature flag "${flag.id}" has been enabled.`,
          isError: false,
          isEnabled: true,
        });
      } else {
        deleteCookieCustom(flag.id);
        setToggleStates(prev => ({ ...prev, [flag.id]: flag.defaultValue }));
        setMessage({
          text: `Feature flag "${flag.id}" has been reset to its default value.`,
          isError: false,
          isEnabled: false,
        });
      }
    },
    [setToggleStates, setMessage]
  );

  const handlePhasedFlag = useCallback(
    (
      flag: PublishedPhasedFlag,
      action: 'enable' | 'disable',
      phaseId?: string
    ) => {
      if (action === 'disable') {
        deleteCookieCustom(flag.id);
        setPhasedFlagStates(prev => {
          const next = { ...prev };
          delete next[flag.id];
          return next;
        });
        setMessage({
          text: `Phased flag "${flag.title}" has been reset to its default view.`,
          isError: false,
          isEnabled: false,
        });
        return;
      }
      if (!phaseId) {
        setMessage({
          text: `Phased flag "${flag.id}" requires a phaseValue.`,
          isError: true,
        });
        return;
      }
      const phase = flag.phases.find(p => p.id === phaseId);
      if (!phase) {
        setMessage({
          text: `Phased flag "${flag.id}" has no phase "${phaseId}".`,
          isError: true,
        });
        return;
      }
      setCookieCustom(flag.id, phaseId);
      setPhasedFlagStates(prev => ({ ...prev, [flag.id]: phaseId }));
      setMessage({
        text: `Phased flag "${flag.title}" has been set to "${phase.label}".`,
        isError: false,
        isEnabled: true,
      });
    },
    [setPhasedFlagStates, setMessage]
  );

  const handleAbTest = useCallback(
    (test: AbTest, action: 'enable' | 'disable') => {
      if (action === 'enable') {
        setCookieCustom(test.id, 'true');
        setToggleStates(prev => ({ ...prev, [test.id]: true }));
        setMessage({
          text: `You're now in A/B test "${test.title}".`,
          isError: false,
          isEnabled: true,
        });
      } else {
        deleteCookieCustom(test.id);
        setToggleStates(prev => ({ ...prev, [test.id]: undefined }));
        setMessage({
          text: `A/B test "${test.title}" has been reset to random allocation.`,
          isError: false,
          isEnabled: false,
        });
      }
    },
    [setToggleStates, setMessage]
  );

  const handleMode = useCallback(
    (mode: ModeDefinition, optionId: string | undefined) => {
      if (optionId === undefined) {
        deleteCookieCustom(mode.id);
        setModeStates(prev => {
          const next = { ...prev };
          delete next[mode.id];
          return next;
        });
        setMessage({
          text: `Mode "${mode.title}" has been reset.`,
          isError: false,
          isEnabled: false,
        });
        return;
      }
      const option = mode.options.find(opt => opt.id === optionId);
      if (!option) {
        setMessage({
          text: optionId
            ? `Mode "${mode.id}" has no option "${optionId}".`
            : `Mode "${mode.id}" requires a modeValue.`,
          isError: true,
        });
        return;
      }
      setCookieCustom(mode.id, optionId);
      setModeStates(prev => ({ ...prev, [mode.id]: optionId }));
      setMessage({
        text: `Mode "${mode.title}" has been set to "${option.label}".`,
        isError: false,
        isEnabled: true,
      });
    },
    [setModeStates, setMessage]
  );

  const reset = useCallback(
    () =>
      setToggleStates(prev => {
        const next = { ...prev };
        for (const { id, defaultValue } of featureFlags) {
          deleteCookieCustom(id);
          next[id] = defaultValue;
        }
        return next;
      }),
    [featureFlags]
  );

  const resetFlagGroup = useCallback(
    (flags: FeatureFlag[], groupTitle: string) => {
      setToggleStates(prev => {
        const next = { ...prev };
        for (const { id, defaultValue } of flags) {
          deleteCookieCustom(id);
          next[id] = defaultValue;
        }
        return next;
      });
      setMessage({
        text: `${groupTitle} flags have been reset to their default values.`,
        isError: false,
      });
    },
    []
  );

  const resetAbTests = useCallback(() => {
    setToggleStates(prev => {
      const next = { ...prev };
      for (const { id } of abTests) {
        deleteCookieCustom(id);
        delete next[id];
      }
      return next;
    });
    setMessage({
      text: 'All A/B tests have been reset to random allocation.',
      isError: false,
    });
  }, [abTests]);

  const resetPhasedFlags = useCallback(() => {
    phasedFlags.forEach(flag => deleteCookieCustom(flag.id));
    setPhasedFlagStates({});
    setMessage({
      text: 'All phased flags have been reset to their public phase.',
      isError: false,
    });
  }, [phasedFlags]);

  const resetModes = useCallback(() => {
    modes.forEach(mode => deleteCookieCustom(mode.id));
    setModeStates({});
    setMessage({
      text: 'All modes have been reset.',
      isError: false,
    });
  }, [modes]);

  const resetEverything = useCallback(() => {
    reset();
    resetAbTests();
    resetPhasedFlags();
    resetModes();
    setMessage({
      text: 'Everything has been reset to its default.',
      isError: false,
    });
  }, [reset, resetAbTests, resetPhasedFlags, resetModes]);

  useEffect(() => {
    if (
      featureFlags.length === 0 &&
      phasedFlags.length === 0 &&
      modes.length === 0
    )
      return;

    const missing = (kind: string, id: string) =>
      setMessage({ text: `${kind} "${id}" does not exist.`, isError: true });

    // enableToggle / disableToggle can name any kind of toggle except a mode
    const setOrResetToggle = (id: string, action: 'enable' | 'disable') => {
      const flag = featureFlags.find(f => f.id === id);
      const phasedFlag = phasedFlags.find(f => f.id === id);
      const test = abTests.find(t => t.id === id);
      if (flag) {
        handleFeatureFlag(flag, action);
      } else if (phasedFlag) {
        handlePhasedFlag(
          phasedFlag,
          action,
          action === 'enable' ? (phaseValue as string | undefined) : undefined
        );
      } else if (test) {
        handleAbTest(test, action);
      } else {
        missing('Toggle', id);
      }
    };

    const setOrResetMode = (id: string, optionId: string | undefined) => {
      const mode = modes.find(m => m.id === id);
      if (mode) {
        handleMode(mode, optionId);
      } else {
        missing('Mode', id);
      }
    };

    if (resetToggles !== undefined) {
      resetEverything();
    } else if (enableToggle) {
      setOrResetToggle(enableToggle as string, 'enable');
    } else if (disableToggle) {
      setOrResetToggle(disableToggle as string, 'disable');
    } else if (enableMode) {
      setOrResetMode(enableMode as string, (modeValue as string) ?? '');
    } else if (disableMode) {
      setOrResetMode(disableMode as string, undefined);
    }
  }, [
    enableToggle,
    disableToggle,
    resetToggles,
    enableMode,
    disableMode,
    modeValue,
    phaseValue,
    handleFeatureFlag,
    handlePhasedFlag,
    handleAbTest,
    handleMode,
    setMessage,
    resetEverything,
    featureFlags,
    phasedFlags,
    abTests,
    modes,
  ]);

  return {
    resetFlagGroup,
    resetAbTests,
    resetPhasedFlags,
    resetModes,
    resetEverything,
  };
};
