// Added to <html> by an inline script before the first paint, so CSS can switch
// on JS-only layout without a flash. `isEnhanced` only flips after hydration.
export const jsEnabledClass = 'js-enabled';

export const jsEnabledScript = `document.documentElement.classList.add('${jsEnabledClass}')`;
