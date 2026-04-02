// Shim for undici in the browser
// Storybook runs in the browser, so we provide a mock that uses the browser's native fetch
export class Agent {
  constructor() {}
}

export const fetch = window.fetch.bind(window);
export default { Agent, fetch };
