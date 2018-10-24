// @flow
import {Fragment} from 'react';
import {spacing, font} from '../../../utils/classnames';
import {trackGaEvent} from '../../../utils/tracking';
import {formatDate} from '../../../utils/format-date';
import {UiImage} from '../Images/Images';
import LabelsList from '../LabelsList/LabelsList';
import type {ExhibitionPromo as ExhibitionPromoProps} from '../../../model/exhibitions';
import StatusIndicator from '../StatusIndicator/StatusIndicator';

type Props = {|
  ...ExhibitionPromoProps,
  position?: number,
|}

const ExhibitionPromo = ({
  format, id, url, title, image, start, end, statusOverride,
  position = 0
}: Props) => {
  return (
    <a data-component='ExhibitionPromo'
      data-component-state={JSON.stringify({ position: position })}
      id={id}
      href={url}
      className='plain-link promo-link bg-cream rounded-corners overflow-hidden flex flex--column'
      onClick={() => trackGaEvent({
        category: 'component',
        action: 'ExhibitionPromo:click',
        label: `id:${id}, position:${position}`
      })}>
      <div className='relative'>
        {image && image.contentUrl && <UiImage {...image}
          sizesQueries='(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)'
          showTasl={false} />}

        <div style={{position: 'absolute', bottom: 0}}>
          <LabelsList labels={format ? [{url: null, text: `${format.title} exhibition`}] : [{url: null, text: 'Exhibition'}]} />
        </div>
      </div>

      <div className={`
          flex flex--column flex-1 flex--h-space-between
          ${spacing({s: 2}, {padding: ['top']})}
          ${spacing({s: 2}, {padding: ['left', 'right']})}
          ${spacing({s: 4}, {padding: ['bottom']})}
        `}>

        <div>
          <h2 className={`
            promo-link__title
            ${font({s: 'WB5'})}
            ${spacing({s: 0}, {margin: ['top']})}
            ${spacing({s: 1}, {margin: ['bottom']})}
          `}>{title}</h2>

          {!format && !statusOverride && start && end &&
            <p className={`${font({s: 'HNL4'})} no-margin no-padding`}>
              <Fragment><time dateTime={start}>{formatDate(start)}</time>—<time dateTime={end}>{formatDate(end)}</time></Fragment>
            </p>
          }

          <StatusIndicator start={start} end={end || new Date()} statusOverride={statusOverride} />
        </div>

      </div>
    </a>
  );
};

export default ExhibitionPromo;
