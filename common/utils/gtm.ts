
type DataGtmAttr = 'trigger' | 'position-in-list' | 'label';
export type DataGtmProps = Partial<Record<DataGtmAttr, string>>;

export function dataGtmPropsToAttributes(
  dataGtmProps?: DataGtmProps
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
