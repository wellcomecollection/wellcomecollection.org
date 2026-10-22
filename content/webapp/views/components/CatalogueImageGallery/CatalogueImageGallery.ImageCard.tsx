import { theme as designSystemTheme } from '@wellcometrust/wellcome-design-system/theme';
import NextLink from 'next/link';
import { FunctionComponent, SyntheticEvent } from 'react';
import styled, { css } from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { ImageType } from '@weco/common/model/image';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import { pageBackgroundColor } from '@weco/common/views/themes/config';
import IIIFImage from '@weco/content/views/components/IIIFImage';
import { toWorksImagesLink } from '@weco/content/views/components/ImageLink';

type Props = {
  id: string;
  workId: string;
  image: ImageType;
  layout: 'raw' | 'fixed';
  onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
  background?: string;
  positionInList: number;
  /** Where the image's details open, which its tooltip says. */
  imageDetails?: 'modal' | 'sidebar';
  /** This is the image open in the sidebar. */
  isSelected?: boolean;
};

// Drawn in the space around the image, so nothing moves when it's selected
const SelectedFrame = css`
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: -10px;
    z-index: -1;
    border: 2px solid ${props => props.theme.color(pageBackgroundColor)};
    border-radius: ${designSystemTheme['border-radius'].md};
    background-color: ${props =>
      props.theme.color({ brand: 'neutral.50', legacy: 'neutral.600' })};
  }
`;

const StyledLink = styled(NextLink)<{ $isSelected: boolean }>`
  position: relative;
  display: block;
  max-width: 100%;

  ${props => props.$isSelected && SelectedFrame}
`;

const ImageCard: FunctionComponent<Props> = ({
  id,
  workId,
  image,
  layout,
  onClick,
  background,
  positionInList,
  imageDetails = 'modal',
  isSelected = false,
}: Props) => {
  const { isEnhanced } = useAppContext();

  // Choosing the image that's open in the sidebar closes it
  const sidebarTooltip = isSelected
    ? 'Close image details'
    : 'Open image details';
  const tooltip =
    imageDetails === 'sidebar' ? sidebarTooltip : 'Open modal window';

  return (
    <StyledLink
      {...toWorksImagesLink({ id, workId })}
      style={{ width: image.width }} // this is here to prevent the generation of multiple styles
      onClick={event => {
        if (onClick) {
          onClick(event);
        }
      }}
      id={id}
      $isSelected={isSelected}
      aria-current={isSelected ? 'true' : undefined}
      {...dataGtmPropsToAttributes({
        trigger: 'open_image_modal',
        'position-in-list': `${positionInList}`,
      })}
      title={isEnhanced ? tooltip : undefined}
    >
      <IIIFImage
        image={{
          contentUrl: image.contentUrl,
          width: image.width,
          height: image.height,
          alt: image.alt,
        }}
        width={300}
        layout={layout}
        background={background}
      />
    </StyledLink>
  );
};

export default ImageCard;
