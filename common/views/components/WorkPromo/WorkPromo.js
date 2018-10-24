// @flow
import {font} from '../../../utils/classnames';
import {trackGaEvent} from '../../../utils/tracking';
import Image from '../Image/Image';
import type {Props as ImageProps} from '../Image/Image';
import NextLink from 'next/link';

type Props = {|
  url: string,
  id: string,
  image: ImageProps,
  datePublished?: string,
  title?: string
|}

const WorkPromo = ({
  url,
  id,
  image,
  datePublished,
  title
}: Props) => {
  return (
    <NextLink
      href={`/work?id=${id}`}
      as={url}>
      <a
        id={id}
        data-component='WorkPromo'
        className={`promo promo--work`}
        onClick={() => trackGaEvent({
          category: 'component',
          action: 'WorkPromo:click',
          label: `id : ${id}`
        })}>
        <div className={`promo__image-container promo__image-container--constrained`}>
          <Image
            width={image.width}
            contentUrl={image.contentUrl}
            lazyload={true}
            sizesQueries={`(min-width: 1340px) 178px, (min-width: 960px) calc(25vw - 52px), (min-width: 600px) calc(33.24vw - 43px), calc(50vw - 27px)`}
            defaultSize={180}
            alt='' />
        </div>
        <div className={`promo__description ${font({s: 'HNL5'})}`}>
          <div className='promo__heading'>
            <h2 className={`promo__title ${font({s: 'HNL5'})} text--truncate`}>
              {title || `Not found`}
            </h2>
          </div>

          {datePublished &&
            <p className={`promo ${font({s: 'HNL5'})} font-pewter relative`}>{datePublished}</p>
          }
        </div>
      </a>
    </NextLink>
  );
};

export default WorkPromo;
