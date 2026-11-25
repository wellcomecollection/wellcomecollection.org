import { LinkProps } from '@weco/common/model/link-props';

type StopLinks = { previous?: LinkProps; next?: LinkProps };

// Links to the stops either side, leaving out any that don't exist
export const getStopLinks = ({
  guideTypeUrl,
  stopNumber,
  totalStops,
}: {
  guideTypeUrl: string;
  stopNumber: number;
  totalStops: number;
}): StopLinks => {
  const stopLink = (n: number): LinkProps => ({
    href: { pathname: `${guideTypeUrl}/${n}` },
    shallow: true,
  });

  return {
    previous: stopNumber > 1 ? stopLink(stopNumber - 1) : undefined,
    next: stopNumber < totalStops ? stopLink(stopNumber + 1) : undefined,
  };
};
