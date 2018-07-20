// @flow
import {spacing, font} from '../../../utils/classnames';
import Image from '../Image/Image';
import type {Picture} from '../../../model/picture';

type Props = {|
  id: string,
  title: string,
  description: string,
  image: Picture,
  start: Date,
  end: ?Date,
  position?: number
|}

const InstallationPromo = ({ id, title, description, image, start, end, position = 0 }: Props) => {
  return (
    <a
      data-component='InstallationPromo'
      data-component-state={JSON.stringify({ position: position })}
      data-track-event={JSON.stringify({
        category: 'component',
        action: 'InstallationPromo:click',
        label: `id: ${id}, position: ${position}`
      })}
      id={id}
      href={`/installations/${id}`}
      className='plain-link promo-link bg-cream rounded-corners overflow-hidden flex flex--column'>
      <div className='relative'>
        <Image
          width={image.width || 0}
          contentUrl={image.contentUrl || ''}
          lazyload={true}
          sizesQueries='(min-width: 1420px) 282px, (min-width: 960px) calc(21.36vw - 17px), (min-width: 600px) calc(41.76vw - 50px), calc(75vw - 18px)'
          alt='' />
        <div style={{position: 'absolute', bottom: 0}}>
          <span className={`
            line-height-1 bg-yellow
            ${font({s: 'HNM5'})}
            ${spacing({s: 1}, {padding: ['top', 'bottom', 'left', 'right']})}
          `} style={{display: 'block', float: 'left', marginRight: '1px', marginTop: '1px', whiteSpace: 'nowrap'}}>
            {!end && 'Permanent installation' || 'Installation'}
          </span>
        </div>
      </div>
      <div className={`
      ${spacing({s: 2}, {padding: ['top']})}
      ${spacing({s: 3}, {padding: ['left', 'right']})}
      ${spacing({s: 4}, {padding: ['bottom']})}
      flex flex--column flex-1`}>
        <h2 className={`promo-link__title ${font({s: 'WB5'})} ${spacing({s: 0}, {margin: ['top']})}`}>{title}</h2>

        <p className={`${font({s: 'HNL4'})} ${spacing({s: 2}, {margin: ['bottom']})} no-padding`}>
          {description}
        </p>
      </div>
    </a>
  );
};

export default InstallationPromo;
