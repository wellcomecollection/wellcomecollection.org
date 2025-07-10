import {
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';
import styled from 'styled-components';

import { Label } from '@weco/common/model/labels';
import { classNames, font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList';
import { gridSize12 } from '@weco/common/views/components/Layout';
import ImageType from '@weco/common/views/components/PrismicImage';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { ColorSelection } from '@weco/content/types/color-selections';
import EventDateRange from '@weco/content/views/components/EventDateRange';
import ImagePlaceholder from '@weco/content/views/components/ImagePlaceholder';
import PartNumberIndicator from '@weco/content/views/components/PartNumberIndicator';
import StatusIndicator from '@weco/content/views/components/StatusIndicator';

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
  OverrideTitleWrapper?: ComponentType<{ children: ReactNode }>;
  onClick?: () => void;
  postTitleChildren?: ReactElement;
};

const BaseTitleWrapper = styled.h3.attrs({
  className: font('wb', 3),
})`
  margin: 0;
`;

export type HasImageProps = {
  $hasImage: boolean;
};

type LinkOrDivSpaceAttrs = {
  $url?: string;
};
const LinkOrDivSpace = styled(Space).attrs<LinkOrDivSpaceAttrs>(props => ({
  as: props.$url ? 'a' : 'div',
  href: props.$url,
}))<LinkOrDivSpaceAttrs>`
  text-decoration: none;
  display: block;

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
  const ImageWrapper = OverrideImageWrapper || GridCell;
  const TextWrapper = OverrideTextWrapper || GridCell;
  const TitleWrapper: ComponentType<{ children: ReactNode }> =
    OverrideTitleWrapper || BaseTitleWrapper;
  const descriptionIsString = typeof description === 'string';
  const urlProp = urlOverride || url || undefined;

  return (
    <LinkOrDivSpace
      className={classNames({
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
      <Grid>
        <ImageWrapper
          $sizeMap={{ s: [3, 1], m: [3, 1], l: [3, 1], xl: [3, 1] }}
          $hasImage={Boolean(Image)}
        >
          {Image}
        </ImageWrapper>
        <TextWrapper
          $sizeMap={
            Image
              ? { s: [9, 4], m: [9, 4], l: [9, 4], xl: [9, 4] }
              : gridSize12()
          }
          $hasImage={Boolean(Image)}
        >
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
      </Grid>
    </LinkOrDivSpace>
  );
};

export default MediaObjectBase;
