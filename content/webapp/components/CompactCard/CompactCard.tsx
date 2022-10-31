import {
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import EventDateRange from '../EventDateRange/EventDateRange';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import { Label } from '@weco/common/model/labels';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import ImageType from '@weco/common/views/components/PrismicImage/PrismicImage';
import { ColorSelection } from '../../types/color-selections';
import MediaObjectBase, {
  HasImageProps,
} from '../MediaObjectBase/MediaObjectBase';

type Props = {
  url?: string;
  title: string;
  primaryLabels: Label[];
  secondaryLabels: Label[];
  description?: string | ReactElement;
  urlOverride?: string;
  extraClasses?: string;
  partNumber?: number;
  partDescription?: 'Part' | 'Episode';
  Image?: ReactElement<typeof ImageType | typeof ImagePlaceholder>;
  partNumberColor?: ColorSelection;
  DateInfo?:
    | ReactElement<typeof DateRange>
    | ReactElement<typeof EventDateRange>;
  StatusIndicator?: ReactElement<typeof StatusIndicator>;
  ExtraInfo?: ReactNode;
  xOfY?: { x: number; y: number };
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
  partNumberColor,
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
      partNumberColor={partNumberColor}
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
