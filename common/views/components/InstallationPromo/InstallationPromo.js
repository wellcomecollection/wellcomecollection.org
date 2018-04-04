// @flow
import {spacing, font} from '../../../utils/classnames';
import {striptags} from '../../../utils/striptags';
// import {formatDate, formatDateRangeWithMessage} from '../../../utils/format-date';
import Image from '../Image/Image';
// import Icon from '../Icon/Icon';
// import {Fragment} from 'react';
import type {Picture} from '../../../model/picture';
import type {HTMLString} from '../services/prismic/types';

type Props = {|
  id: string,
  title: string,
  description: HTMLString,
  image: Picture,
  start: Date,
  end: ?Date
|}

function timeOrDescription(start, end, description) { // TODO not sure if it makes sense to show the dates?
  // if (start && end) {
  //   return (
  //     <Fragment>
  //       <time dateTime={start.toString()}>{formatDate(start)}</time>&mdash;<time dateTime={end.toString()}>{formatDate(end)}</time>
  //     </Fragment>
  //   );
  // } else {
  return striptags(description);
  // }
}

// function statusColor(start, end, formatDateRangeWithMessage) {
//   const dateMessageAndColor = formatDateRangeWithMessage(start, end);
//   return dateMessageAndColor.color;
// }

// function statusText(start, end, formatDateRangeWithMessage) {
//   const dateMessageAndColor = formatDateRangeWithMessage(start, end);
//   return dateMessageAndColor.text;
// }

const InstallationPromo = ({ id, title, description, image, start, end }: Props) => (
  <a
    data-component='InstallationPromo'
    data-track-event={JSON.stringify({
      category: 'component',
      action: 'InstallationPromo:click'
    })}
    id={id}
    href={`/installations/${id}`}
    className='plain-link promo-link bg-cream rounded-corners overflow-hidden flex flex--column'>
    <Image
      width={image.width || 0}
      contentUrl={image.contentUrl || ''}
      lazyload={true}
      sizesQueries='(min-width: 1420px) 282px, (min-width: 960px) calc(21.36vw - 17px), (min-width: 600px) calc(41.76vw - 50px), calc(75vw - 18px)'
      alt='' />
    <div className={`
      ${spacing({s: 2}, {padding: ['top']})}
      ${spacing({s: 3}, {padding: ['left', 'right']})}
      ${spacing({s: 4}, {padding: ['bottom']})}
      flex flex--column flex-1`}>

      <p className={`no-padding ${spacing({s: 2}, {margin: ['bottom']})} ${font({s: 'HNM5'})}`}>
        {!end && 'Permanent installation' || 'Installation'}
      </p>

      <h2 className={`promo-link__title ${font({s: 'WB5'})} ${spacing({s: 0}, {margin: ['top']})}`}>{title}</h2>

      <p className={`${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})} no-padding`}>
        {timeOrDescription(start, end, description)}
      </p>
      {/* TODO - not sure if it makes sense to show status
        <div className='flex flex--h-space-between flex--wrap margin-top-auto'>
          <span className={`${font({s: 'HNM5'})} flex flex--v-center`}>
            <span className={`${spacing({s: 1}, {margin: ['right']})} flex flex--v-center`}>
              <Icon name='statusIndicator' extraClasses={`icon--${statusColor(start, end, formatDateRangeWithMessage)} icon--match-text`} />
            </span>
            {statusText(start, end, formatDateRangeWithMessage)}
          </span>
        </div>
      */}
    </div>
  </a>
);

export default InstallationPromo;
