import {
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';
import {
  grid,
  font,
  conditionalClassNames,
  classNames,
} from '../../../utils/classnames';
import DateRange from '../DateRange/DateRange';
import EventDateRange from '../EventDateRange/EventDateRange';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import LabelsList from '../LabelsList/LabelsList';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import PartNumberIndicator from '../PartNumberIndicator/PartNumberIndicator';
import ImageType from '../Image/Image';
import { ColorSelection } from '../../../model/color-selections';
import Space, { VerticalSpaceProperty } from '../styled/Space';
import { Label } from '@weco/common/model/labels';
import styled from 'styled-components';

type Props = {
  url: string | null;
  title: string;
  primaryLabels: Label[];
  secondaryLabels: Label[];
  description: string | ReactElement | null;
  urlOverride: string | null;
  extraClasses?: string;
  partNumber: number | undefined;
  partDescription: 'Part' | 'Episode';
  color: ColorSelection | undefined;
  Image: ReactElement<typeof ImageType | typeof ImagePlaceholder> | null;
  DateInfo:
    | ReactElement<typeof DateRange>
    | ReactElement<typeof EventDateRange>
    | null;
  StatusIndicator: ReactElement<typeof StatusIndicator> | null;
  ExtraInfo?: ReactNode | null;
  xOfY: { x: number; y: number } | undefined;
  OverrideImageWrapper?: ComponentType<HasImageProps>;
  OverrideTextWrapper?: ComponentType<HasImageProps>;
  OverrideTitleWrapper?: ComponentType;
  onClick?: () => void;
  postTitleChildren?: ReactElement;
};

const BaseImageWrapper = styled.div.attrs({
  className: grid({ s: 3, m: 3, l: 3, xl: 3 }),
})``;

const BaseTitleWrapper = styled.div.attrs({
  className: classNames({
    'card-link__title': true,
    [font('wb', 3)]: true,
  }),
})``;

export type HasImageProps = {
  hasImage: boolean;
};

// Ability to add custom prop types in TS and styled components
const BaseTextWrapper = styled.div.attrs<HasImageProps>(props => {
  if (props.hasImage) {
    return {
      className: grid({ s: 9, m: 9, l: 9, xl: 9 }),
    };
  }
  return {
    className: grid({ s: 12, m: 12, l: 12, xl: 12 }),
  };
})<HasImageProps>``;

type LinkOrDivSpaceAttrs = {
  url?: string;
};
const LinkOrDivSpace = styled(Space).attrs<LinkOrDivSpaceAttrs>(props => ({
  as: props.url ? 'a' : 'div',
  href: props.url || undefined,
}))<LinkOrDivSpaceAttrs>``;

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
  color,
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
      v={{
        size: 'l',
        properties: [
          'padding-top',
          x === y ? undefined : 'padding-bottom',
        ].filter(Boolean) as VerticalSpaceProperty[],
      }}
      url={urlProp}
      className={conditionalClassNames({
        grid: true,
        'card-link': Boolean(url),
        [extraClasses || '']: Boolean(extraClasses),
      })}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <ImageWrapper hasImage={Boolean(Image)}>{Image}</ImageWrapper>
      <TextWrapper hasImage={Boolean(Image)}>
        {primaryLabels.length > 0 && (
          <Space
            v={{ size: 's', properties: ['margin-bottom'] }}
            className="flex"
          >
            <LabelsList labels={primaryLabels} />
          </Space>
        )}

        {partNumber && (
          <PartNumberIndicator
            number={partNumber}
            description={partDescription}
            color={color}
          />
        )}
        <TitleWrapper>{title}</TitleWrapper>
        {postTitleChildren || DateInfo}
        {StatusIndicator}
        {ExtraInfo}

        {description && (
          <div
            className={classNames({
              'spaced-text': true,
              [font('hnr', 5)]: !descriptionIsString,
            })}
          >
            {descriptionIsString ? (
              <p className={font('hnr', 5)}>{description}</p>
            ) : (
              description
            )}
          </div>
        )}
        {secondaryLabels.length > 0 && (
          <Space v={{ size: 's', properties: ['margin-top'] }} className="flex">
            <LabelsList labels={secondaryLabels} defaultLabelColor="black" />
          </Space>
        )}
      </TextWrapper>
    </LinkOrDivSpace>
  );
};

export default MediaObjectBase;
