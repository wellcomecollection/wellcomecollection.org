// @flow
// TODO modifiers/extraClasses

import {convertImageUri} from '../../../utils/convert-image-uri';
import {font} from '../../../utils/classnames';
import type {Props as ImageProps} from '../Image/Image';
import Icon from '../Icon/Icon';

type Props = {|
  image?: ImageProps,
  name: string,
  twitterHandle?: string,
  description?: string
|}

const Author = ({image, name, twitterHandle, description}: Props) => (
  <div className='author'>
    <div className='author__upper'>
      {image &&
        <div className='author__image-wrap'>
          <img className='author__image' src={convertImageUri(image.contentUrl, 64)} alt={`Image of ${name}`} />
        </div>
      }
      <div className='author__details'>
        <span className={`author__name ${font({s: 'WB6'})}`}>{name}</span>
        {twitterHandle &&
          <span className={`author__twitter ${font({s: 'HNM6'})}`}>
            <a href={`https://twitter.com/${twitterHandle}`}
              className='author__link'
              aria-label={`${name} (screen name: ${twitterHandle})`}>
              <Icon name='twitter' /> @{twitterHandle}
            </a>
          </span>
        }
      </div>
    </div>
    {description &&
      <div className={`author__description ${font({s: 'LR3', m: 'LR2'})}`}>{description}</div>
    }
  </div>
);

export default Author;
