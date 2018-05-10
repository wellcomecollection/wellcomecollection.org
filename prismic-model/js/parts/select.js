// @flow
export default function select (label: string, options: string[]) {
  return {
    'type': 'Select',
    'config': {
      'label': label,
      'options': options
    }
  };
}
