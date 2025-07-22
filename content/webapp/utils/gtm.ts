export type DataGtmAttr = 'trigger' | 'position-in-list';

export function dataGtmPropsToAttributes(
  dataGtmProps?: Partial<Record<DataGtmAttr, string>>
): Record<string, string> {
  if (!dataGtmProps) {
    return {};
  }

  return Object.entries(dataGtmProps).reduce(
    (acc, [key, value]) => {
      acc[`data-gtm-${key}`] = value;
      return acc;
    },
    {} as Record<string, string>
  );
}
