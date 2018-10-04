// @flow

// This should be used sparingly as you can't free text search on it, only
// exact match
export default function(label: string, placeholder: ?string) {
  return {
    type: 'Text',
    config: {
      label,
      placeholder
    }
  };
}
