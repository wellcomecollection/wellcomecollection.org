import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import { arrow } from '@weco/common/icons';
import { FC } from 'react';
import { PaletteColor } from '@weco/common/views/themes/config';
import { LinkProps } from 'next/link';

type Props = {
  text: string;
  link: LinkProps | string;
  leadingColor: PaletteColor;
};

// TODO change to use ButtonSolid when refactor is over (with David)
export const SeeMoreButton: FC<Props> = ({ text, link, leadingColor }) => (
  <ButtonSolidLink
    text={text}
    link={link}
    icon={arrow}
    isIconAfter={true}
    colors={{
      border: leadingColor,
      background: leadingColor,
      text: 'black',
    }}
    hoverUnderline={true}
  />
);
