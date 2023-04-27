import { LinkProps } from 'next/link';
import { formatNumber } from '@weco/common/utils/grammar';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import theme from '@weco/common/views/themes/default';

type SeeMoreButtonType = {
  text: string;
  link: LinkProps;
  totalResults: number;
};
export const SeeMoreButton = ({
  text,
  link,
  totalResults,
}: SeeMoreButtonType) => (
  <MoreLink
    name={`${text} (${formatNumber(totalResults, {
      isCompact: true,
    })})`}
    url={link}
    colors={theme.buttonColors.yellowYellowBlack}
    hoverUnderline
  />
);
