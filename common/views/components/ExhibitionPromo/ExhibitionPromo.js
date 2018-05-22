// @flow
import {Fragment} from 'react';
import {spacing, font} from '../../../utils/classnames';
import {formatDate} from '../../../utils/format-date';
import {UiImage} from '../Images/Images';
import type {ExhibitionPromo as Props} from '../../../model/exhibitions';
import StatusIndicator from '../StatusIndicator/StatusIndicator';

const labelStyles = {display: 'block', float: 'left', marginRight: '1px', marginTop: '1px', whiteSpace: 'nowrap'};

function label(text) {
  return (
    <span className={`
      line-height-1 bg-yellow
      ${font({s: 'HNM5'})}
      ${spacing({s: 1}, {padding: ['top', 'bottom', 'left', 'right']})}
    `} style={labelStyles}>
      {text}
    </span>
  );
}

const ExhibitionPromo = ({
  format, id, url, title, image, description, start, end, statusOverride
}: Props) => {
  return (
    <a data-component='ExhibitionPromo'
      data-track-event={JSON.stringify({category: 'component', action: 'ExhibitionPromo:click'})}
      id={id}
      href={url}
      className='plain-link promo-link bg-cream rounded-corners overflow-hidden flex flex--column'>
      <div className={`promo__image-container`}>
        <UiImage
          contentUrl={image.contentUrl}
          width={image.width}
          height={image.height}
          alt={image.alt}
          tasl={image.tasl}
          sizesQueries='(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)'
          showTasl={false} />

        <div style={{position: 'absolute', bottom: 0}}>
          {format && label(`${format.title} exhibition`)}
          {!format && label('Exhibition')}
        </div>
      </div>

      <div className={`
          flex flex--column flex-1 flex--h-space-between
          ${spacing({s: 2}, {padding: ['top']})}
          ${spacing({s: 3}, {padding: ['left', 'right']})}
          ${spacing({s: 4}, {padding: ['bottom']})}
        `}>

        <div>
          <h2 className={`
            promo-link__title
            ${font({s: 'WB5'})}
            ${spacing({s: 0}, {margin: ['top']})}
            ${spacing({s: 1}, {margin: ['bottom']})}
          `}>{title}</h2>

          <p className={`${font({s: 'HNL4'})} no-margin no-padding`}>
            {!format && !statusOverride && start && end &&
              <Fragment><time dateTime={start}>{formatDate(start)}</time>—<time dateTime={end}>{formatDate(end)}</time></Fragment>
            }
            {format && description}
          </p>

          <StatusIndicator start={start} end={end || new Date()} statusOverride={statusOverride} />
        </div>

      </div>
    </a>
  );
};

export default ExhibitionPromo;
