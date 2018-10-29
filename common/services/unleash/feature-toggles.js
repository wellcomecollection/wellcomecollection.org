// Leave this service with standard nodejs requires as it's needed where we
// don't have compilation
const { Strategy, initialize, isEnabled } = require('unleash-client');

class ActiveForUserInCohort extends Strategy {
  constructor() {
    super('ActiveForUserInCohort');
  }

  isEnabled({ cohorts }, { cohort }) {
    return cohorts.split(',').indexOf(cohort) !== -1;
  }
}

class ABTest extends Strategy {
  constructor() {
    super('ABTest');
  }

  isEnabled({ percentage }, { isUserEnabled }) {
    // Unleash support numbers not booleans...
    // And sends them as strings....
    if (isUserEnabled === true) {
      return true;
    }

    const chance = percentage / 100;
    const coinToss = Math.random() < chance;
    return coinToss;
  }
}

class UserEnabled extends Strategy {
  constructor() {
    super('UserEnabled');
  }

  isEnabled({ isPublic }, { isUserEnabled }) {
    // Unleash support numbers not booleans...
    // And sends them as strings....
    return isUserEnabled || parseInt(isPublic, 10) === 1;
  }
}

function init(options) {
  return initialize(Object.assign(options, {
    url: 'https://weco-feature-flags.herokuapp.com/api/',
    refreshInterval: 60 * 1000,
    strategies: [
      new ActiveForUserInCohort(),
      new UserEnabled(),
      new ABTest()
    ]
  }));
}

module.exports = {
  initialize: init,
  isEnabled
};
