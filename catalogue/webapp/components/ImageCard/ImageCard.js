// @flow
import type { NextLinkType } from '@weco/common/model/next-link-type';
import type { Props as ImageProps } from '@weco/common/views/components/Image/Image';
import { classNames, font } from '@weco/common/utils/classnames';
import Image from '@weco/common/views/components/Image/Image';
import NextLink from 'next/link';

type Props = {|
  id: string,
  image: ImageProps,
  datePublished?: string,
  title?: string,
  link: NextLinkType,
|};

const ImageCard = ({ id, image, datePublished, title, link }: Props) => {
  return (
    <NextLink {...link}>
      <a id={id} data-component="WorkPromo" className={`promo promo--work`}>
        <div
          className={`promo__image-container promo__image-container--constrained`}
        >
          <Image
            {...image}
            lazyload={true}
            sizesQueries={`(min-width: 1340px) 178px, (min-width: 960px) calc(25vw - 52px), (min-width: 600px) calc(33.24vw - 43px), calc(50vw - 27px)`}
            defaultSize={180}
          />
        </div>
        <div className={classNames(['promo__description', font('hnl', 5)])}>
          <div
            className={classNames([
              'promo__title',
              'text--truncate',
              font('hnl', 5),
            ])}
          >
            {title || `Not found`}
          </div>

          {datePublished && (
            <div
              className={classNames([
                'promo',
                'font-pewter',
                'relative',
                font('hnl', 5),
              ])}
            >
              {datePublished}
            </div>
          )}
        </div>
      </a>
    </NextLink>
  );
};

export default ImageCard;
