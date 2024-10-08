import {
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';
import styled from 'styled-components';

import { Label } from '@weco/common/model/labels';
import { classNames, font, grid } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import { gridSize12 } from '@weco/common/views/components/Layout';
import ImageType from '@weco/common/views/components/PrismicImage/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import EventDateRange from '@weco/content/components/EventDateRange';
import ImagePlaceholder from '@weco/content/components/ImagePlaceholder/ImagePlaceholder';
import PartNumberIndicator from '@weco/content/components/PartNumberIndicator/PartNumberIndicator';
import StatusIndicator from '@weco/content/components/StatusIndicator/StatusIndicator';
import { ColorSelection } from '@weco/content/types/color-selections';

export type Props = {
  url?: string;
  title: string;
  primaryLabels: Label[];
  secondaryLabels: Label[];
  description?: string | ReactElement;
  urlOverride?: string;
  extraClasses?: string;
  partNumber?: number;
  partDescription?: 'Part' | 'Episode';
  partNumberColor?: ColorSelection;
  Image?: ReactElement<typeof ImageType | typeof ImagePlaceholder>;
  DateInfo?: ReactElement<typeof EventDateRange>;
  StatusIndicator?: ReactElement<typeof StatusIndicator>;
  ExtraInfo?: ReactNode;
  xOfY?: { x: number; y: number };
  OverrideImageWrapper?: ComponentType<HasImageProps>;
  OverrideTextWrapper?: ComponentType<HasImageProps>;
  OverrideTitleWrapper?: ComponentType;
  onClick?: () => void;
  postTitleChildren?: ReactElement;
};

const BaseImageWrapper = styled.div.attrs({
  className: grid({ s: 3, m: 3, l: 3, xl: 3 }),
})``;

const BaseTitleWrapper = styled.h3.attrs({
  className: font('wb', 3),
})`
  margin: 0;
`;

export type HasImageProps = {
  $hasImage: boolean;
};

// Ability to add custom prop types in TS and styled components
const BaseTextWrapper = styled.div.attrs<HasImageProps>(props => ({
  className: props.$hasImage
    ? grid({ s: 9, m: 9, l: 9, xl: 9 })
    : grid(gridSize12()),
}))<HasImageProps>``;

type LinkOrDivSpaceAttrs = {
  $url?: string;
};
const LinkOrDivSpace = styled(Space).attrs<LinkOrDivSpaceAttrs>(props => ({
  as: props.$url ? 'a' : 'div',
  href: props.$url,
}))<LinkOrDivSpaceAttrs>`
  text-decoration: none;

  &:hover,
  &:focus {
    h3 {
      text-decoration: underline;
      text-decoration-color: ${props => props.theme.color('black')};
    }
  }
`;

const MediaObjectBase: FunctionComponent<Props> = ({
  url,
  title,
  primaryLabels,
  secondaryLabels,
  description,
  urlOverride,
  extraClasses,
  partNumber,
  partDescription,
  partNumberColor,
  Image,
  DateInfo,
  StatusIndicator,
  ExtraInfo,
  xOfY,
  OverrideImageWrapper,
  OverrideTextWrapper,
  OverrideTitleWrapper,
  onClick,
  postTitleChildren,
}: Props): ReactElement<Props> => {
  const { x, y } = xOfY || {};
  const ImageWrapper = OverrideImageWrapper || BaseImageWrapper;
  const TextWrapper = OverrideTextWrapper || BaseTextWrapper;
  const TitleWrapper = OverrideTitleWrapper || BaseTitleWrapper;
  const descriptionIsString = typeof description === 'string';
  const urlProp = urlOverride || url || undefined;

  return (
    <LinkOrDivSpace
      className={classNames({
        grid: true,
        [extraClasses || '']: Boolean(extraClasses),
      })}
      $v={{
        size: 'l',
        properties:
          x === y ? ['padding-top'] : ['padding-top', 'padding-bottom'],
      }}
      $url={urlProp}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      <ImageWrapper $hasImage={Boolean(Image)}>{Image}</ImageWrapper>
      <TextWrapper $hasImage={Boolean(Image)}>
        {primaryLabels.length > 0 && (
          <Space
            $v={{ size: 's', properties: ['margin-bottom'] }}
            style={{ display: 'flex' }}
          >
            <LabelsList labels={primaryLabels} />
          </Space>
        )}

        {partNumber && (
          <PartNumberIndicator
            number={partNumber}
            description={partDescription}
            backgroundColor={partNumberColor}
          />
        )}
        <TitleWrapper>{title}</TitleWrapper>
        {postTitleChildren || DateInfo}
        {StatusIndicator}
        {ExtraInfo}

        {description && (
          <div className={`spaced-text ${font('intr', 5)}`}>
            {descriptionIsString ? <p>{description}</p> : description}
          </div>
        )}
        {secondaryLabels.length > 0 && (
          <Space
            $v={{ size: 's', properties: ['margin-top'] }}
            style={{ display: 'flex' }}
          >
            <LabelsList labels={secondaryLabels} defaultLabelColor="black" />
          </Space>
        )}
      </TextWrapper>
    </LinkOrDivSpace>
  );
};

export default MediaObjectBase;
