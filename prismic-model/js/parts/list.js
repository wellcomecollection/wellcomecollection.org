// @flow
export default function list(label: string, fields: {[string]: any}) {
  return {
    'type': 'Group',
    'fieldset': label,
    'config': {
      fields
    }
  };
}
