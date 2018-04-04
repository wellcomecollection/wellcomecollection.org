// @flow
import {Fragment} from 'react';
import Hero from '../Hero/Hero';
import Icon from '../../Icon/Icon';
import {formatDate, formatDateRangeWithMessage} from '../../../../utils/format-date';
import {font, spacing} from '../../../../utils/classnames';
import type {Picture as PictureProps} from '../../../../model/picture';

type Props = {|
  title: string,
  images: PictureProps[],
  start: Date,
  end: ?Date
|}

const ExhibitionPageHeader = ({ title, start, end, images }: Props) => {
  const dateMessageAndColour = formatDateRangeWithMessage({start, end: (end || new Date())});

  return (
    <Hero
      images={images}
      whiteBox={
        <Fragment>
          <div className='flex flex--v-center flex--h-space-between'>
            <span className={`
              ${font({s: 'HNM4', m: 'HNM3'})}
              ${spacing({s: 6}, {margin: ['right']})}
            `}>Free admission</span>
            <span className={`flex flex--v-center ${font({s: 'HNM4'})}`}>
              <span className={`flex flex--v-center ${spacing({s: 1}, {margin: ['right']})}`}>
                <Icon name='statusIndicator' extraClasses={`icon--match-text icon--${dateMessageAndColour.color}`} />
              </span>
              <span>{dateMessageAndColour.text}</span>
            </span>
          </div>
          <h1 className={font({s: 'WB5', m: 'WB4', xl: 'WB3'})}>{title}</h1>
          {end &&
            <span className={font({s: 'HNL4', m: 'HNL3', l: 'HNL3', xl: 'HNL2'})}>
              <time dateTime={start}>{formatDate(start)}</time>
              &ndash;
              <time dateTime={end}>{formatDate(end)}</time>
            </span>
          }
        </Fragment>
      }>
    </Hero>
  );
};

export default ExhibitionPageHeader;

export const hidden = true;
