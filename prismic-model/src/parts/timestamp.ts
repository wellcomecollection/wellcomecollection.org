export default function timestamp(label: string) {
  return {
    type: 'Timestamp',
    config: {
      label,
    },
  };
}
