// @flow
export default function uid(label: string) {
  return {
    type: 'UID',
    config: {
      label
    }
  };
}
