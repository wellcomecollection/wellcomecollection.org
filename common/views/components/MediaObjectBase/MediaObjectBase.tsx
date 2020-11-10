import { ComponentProps, ReactElement, ReactNode } from 'react';
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
// $FlowFixMe(tsx)
import PartNumberIndicator from '../PartNumberIndicator/PartNumberIndicator';
import ImageType from '../Image/Image';
import { ColorSelection } from '../../../model/color-selections';
import Space from '../styled/Space';
import styled from 'styled-components';

type Props = {
  url: string | null;
  title: string;
  labels: ComponentProps<typeof LabelsList>;
  description: string | ReactElement | null;
  urlOverride: string | null;
  extraClasses?: string;
  partNumber: number | null;
  color: ColorSelection | null;
  Image: ReactElement<typeof ImageType | typeof ImagePlaceholder> | null;
  DateInfo:
    | ReactElement<typeof DateRange>
    | ReactElement<typeof EventDateRange>
    | null;
  StatusIndicator: ReactElement<typeof StatusIndicator> | null;
  ExtraInfo?: ReactNode | null;
  xOfY: { x: number; y: number };
  OverrideImageWrapper?: ReactNode;
  OverrideTextWrapper?: ReactNode;
  OverrideTitleWrapper?: ReactNode;
  onClick?: () => void;
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

export type TextWrapperProp = {
  hasImage: boolean;
};

// Ability to add custom prop types in TS and styled components
const BaseTextWrapper = styled.div.attrs<TextWrapperProp>(props => {
  if (props.hasImage) {
    return {
      className: grid({ s: 9, m: 9, l: 9, xl: 9 }),
    };
  }
  return {
    className: grid({ s: 12, m: 12, l: 12, xl: 12 }),
  };
})<TextWrapperProp>``;

const MediaObjectBase = ({
  url,
  title,
  labels,
  description,
  urlOverride,
  extraClasses,
  partNumber,
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
}: Props): JSX.Element => {
  const { x, y } = xOfY;
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
        {labels.labels.length > 0 && (
          <Space
            v={{ size: 's', properties: ['margin-bottom'] }}
            className="flex"
          >
            <LabelsList {...labels} />
          </Space>
        )}
        {partNumber && (
          <PartNumberIndicator number={partNumber} color={color} />
        )}
        <TitleWrapper>{title}</TitleWrapper>
        {DateInfo}
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
      </TextWrapper>
    </Space>
  );
};

export default MediaObjectBase;
