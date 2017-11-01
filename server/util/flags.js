// @flow
import {isFlagEnabled, getFlagValue} from '../util/flag-status';
import {cache} from '../services/interval-cache'

type FeatureFlag = {|
  value: ?string;
  enabled: boolean;
|}

let featuresCohort: ?string;
export function setFeaturesCohort(cohortName: string) {
  featuresCohort = cohortName;
}

export function getFlag(flagName: string): FeatureFlag {
    const [flags] = cache.get('flags');
    const enabled = isFlagEnabled(featuresCohort, flagName, flags);
    const value = getFlagValue(featuresCohort, flagName, flags);

    return {enabled, value};
}


