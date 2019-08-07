// @flow
import { type Element, type ElementProps, type Node } from 'react';
import {
  grid,
  font,
  conditionalClassNames,
  classNames,
} from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import DateRange from '../DateRange/DateRange';
import EventDateRange from '../EventDateRange/EventDateRange';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import LabelsList from '../LabelsList/LabelsList';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import PartNumberIndicator from '../PartNumberIndicator/PartNumberIndicator';
import ImageType from '../Image/Image';
import { type ColorSelection } from '../../../model/color-selections';
import Space from '../styled/Space';

type Props = {|
  url: ?string,
  title: string,
  labels: ElementProps<typeof LabelsList>,
  description: ?string,
  urlOverride: ?string,
  extraClasses?: string,
  partNumber: ?number,
  color: ?ColorSelection,
  Image: ?Element<typeof ImageType | typeof ImagePlaceholder>,
  DateInfo: ?(Element<typeof DateRange> | Element<typeof EventDateRange>),
  StatusIndicator: ?Element<typeof StatusIndicator>,
  ExtraInfo?: ?Node,
  xOfY: {| x: number, y: number |},
|};

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
}: Props) => {
  const { x, y } = xOfY;
  const textGridSizes = Image
    ? { s: 9, m: 9, l: 9, xl: 9 }
    : { s: 12, m: 12, l: 12, xl: 12 };

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
        trackEvent({
          category: 'CompactCard',
          action: 'follow link',
          label: title,
        });
      }}
    >
      {Image && (
        <div className={grid({ s: 3, m: 3, l: 3, xl: 3 })}>{Image}</div>
      )}
      <div className={grid(textGridSizes)}>
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
        <div
          className={classNames({
            'card-link__title': true,
            [font('wb', 3)]: true,
          })}
        >
          {title}
        </div>
        {DateInfo}
        {StatusIndicator}
        {ExtraInfo}
        {description && (
          <div className="spaced-text">
            <p className={font('hnl', 5)}>{description}</p>
          </div>
        )}
      </div>
    </Space>
  );
};

export default CompactCard;
