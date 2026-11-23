// Added to <html> by an inline script in the document head, before the first
// paint, so CSS can style things that need JS without a flash of the no-JS
// version. `isEnhanced` from AppContext is the React equivalent, but only
// flips after hydration.
export const ENHANCED_CLASS = 'enhanced';

export const ENHANCED_SCRIPT = `document.documentElement.classList.add('${ENHANCED_CLASS}')`;
