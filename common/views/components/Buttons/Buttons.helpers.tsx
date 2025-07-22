export function dataGtmPropsToAttributes(
  dataGtmProps?: Record<string, string>
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
