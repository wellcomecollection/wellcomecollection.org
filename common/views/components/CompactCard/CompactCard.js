// @flow
import type {Element, ElementProps} from 'react';
import {grid, font, spacing, conditionalClassNames} from '../../../utils/classnames';
import DateRange from '../DateRange/DateRange';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import LabelsList from '../LabelsList/LabelsList';
import {default as ImageType} from '../Image/Image';

type Props = {|
  url: string,
  title: string,
  promoType: string,
  labels: ElementProps<typeof LabelsList>,
  description: ?string,
  urlOverride: ?string,
  extraClasses?: string,
  Image: ?Element<typeof ImageType>,
  DateInfo: ?Element<typeof DateRange>,
  StatusIndicator: ?Element<typeof StatusIndicator>
|}

const CompactCard = ({
  url,
  title,
  promoType,
  labels,
  description,
  urlOverride,
  extraClasses,
  Image,
  DateInfo,
  StatusIndicator
}: Props) => {
  const textGridSizes = Image
    ? {s: 7, m: 7, l: 8, xl: 8}
    : {s: 12, m: 12, l: 12, xl: 12};
  return (
    <a
      data-component={promoType}
      data-track-event={JSON.stringify({
        category: 'component',
        action: `${promoType}:click`
      })}
      href={urlOverride || url}
      className={conditionalClassNames({
        'grid plain-link': true,
        [spacing({s: 3}, {padding: ['bottom', 'top']})]: true,
        [extraClasses || '']: Boolean(extraClasses)
      })}>
      {labels.labels.length > 0 &&
        <div className={conditionalClassNames({
          [grid({s: 12, m: 12, l: 12, xl: 12})]: true,
          [spacing({s: 1}, {margin: ['bottom']})]: true
        })}>
          <LabelsList {...labels} />
        </div>
      }
      {Image &&
        <div className={grid({s: 5, m: 5, l: 4, xl: 4})}>
          {Image}
        </div>
      }
      <div className={grid(textGridSizes)}>
        <div className={`${font({s: 'WB5'})} ${spacing({s: 0}, {margin: ['top']})}`}>
          {title}
        </div>
        {DateRange &&
          <div>
            {DateInfo}
          </div>
        }
        {StatusIndicator}
        {description &&
        <span className={[
          spacing({s: 2}, {margin: ['top']}),
          font({s: 'HNL4'})
        ].join(' ')}>
          {description}
        </span>
        }
      </div>
    </a>
  );
};

export default CompactCard;
