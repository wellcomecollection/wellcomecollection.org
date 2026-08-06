export function toHtmlId(s: string): string {
  return s.replace(/\W/g, '-');
}

// Work titles can carry display markup from the catalogue (e.g. <i>, <sup>,
// <p>). Strip exactly those tags for plain-text contexts such as the document
// <title>: a general tag strip would also eat angle-bracketed text like the
// dates some titles contain (<1771-1842>). Inline tags strip to nothing so
// notation like S<sup>u</sup> stays joined; paragraph tags become spaces so
// adjacent paragraphs don't run their words together.
export function removeDisplayMarkupTags(s: string): string {
  return s
    .replace(/<\/?(?:i|b|em|u|sup|sub)>/gi, '')
    .replace(/<\/?p>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function removeTrailingFullStop(s: string): string {
  return s.replace(/\.$/g, '');
}
