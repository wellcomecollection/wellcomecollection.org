import {
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';
import { trackEvent } from '../../../utils/ga';
import DateRange from '../DateRange/DateRange';
import EventDateRange from '../EventDateRange/EventDateRange';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import { Label } from '@weco/common/model/labels';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import ImageType from '../Image/Image';
import { ColorSelection } from '../../../model/color-selections';
import MediaObjectBase, {
  HasImageProps,
} from '../MediaObjectBase/MediaObjectBase';

type Props = {
  url: string | null;
  title: string;
  primaryLabels: Label[];
  secondaryLabels: Label[];
  description: string | ReactElement | null;
  urlOverride: string | null;
  extraClasses?: string;
  partNumber: number | undefined;
  partDescription?: 'Part' | 'Episode';
  color: ColorSelection | undefined;
  Image: ReactElement<typeof ImageType | typeof ImagePlaceholder> | null;
  DateInfo:
    | ReactElement<typeof DateRange>
    | ReactElement<typeof EventDateRange>
    | null;
  StatusIndicator: ReactElement<typeof StatusIndicator> | null;
  ExtraInfo?: ReactNode | null;
  xOfY: { x: number; y: number };
  OverrideImageWrapper?: ComponentType<HasImageProps>;
  OverrideTextWrapper?: ComponentType<HasImageProps>;
  OverrideTitleWrapper?: ComponentType;
  postTitleChildren?: ReactElement;
};

const CompactCard: FunctionComponent<Props> = ({
  url,
  title,
  primaryLabels,
  secondaryLabels,
  description,
  urlOverride,
  extraClasses,
  partNumber,
  partDescription = 'Part',
  color,
  Image,
  DateInfo,
  StatusIndicator,
  ExtraInfo,
  xOfY,
  OverrideImageWrapper,
  OverrideTextWrapper,
  OverrideTitleWrapper,
  postTitleChildren,
}: Props): ReactElement<Props> => {
  return (
    <MediaObjectBase
      url={url}
      title={title}
      Image={Image}
      partNumber={partNumber}
      partDescription={partDescription}
      color={color}
      StatusIndicator={StatusIndicator}
      description={description}
      urlOverride={urlOverride}
      extraClasses={extraClasses}
      DateInfo={DateInfo}
      ExtraInfo={ExtraInfo}
      primaryLabels={primaryLabels}
      secondaryLabels={secondaryLabels}
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
      postTitleChildren={postTitleChildren}
    />
  );
};

export default CompactCard;
