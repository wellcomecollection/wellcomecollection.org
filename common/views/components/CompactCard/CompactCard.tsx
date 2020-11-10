import { ComponentProps, ReactElement, ReactNode } from 'react';
import { trackEvent } from '../../../utils/ga';
import DateRange from '../DateRange/DateRange';
import EventDateRange from '../EventDateRange/EventDateRange';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import LabelsList from '../LabelsList/LabelsList';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import ImageType from '../Image/Image';
import { ColorSelection } from '../../../model/color-selections';
import MediaObjectBase from '../MediaObjectBase/MediaObjectBase';

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
};

const CompactCard = ({
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
}: Props) => {
  return (
    <MediaObjectBase
      url={url}
      title={title}
      Image={Image}
      partNumber={partNumber}
      color={color}
      StatusIndicator={StatusIndicator}
      description={description}
      urlOverride={urlOverride}
      extraClasses={extraClasses}
      DateInfo={DateInfo}
      ExtraInfo={ExtraInfo}
      labels={labels}
      xOfY={xOfY}
      OverrideImageWrapper={OverrideImageWrapper}
      OverrideTextWrapper={OverrideTextWrapper}
      OverrideTitleWrapper={OverrideTitleWrapper}
      onClick={(): void => {
        trackEvent({
          category: 'CompactCard',
          action: 'follow link',
          label: title,
        });
      }}
    />
  );
};

export default CompactCard;
