// @flow
import Image from '../Image/Image';
import {spacing, font} from '../../../utils/classnames';
import type {Props as ImageProps} from '../Image/Image';

type Props = {|
  promoType: string,
  url: string,
  title: string,
  description: ?string,
  imageProps: ?ImageProps
|}

const BasicPromo = ({
  promoType,
  url,
  title,
  description,
  imageProps
}: Props) => (
  <a
    data-component={promoType}
    data-track-event={JSON.stringify({
      category: 'component',
      action: `${promoType}:click`
    })}
    href={url}
    className='plain-link promo-link bg-cream rounded-top rounded-bottom overflow-hidden flex flex--column'
  >
    {imageProps && <Image {...imageProps} />}
    <div className={`${[
      spacing({s: 2}, {padding: ['top']}),
      spacing({s: 3}, {padding: ['left', 'right']}),
      spacing({s: 4}, {padding: ['bottom']})
    ].join(' ')} flex flex--column flex-1
    `}>
      <div className='promo__heading'>
        <div className={`promo-link__title ${font({s: 'WB5'})} ${spacing({s: 0}, {margin: ['top']})}`}>
          {title}
        </div>
      </div>

      {description &&
        <span className='promo__copy'>
          {description}
        </span>
      }
    </div>
  </a>
);

export default BasicPromo;
