import {
  ComponentProps,
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
import Space from '../styled/Space';
import styled from 'styled-components';
import { WatchWrapper, WatchText } from '../styled/Watch';

type Props = {
  url: string | null;
  title: string;
  primaryLabels: ComponentProps<typeof LabelsList>;
  secondaryLabels: ComponentProps<typeof LabelsList>;
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
  showPlayButton?: boolean;
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
  showPlayButton = false,
  onClick,
}: Props): ReactElement<Props> => {
  const { x, y } = xOfY || {};
  const ImageWrapper = OverrideImageWrapper || BaseImageWrapper;
  const TextWrapper = OverrideTextWrapper || BaseTextWrapper;
  const TitleWrapper = OverrideTitleWrapper || BaseTitleWrapper;
  const descriptionIsString = typeof description === 'string';
  return (
    <Space
      v={{
        size: 'l',
        properties: [
          'padding-top',
          x === y ? undefined : 'padding-bottom',
        ].filter(Boolean),
      }}
      as={url ? 'a' : 'div'}
      href={urlOverride || url}
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
        {showPlayButton && (
          <Space
            as={WatchWrapper}
            v={{
              size: 's',
              properties: ['margin-top'],
            }}
          >
            <Space
              as={WatchText}
              h={{
                size: 's',
                properties: ['margin-left'],
              }}
              v={{
                size: 'l',
                properties: ['margin-bottom'],
              }}
            >
              {DateInfo}
            </Space>
          </Space>
        )}
        {!showPlayButton && DateInfo}
        {StatusIndicator}
        {ExtraInfo}

        {description && (
          <div
            className={classNames({
              'spaced-text': true,
              [font('hnl', 5)]: !descriptionIsString,
            })}
          >
            {descriptionIsString ? (
              <p className={font('hnl', 5)}>{description}</p>
            ) : (
              description
            )}
          </div>
        )}
        {secondaryLabels.length > 0 && (
          <Space v={{ size: 's', properties: ['margin-top'] }} className="flex">
            <LabelsList
              labels={secondaryLabels}
              labelColor="black"
              roundedDiagonal={true}
            />
          </Space>
        )}
      </TextWrapper>
    </Space>
  );
};

export default MediaObjectBase;
