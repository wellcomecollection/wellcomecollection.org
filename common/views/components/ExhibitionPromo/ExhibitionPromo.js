// @flow
import {Fragment} from 'react';
import {spacing, font} from '../../../utils/classnames';
import {formatDate} from '../../../utils/format-date';
import {UiImage} from '../Images/Images';
import type {ExhibitionPromo as Props} from '../../../model/exhibitions';
import StatusIndicator from '../StatusIndicator/StatusIndicator';

const ExhibitionPromo = ({
  format, id, url, title, image, description, start, end, statusOverride
}: Props) => {
  return (
    <a data-component='ExhibitionPromo'
      data-track-event={JSON.stringify({category: 'component', action: 'ExhibitionPromo:click'})}
      id={id}
      href={url}
      className='plain-link promo-link bg-cream rounded-top rounded-bottom overflow-hidden flex flex--column'>
      {image && image.contentUrl && <UiImage
        contentUrl={image.contentUrl}
        width={image.width}
        height={image.height}
        alt={image.alt}
        tasl={image.tasl}
        sizesQueries='(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)'
        showTasl={false} />}

      <div className={`
          flex flex--column flex-1
          ${spacing({s: 2}, {padding: ['top']})}
          ${spacing({s: 3}, {padding: ['left', 'right']})}
          ${spacing({s: 4}, {padding: ['bottom']})}
        `}>
        <p className={`no-padding ${spacing({s: 2}, {margin: ['bottom']})} ${font({s: 'HNM5'})}`}>
          {format && `${format.title} exhibition`}
          {!format && `Exhibition`}
        </p>

        <h2 className={`promo-link__title ${font({s: 'WB5'})} ${spacing({s: 0}, {margin: ['top']})}`}>{title}</h2>

        <p className={`${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})} no-padding`}>
          {!format && !statusOverride && start && end &&
            <Fragment><time dateTime={start}>{formatDate(start)}</time>—<time dateTime={end}>{formatDate(end)}</time></Fragment>
          }
          {format && description}
        </p>

        <div className='flex flex--h-space-between flex--wrap margin-top-auto'>
          <StatusIndicator start={start} end={end || new Date()} statusOverride={statusOverride} />
        </div>
      </div>
    </a>
  );
};

export default ExhibitionPromo;
