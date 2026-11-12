// Added to <html> by an inline script before the first paint, so CSS can switch
// on JS-only layout without a flash. `isEnhanced` only flips after hydration.
// Only added where ResizeObserver exists, as the layouts using it rely on one.
export const jsEnabledClass = 'js-enabled';

export const jsEnabledScript = `if ('ResizeObserver' in window) document.documentElement.classList.add('${jsEnabledClass}')`;
