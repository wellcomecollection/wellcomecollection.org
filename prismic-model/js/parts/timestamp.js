// @flow
export default function timestamp (label: string = 'Timestamp') {
  return {
    'type': 'Timestamp',
    'config': {
      'label': label
    }
  };
};
