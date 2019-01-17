// @flow
import type {NextLinkType} from '@weco/common/model/next-link-type';
import type {Props as ImageProps} from '../Image/Image';
import {font} from '../../../utils/classnames';
import {trackEvent} from '../../../utils/ga';
import Image from '../Image/Image';
import NextLink from 'next/link';

type Props = {|
  id: string,
  image: ImageProps,
  datePublished?: string,
  title?: string,
  link: NextLinkType
|}

const WorkPromo = ({
  id,
  image,
  datePublished,
  title,
  link
}: Props) => {
  return (
    <NextLink {...link}>
      <a
        id={id}
        data-component='WorkPromo'
        className={`promo promo--work`}
        onClick={() => {
          trackEvent({
            category: 'WorkPromo',
            action: 'follow link',
            label: id
          });
        }}>
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
