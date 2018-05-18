// @flow
import {Fragment} from 'react';
import Hero from '../Hero/Hero';
import StatusIndicator from '../../StatusIndicator/StatusIndicator';
import {formatDate} from '../../../../utils/format-date';
import {font, spacing} from '../../../../utils/classnames';
import type {Picture as PictureProps} from '../../../../model/picture';

type Props = {|
  title: string,
  images: PictureProps[],
  start: Date,
  end: ?Date,
  statusOverride: ?string
|}

const ExhibitionPageHeader = ({ title, start, end, statusOverride, images }: Props) => {
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
            <StatusIndicator start={start} end={end || new Date()} statusOverride={statusOverride} />
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
